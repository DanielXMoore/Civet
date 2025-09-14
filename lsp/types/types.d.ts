import TSService from '../source/lib/typescript-service.mjs';

export type ResolvedService = Awaited<ReturnType<typeof TSService>>;

export interface LanguageServiceContext {
  ensureServiceForSourcePath: (sourcePath: string) => Promise<ResolvedService | undefined>;
  documentToSourcePath: (textDocument: TextDocumentIdentifier) => string;
  documents?: {
    get: (uri: string) => TextDocument | undefined;
  };
  updating?: (document: { uri: string }) => Promise<any>;
  log: (message: string) => void;
  connection?: {
    sendDiagnostics: (params: { uri: string; diagnostics: Diagnostic[] }) => void;
  }
}

export type FeatureDeps = {
  ensureServiceForSourcePath: (sourcePath: string) => Promise<ResolvedService | null>;
  documentToSourcePath: (doc: TextDocument | TextDocumentIdentifier) => string;
  documents: {
    get: (uri: string) => TextDocument | undefined;
  };
  updating: (doc: { uri: string }) => Promise<boolean> | undefined;
}
