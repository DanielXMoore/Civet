import {
  SignatureHelp,
  SignatureHelpTriggerKind,
  SignatureHelpContext,
  TextDocumentIdentifier,
  MarkupKind,
} from 'vscode-languageserver/node';
import ts, { displayPartsToString, SignatureHelpItems } from 'typescript';
import { forwardMap, tsSuffix } from '../lib/util.mjs';
import type { FeatureDeps } from '../../types/types.d';

function isTriggerCharacter(char: string): char is ts.SignatureHelpTriggerCharacter {
  return char === '(' || char === ',' || char === '<';
}

export async function handleSignatureHelp(
  params: { textDocument: TextDocumentIdentifier, position: { line: number, character: number }, context?: SignatureHelpContext },
  deps: FeatureDeps
) {
  const { textDocument, position, context } = params
  const { ensureServiceForSourcePath, documentToSourcePath, updating } = deps
  const sourcePath = documentToSourcePath(textDocument)
  
  if (deps.debug.signatureHelp) {
    console.debug(`[SIGHELP] Request received:`, {
      uri: textDocument.uri,
      sourcePath,
      position,
      triggerKind: context?.triggerKind,
      triggerCharacter: context?.triggerCharacter,
      isRetrigger: context?.isRetrigger
    });
  }
  
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) {
    if (deps.debug.signatureHelp) console.debug(`[SIGHELP] No service found for ${sourcePath}`);
    return null;
  }

  await updating?.(textDocument)

  // Keep in sync with server's tsSuffix
  
  const options: ts.SignatureHelpItemsOptions = {};
  if (context) {
    if (context.isRetrigger) {
      options.triggerReason = { kind: 'retrigger' };
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Retrigger context`);
    } else if (context.triggerKind === SignatureHelpTriggerKind.TriggerCharacter && context.triggerCharacter && isTriggerCharacter(context.triggerCharacter)) {
      options.triggerReason = { kind: 'characterTyped', triggerCharacter: context.triggerCharacter };
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Trigger character: '${context.triggerCharacter}'`);
    } else if (context.triggerKind === SignatureHelpTriggerKind.Invoked) {
      options.triggerReason = { kind: 'invoked' };
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Manually invoked`);
    }
  } else {
    if (deps.debug.signatureHelp) console.debug(`[SIGHELP] No context provided`);
  }

  let signatureHelp: SignatureHelpItems | undefined
  let targetPath: string
  let targetOffset: number

  // Non-transpiled (plain TS/JS/etc)
  if (sourcePath.match(tsSuffix)) {
    if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Non-transpiled file (TS/JS): ${sourcePath}`);
    // Prefer live TextDocument when available for accuracy
    const doc = deps.documents.get(textDocument.uri)
    if (doc) {
      targetPath = sourcePath
      targetOffset = doc.offsetAt(position)
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Using live document, offset: ${targetOffset}`);
    } else {
      const sourceFile = service.getProgram()?.getSourceFile(sourcePath)
      if (!sourceFile) {
        if (deps.debug.signatureHelp) console.debug(`[SIGHELP] No source file found in program for ${sourcePath}`);
        return null;
      }
      targetPath = sourcePath
      targetOffset = sourceFile.getPositionOfLineAndCharacter(position.line, position.character)
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Using source file, offset: ${targetOffset}`);
    }
  } else {
    // Transpiled (.civet)
    if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Transpiled file (.civet): ${sourcePath}`);
    
    const meta = service.host.getMeta(sourcePath)
    if (!meta) {
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] No meta found for ${sourcePath}`);
      return null;
    }
    
    const { sourcemapLines, transpiledDoc } = meta
    if (!transpiledDoc) {
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] No transpiled doc found in meta`);
      return null;
    }

    if (deps.debug.signatureHelp) {
      console.debug(`[SIGHELP] Original position:`, position);
      console.debug(`[SIGHELP] Has sourcemap lines:`, !!sourcemapLines);
    }

    let mappedPos = position
    if (sourcemapLines) {
      mappedPos = forwardMap(sourcemapLines, position)
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Mapped position:`, mappedPos);
    } else {
      if (deps.debug.signatureHelp) console.debug(`[SIGHELP] No sourcemap, using original position`);
      // Abort on '<' when parse failed (no sourcemap), since TS buffer is unreliable
      if (context?.triggerCharacter === '<') {
        if (deps.debug.signatureHelp) console.debug(`[SIGHELP] Aborting on '<' trigger due to Civet parse error (no sourcemap).`);
        return null;
      }
    }

    targetOffset = transpiledDoc.offsetAt(mappedPos)
    targetPath = documentToSourcePath(transpiledDoc)

    if (deps.debug.signatureHelp) {
      console.debug(`[SIGHELP] Target transpiled path: ${targetPath}`);
      console.debug(`[SIGHELP] Target offset: ${targetOffset}`);
    }
  }
  
  // Debug breadcrumb to aid future investigations
  if (deps.debug.signatureHelp) { 
    console.debug(`[SIGHELP] Final target=${targetPath}:${targetOffset}`);
    
    // Let's see what's actually in the transpiled buffer at this position
    const program = service.getProgram();
    const sourceFile = program?.getSourceFile(targetPath);
    if (sourceFile) {
      const text = sourceFile.getFullText();
      const startPos = Math.max(0, targetOffset - 20);
      const endPos = Math.min(text.length, targetOffset + 20);
      const snippet = text.substring(startPos, endPos);
      const marker = ' '.repeat(Math.min(20, targetOffset - startPos)) + '^';
      console.debug(`[SIGHELP] Transpiled buffer around offset ${targetOffset}:`);
      console.debug(`[SIGHELP] Text: "${snippet}"`);
      console.debug(`[SIGHELP] Pos:   ${marker}`);
    }
    
    console.debug(`[SIGHELP] Calling TypeScript getSignatureHelpItems with options:`, options);
  }

  signatureHelp = service.getSignatureHelpItems(targetPath, targetOffset, options)

  if (deps.debug.signatureHelp) {
    if (signatureHelp) {
      console.debug(`[SIGHELP] TypeScript returned signature help:`, {
        selectedItemIndex: signatureHelp.selectedItemIndex,
        argumentIndex: signatureHelp.argumentIndex,
        itemCount: signatureHelp.items.length,
        items: signatureHelp.items.map(item => ({
          name: item.prefixDisplayParts?.[0]?.text || 'unknown',
          paramCount: item.parameters.length
        }))
      });
    } else {
      console.debug(`[SIGHELP] TypeScript returned no signature help`);
    }
  }

  if (!signatureHelp) return null;

  return convertTsSignatureHelpToLsp(signatureHelp)
}

function convertTsSignatureHelpToLsp(tsHelp: SignatureHelpItems): SignatureHelp {
  const signatures = tsHelp.items.map(item => {
    const label = displayPartsToString(item.prefixDisplayParts) +
      item.parameters.map(p => displayPartsToString(p.displayParts)).join(displayPartsToString(item.separatorDisplayParts)) +
      displayPartsToString(item.suffixDisplayParts);

    const parameters = item.parameters.map(p => {
      return {
        label: displayPartsToString(p.displayParts),
        documentation: {
          kind: MarkupKind.Markdown,
          value: displayPartsToString(p.documentation)
        }
      };
    });

    const sigInfo = {
      label,
      documentation: {
        kind: MarkupKind.Markdown,
        value: displayPartsToString(item.documentation)
      },
      parameters
    } as const;
    return sigInfo;
  });

  return {
    signatures,
    activeSignature: tsHelp.selectedItemIndex,
    activeParameter: tsHelp.argumentIndex,
  };
}
