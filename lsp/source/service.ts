/**
 * Construct a TypeScript service for the whole project.
 */

import ts from "typescript";

import type {
  CompilerOptions,
  LanguageServiceHost,
} from "typescript";

import path from "path";

const {
  createLanguageService,
  createSourceFile,
  resolveModuleName,
  sys,
  ModuleKind,
  ModuleResolutionKind,
  ScriptKind,
  ScriptSnapshot,
  ScriptTarget,
} = ts;

const DefaultCompilerOptions: CompilerOptions = {
  allowNonTsExtensions: true,
  allowJs: true,
  target: ScriptTarget.Latest,
  moduleResolution: ModuleResolutionKind.NodeJs,
  module: ModuleKind.CommonJS,
  allowSyntheticDefaultImports: true,
  experimentalDecorators: true,
};

const host = createCompilerHost(DefaultCompilerOptions, []);
const service = createLanguageService(host);

const program = service.getProgram();

console.log(program.getRootFileNames(), program.getIdentifierCount());
console.log(service.getCompletionsAtPosition("source/hello.ts", 16));

service.getQuickInfoAtPosition()
// console.log program.getCompletionsAtPosition()
