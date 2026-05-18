// Fixture exporting one symbol of each TS SymbolFlags kind that
// pickImportBindingTokenType (in lsp/server/source/lib/util.civet) branches
// on. Used by semantic-token tests to exercise the class/enum/interface/
// type-alias/namespace/variable-fallback paths.

export class FixtureClass {}

export enum FixtureEnum { A, B }

export interface FixtureInterface { x: number }

export type FixtureType = string

export function fixtureFn(): void {}

export const fixtureConst = 0

export namespace FixtureNs { export const v = 1 }
