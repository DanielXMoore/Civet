import { TextDocument } from "vscode-languageserver-textdocument"

TextDocument.create("file:///foo/bar", "typescript", 0, "foo")
