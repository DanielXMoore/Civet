import pkg from '../../package.json';
import { head } from './head.js';
import { getContributors } from './utils/getContributors.js';
import { defineConfig } from 'vitepress';
import { compileCivet } from './utils/compileCivet';
import { getHighlighter } from './utils/getHighlighter';
import civet from '../../dist/main.mjs';
import prettier from 'prettier';
import { getOpenCollectiveInfo } from './utils/getOpenCollectiveInfo';

export default async function vitePressConfig() {
  const highlighter = await getHighlighter();
  return defineConfig({
    lang: 'en-US',
    title: 'Civet - The Modern Way to Write TypeScript',
    titleTemplate: 'Civet',
    description: 'Concise Syntax and Faster Coding with Civet',
    lastUpdated: true,
    cleanUrls: 'with-subfolders',
    appearance: 'dark',
    themeConfig: {
      contributors: await getContributors(),
      openCollective: await getOpenCollectiveInfo(),
      logo: 'https://user-images.githubusercontent.com/13007891/210392977-03a3b140-ec63-4ce9-b6e3-0a0f7cac6cbe.png',
      siteTitle: 'Civet',
      nav: [
        { text: 'Getting started', link: '/getting-started' },
        { text: 'Cheatsheet', link: '/cheatsheet' },
        { text: 'Integrations', link: '/integrations' },
        { text: 'Config', link: '/config' },
        { text: 'Playground', link: 'https://civet-web.vercel.app/' },
      ],
      editLink: {
        pattern:
          'https://github.com/DanielXMoore/Civet/edit/master/civet.dev/:path',
        text: 'Edit this page on GitHub',
      },
      socialLinks: [
        { icon: 'discord', link: 'https://discord.gg/xkrW9GebBc' },
        {
          icon: 'twitter',
          link: 'https://twitter.com/hashtag/civetlang?src=hashtag_click',
        },
        { icon: 'github', link: 'https://github.com/DanielXMoore/Civet' },
      ],
      footer: {
        message: `Civet v${pkg.version}`,
      },
    },
    markdown: {
      toc: {
        level: [2, 2],
      },
      config(md) {
        const defaultRender = md.renderer.rules.html_block;
        md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
          const token = tokens[idx];

          if (token.content.startsWith('<Playground')) {
            const lines = token.content.trim().split('\n');
            const code = lines.slice(1, -1).join('\n');
            const { tsCode } = compileCivet(code, civet, prettier);
            const inputHtml = highlighter.codeToHtml(code, { lang: 'coffee' });
            const outputHtml = highlighter.codeToHtml(tsCode, { lang: 'tsx' });

            return `${lines[0]}
              <template #input>${inputHtml}</template>
              <template #output>${outputHtml}</template>
            ${lines[lines.length - 1]}`;
          }

          return defaultRender(tokens, idx, options, env, self);
        };
      },
    },
    head,
  });
}
