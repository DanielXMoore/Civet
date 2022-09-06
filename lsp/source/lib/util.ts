import { NavigationBarItem, NavigationTree, ScriptElementKind, ScriptElementKindModifier, TextSpan } from "typescript";
import { SymbolKind, SymbolTag, DocumentSymbol, Range } from "vscode-languageserver";

import Civet from "@danielx/civet"
const { util: { lookupLineColumn } } = Civet

// https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/documentSymbol.ts#L63

const getSymbolKind = (kind: string): SymbolKind => {
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

export function convertNavTree(
  lineTable: number[],
  output: DocumentSymbol[],
  item: NavigationTree,
): boolean {
  let shouldInclude = shouldIncludeEntry(item);
  if (!shouldInclude && !item.childItems?.length) {
    return false;
  }

  const children = new Set(item.childItems || []);
  for (const span of item.spans) {
    const range = rangeFromTextSpan(lineTable, span);
    const symbolInfo = convertSymbol(item, range, lineTable);

    for (const child of children) {
      if (child.spans.some(span => !!intersectRanges(range, rangeFromTextSpan(lineTable, span)))) {
        const includedChild = convertNavTree(lineTable, symbolInfo.children!, child);
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

function convertSymbol(item: NavigationTree, range: Range, lineTable: number[]): DocumentSymbol {
  const selectionRange = item.nameSpan ? rangeFromTextSpan(lineTable, item.nameSpan) : range;
  let label = item.text;

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

function parseKindModifier(kindModifiers: string): Set<string> {
  return new Set(kindModifiers.split(/,|\s+/g));
}

function rangeFromTextSpan(lineTable: number[], span: TextSpan): Range {
  const [l1, c1] = lookupLineColumn(lineTable, span.start)
  const [l2, c2] = lookupLineColumn(lineTable, span.start + span.length)

  // TODO: Actual Range lines and columns, needs doc text
  return makeRange(l1, c1, l2, c2)
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
