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

const debugSignature = false

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
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return null

  await updating?.(textDocument)

  // Keep in sync with server's tsSuffix
  
  const options: ts.SignatureHelpItemsOptions = {};
  if (context) {
    if (context.isRetrigger) {
      options.triggerReason = { kind: 'retrigger' };
    } else if (context.triggerKind === SignatureHelpTriggerKind.TriggerCharacter && context.triggerCharacter && isTriggerCharacter(context.triggerCharacter)) {
      options.triggerReason = { kind: 'characterTyped', triggerCharacter: context.triggerCharacter };
    } else if (context.triggerKind === SignatureHelpTriggerKind.Invoked) {
      options.triggerReason = { kind: 'invoked' };
    }
  }

  let signatureHelp: SignatureHelpItems | undefined
  let targetPath: string
  let targetOffset: number

  // Non-transpiled (plain TS/JS/etc)
  if (sourcePath.match(tsSuffix)) {
    // Prefer live TextDocument when available for accuracy
    const doc = deps.documents.get(textDocument.uri)
    if (doc) {
      targetPath = sourcePath
      targetOffset = doc.offsetAt(position)
    } else {
      const sourceFile = service.getProgram()?.getSourceFile(sourcePath)
      if (!sourceFile) return null
      targetPath = sourcePath
      targetOffset = sourceFile.getPositionOfLineAndCharacter(position.line, position.character)
    }
  } else {
    // Transpiled (.civet)
    const meta = service.host.getMeta(sourcePath)
    if (!meta) return null
    const { sourcemapLines, transpiledDoc } = meta
    if (!transpiledDoc) return null

    let mappedPos = position
    if (sourcemapLines) {
      mappedPos = forwardMap(sourcemapLines, position)
    }

    targetOffset = transpiledDoc.offsetAt(mappedPos)
    targetPath = documentToSourcePath(transpiledDoc)
  }
  
  // Debug breadcrumb to aid future investigations
  if (debugSignature) { try { console.debug(`[SIGHELP] target=${targetPath}:${targetOffset}`) } catch {} }

  signatureHelp = service.getSignatureHelpItems(targetPath, targetOffset, options)

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
