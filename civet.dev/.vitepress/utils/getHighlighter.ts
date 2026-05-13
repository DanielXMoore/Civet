import { getSingletonHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';
import civetGrammar from '../../../lsp/vscode/syntaxes/civet.json';

let highlighter: Highlighter | null = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await getSingletonHighlighter({
      themes: ['one-dark-pro'],
      langs: [{ ...civetGrammar, name: 'civet' }, 'tsx'],
    });
  }

  return highlighter;
}
