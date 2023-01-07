import * as shiki from 'shiki';
import type { Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await shiki.getHighlighter({
      theme: 'one-dark-pro',
      langs: ['coffee', 'tsx'],
    });
  }

  return highlighter;
}
