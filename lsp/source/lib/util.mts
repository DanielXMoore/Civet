import ts from 'typescript';
import type {
  Diagnostic,
  NavigationBarItem,
  NavigationTree,
  TextSpan,
} from 'typescript';
const { DiagnosticCategory, ScriptElementKind, ScriptElementKindModifier } = ts;
import vs, {
  CompletionItemKind,
  DiagnosticSeverity,
  DocumentSymbol,
  Position,
  Range,
  SymbolKind,
  SymbolTag,
} from 'vscode-languageserver';

import { TextDocument } from 'vscode-languageserver-textdocument';
import assert from 'assert';
import { SourceMap } from '@danielx/civet';
import {
  flattenDiagnosticMessageText,
  remapRange,
} from '@danielx/civet/ts-diagnostic';

export type SourcemapLines = SourceMap['lines'];

export {
  flattenDiagnosticMessageText,
  remapPosition,
  remapRange,
} from '@danielx/civet/ts-diagnostic';

// https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/documentSymbol.ts#L63

const getSymbolKind = (kind: ts.ScriptElementKind): SymbolKind => {
  switch (kind) {
    case ScriptElementKind.moduleElement: return SymbolKind.Module;
    case ScriptElementKind.classElement: return SymbolKind.Class;
    case ScriptElementKind.enumElement: return SymbolKind.Enum;
    case ScriptElementKind.interfaceElement: return SymbolKind.Interface;
    case ScriptElementKind.memberFunctionElement: return SymbolKind.Method;
    case ScriptElementKind.memberVariableElement: return SymbolKind.Property;
    case ScriptElementKind.memberGetAccessorElement: return SymbolKind.Property;
    case ScriptElementKind.memberSetAccessorElement: return SymbolKind.Property;
    case ScriptElementKind.variableElement: return SymbolKind.Variable;
    case ScriptElementKind.constElement: return SymbolKind.Variable;
    case ScriptElementKind.localVariableElement: return SymbolKind.Variable;
    case ScriptElementKind.functionElement: return SymbolKind.Function;
    case ScriptElementKind.localFunctionElement: return SymbolKind.Function;
    case ScriptElementKind.constructSignatureElement: return SymbolKind.Constructor;
    case ScriptElementKind.constructorImplementationElement: return SymbolKind.Constructor;
  }
  return SymbolKind.Variable;
};

// https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/completions.ts
export function getCompletionItemKind(kind: string): CompletionItemKind {
  switch (kind) {
    case ScriptElementKind.primitiveType:
    case ScriptElementKind.keyword:
      return CompletionItemKind.Keyword;

    case ScriptElementKind.constElement:
    case ScriptElementKind.letElement:
    case ScriptElementKind.variableElement:
    case ScriptElementKind.localVariableElement:
    case ScriptElementKind.alias:
    case ScriptElementKind.parameterElement:
      return CompletionItemKind.Variable;

    case ScriptElementKind.memberVariableElement:
    case ScriptElementKind.memberGetAccessorElement:
    case ScriptElementKind.memberSetAccessorElement:
      return CompletionItemKind.Field;

    case ScriptElementKind.functionElement:
    case ScriptElementKind.localFunctionElement:
      return CompletionItemKind.Function;

    case ScriptElementKind.constructSignatureElement:
    case ScriptElementKind.callSignatureElement:
    case ScriptElementKind.indexSignatureElement:
      return CompletionItemKind.Method;

    case ScriptElementKind.enumElement:
      return CompletionItemKind.Enum;

    case ScriptElementKind.enumMemberElement:
      return CompletionItemKind.EnumMember;

    case ScriptElementKind.moduleElement:
    case ScriptElementKind.externalModuleName:
      return CompletionItemKind.Module;

    case ScriptElementKind.classElement:
    case ScriptElementKind.typeElement:
      return CompletionItemKind.Class;

    case ScriptElementKind.interfaceElement:
      return CompletionItemKind.Interface;

    case ScriptElementKind.warning:
      return CompletionItemKind.Text;

    case ScriptElementKind.scriptElement:
      return CompletionItemKind.File;

    case ScriptElementKind.directory:
      return CompletionItemKind.Folder;

    case ScriptElementKind.string:
      return CompletionItemKind.Constant;

    default:
      return CompletionItemKind.Property;
  }
}

/**
 * @param lineTable Table of line lengths in generated TypeScript code
 * @param sourcemapLines Lines of sourcemapping to convert generated TypeScript positions to source Civet positions
 * @param output Symbols to display in VSCode Outline
 * @param item
 */
export function convertNavTree(
  item: NavigationTree,
  output: DocumentSymbol[],
  document: TextDocument,
  sourcemapLines: SourcemapLines | undefined,

): boolean {
  let shouldInclude = shouldIncludeEntry(item);
  if (!shouldInclude && !item.childItems?.length) {
    return false;
  }

  const children = new Set(item.childItems || []);
  for (const span of item.spans) {
    const range = remapRange(rangeFromTextSpan(span, document), sourcemapLines)
    const symbolInfo = convertSymbol(item, range, document, sourcemapLines);

    for (const child of children) {
      if (child.spans.some(span => !!intersectRanges(range, remapRange(rangeFromTextSpan(span, document), sourcemapLines)))) {
        const includedChild = convertNavTree(child, symbolInfo.children!, document, sourcemapLines);
        shouldInclude = shouldInclude || includedChild;
        children.delete(child);
      }
    }

    if (shouldInclude) {
      output.push(symbolInfo);
    }
  }

  return shouldInclude;
}

function convertSymbol(item: NavigationTree, range: Range, document: TextDocument, sourcemapLines?: SourcemapLines): DocumentSymbol {
  let nameRange
  if (item.nameSpan) {
    nameRange = rangeFromTextSpan(item.nameSpan, document)
    if (sourcemapLines) {
      nameRange = remapRange(nameRange, sourcemapLines)
    }
  }

  const selectionRange = nameRange || range;
  let label = item.text

  switch (item.kind) {
    case ScriptElementKind.memberGetAccessorElement: label = `(get) ${label}`; break;
    case ScriptElementKind.memberSetAccessorElement: label = `(set) ${label}`; break;
  }

  const symbolInfo = makeDocumentSymbol(
    label,
    '',
    getSymbolKind(item.kind),
    range,
    containsRange(range, selectionRange) ? selectionRange : range
  );

  const kindModifiers = parseKindModifier(item.kindModifiers);
  if (kindModifiers.has(ScriptElementKindModifier.deprecatedModifier)) {
    symbolInfo.tags = [SymbolTag.Deprecated];
  }

  return symbolInfo;
}

function shouldIncludeEntry(item: NavigationTree | NavigationBarItem): boolean {
  if (item.kind === ScriptElementKind.alias) {
    return false;
  }
  return !!(item.text && item.text !== '<function>' && item.text !== '<class>');
}

export function parseKindModifier(kindModifiers: string): Set<string> {
  return new Set(kindModifiers.split(/,|\s+/g));
}

function rangeFromTextSpan(span: TextSpan, document: TextDocument): Range {
  return {
    start: document.positionAt(span.start),
    end: document.positionAt(span.start + span.length),
  }
}


export function makeRange(l1: number, c1: number, l2: number, c2: number) {
  return {
    start: {
      line: l1,
      character: c1,
    },
    end: {
      line: l2,
      character: c2,
    }
  }
}

/**
 * Creates a new document symbol.
 *
 * @param name The name of the symbol.
 * @param detail Details for the symbol.
 * @param kind The kind of the symbol.
 * @param range The full range of the symbol.
 * @param selectionRange The range that should be reveal.
 */
function makeDocumentSymbol(name: string, detail: string, kind: SymbolKind, range: Range, selectionRange: Range): DocumentSymbol {
  return {
    name,
    detail,
    kind,
    range,
    selectionRange,
    children: []
  }
}

/**
 * A intersection of the two ranges.
 */
export function intersectRanges(a: Range, b: Range): Range | null {
  let { line: resultStartLineNumber, character: resultStartColumn } = a.start;
  let { line: resultEndLineNumber, character: resultEndColumn } = a.end;
  let { line: otherStartLineNumber, character: otherStartColumn } = b.start;
  let { line: otherEndLineNumber, character: otherEndColumn } = b.end;

  if (resultStartLineNumber < otherStartLineNumber) {
    resultStartLineNumber = otherStartLineNumber;
    resultStartColumn = otherStartColumn;
  } else if (resultStartLineNumber === otherStartLineNumber) {
    resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
  }

  if (resultEndLineNumber > otherEndLineNumber) {
    resultEndLineNumber = otherEndLineNumber;
    resultEndColumn = otherEndColumn;
  } else if (resultEndLineNumber === otherEndLineNumber) {
    resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
  }

  // Check if selection is now empty
  if (resultStartLineNumber > resultEndLineNumber) {
    return null;
  }
  if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
    return null;
  }
  return makeRange(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
}

/**
 * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
 */
export function containsRange(range: Range, otherRange: Range): boolean {
  if (otherRange.start.line < range.start.line || otherRange.end.line < range.start.line) {
    return false;
  }
  if (otherRange.start.line > range.end.line || otherRange.end.line > range.end.line) {
    return false;
  }
  if (otherRange.start.line === range.start.line && otherRange.start.character < range.start.character) {
    return false;
  }
  if (otherRange.end.line === range.end.line && otherRange.end.character > range.end.character) {
    return false;
  }
  return true;
}
/**
 * The normal direction for sourcemapping is reverse, given a position in the generated file it points to a position in the source file.
 *
 * To do the opposite and find the position in the generated file from the source file ("forward map") we want to find the "best" mapping.
 * The best mapping is the closest mapping with line <= original line (ideally it will be equal to the original line), and column <= (original column).
 *
 * To find that mapping we check every reverse mapping holding on to the best one so far.
 * If we're in the middle of an identifier and the best one begins a few characters before the original column that is probably fine since we don't map
 * into the middle of identifiers.
 *
 * We linearly advance the found line and offset by the difference.
 */
export function forwardMap(sourcemapLines: SourcemapLines, position: Position) {
  assert("line" in position, "position must have line")
  assert("character" in position, "position must have character")

  const { line: origLine, character: origOffset } = position

  let col = 0
  let bestLine = -1,
    bestOffset = -1,
    foundLine = -1,
    foundOffset = -1

  sourcemapLines.forEach((line, i) => {
    col = 0
    line.forEach((mapping) => {
      col += mapping[0]

      if (mapping.length === 4) {
        // find best line without going beyond
        const [_p, _f, srcLine, srcOffset] = mapping
        if (srcLine <= origLine) {
          if (srcLine > bestLine && (srcOffset <= origOffset) || srcLine === bestLine && (srcOffset <= origOffset) && (srcOffset >= bestOffset)) {
            bestLine = srcLine
            bestOffset = srcOffset
            foundLine = i
            foundOffset = col
          }
        }
      }
    })
  })

  if (foundLine >= 0) {
    const genLine = foundLine + origLine - bestLine
    const genOffset = foundOffset + origOffset - bestOffset

    // console.log(`transformed position ${[origLine, origOffset]} => ${[genLine, genOffset]}`)

    return {
      line: genLine,
      character: genOffset
    }
  }

  // console.warn(`couldn't forward map src position: ${[origLine, origOffset]}`)
  return position
}

export function logTiming<R, A extends unknown[]>(name: string, fn: (...args: A) => R) {
  return function(...args: A) {
    const start = performance.now(),
      result = fn(...args),
      end = performance.now();
    // console.log(`${name.padStart(32)}${(end - start).toFixed(2).padStart(8)}ms`)

    return result;
  }
}

export function convertDiagnostic(
  diagnostic: Diagnostic,
  document: TextDocument,
  sourcemapLines?: SourcemapLines
): vs.Diagnostic {
  return {
    message: flattenDiagnosticMessageText(diagnostic.messageText),
    range: remapRange(
      rangeFromTextSpan(
        {
          start: diagnostic.start || 0,
          length: diagnostic.length ?? 1,
        },
        document
      ),
      sourcemapLines
    ),
    severity: diagnosticCategoryToSeverity(diagnostic.category),
    code: diagnostic.code,
    source: diagnostic.source || 'typescript',
  };
}

function diagnosticCategoryToSeverity(
  category: ts.DiagnosticCategory
): DiagnosticSeverity {
  switch (category) {
    case DiagnosticCategory.Warning:
      return DiagnosticSeverity.Warning;
    case DiagnosticCategory.Error:
      return DiagnosticSeverity.Error;
    case DiagnosticCategory.Suggestion:
      return DiagnosticSeverity.Hint;
    case DiagnosticCategory.Message:
      return DiagnosticSeverity.Information;
  }
}

/**
 * https://github.com/tc39/proposal-promise-with-resolvers
 */
export function withResolvers<T>() {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
}
export interface WithResolvers<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}
