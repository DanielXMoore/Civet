import { getSingletonHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await getSingletonHighlighter({
      themes: ['one-dark-pro'],
      langs: ['coffee', 'tsx'],
    });
  }

  return highlighter;
}
