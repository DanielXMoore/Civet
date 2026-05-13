import pkg from '../../package.json';
import { head } from './head.mjs';
import { getContributors } from './utils/getContributors.mjs';
import { defineConfig } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import { compileCivet } from './utils/compileCivet';
import { getHighlighter } from './utils/getHighlighter';
import civet from '../../dist/main.mjs';
import prettier from '@prettier/sync';
import { getOpenCollectiveInfo } from './utils/getOpenCollectiveInfo';
import { b64 } from './utils/b64';

const tsLibFiles = new Set(['lib.dom.d.ts', 'lib.dom.iterable.d.ts']);
const tsLibDir = path.resolve('lsp/server/dist/lib');
const tsLibPrefix = '/civet-lsp-lib/';

// Serve selected TypeScript lib files as raw text so the browser LSP can
// fetch them lazily; Vite's normal .d.ts handling turns them into JS modules.
function tsLibPlugin() {
  return {
    name: 'civet-ts-lib-files',
    configureServer(server) {
      server.middlewares.use(tsLibPrefix, (req, res, next) => {
        const file = path.basename(req.url?.split('?')[0] ?? '');
        if (!tsLibFiles.has(file)) {
          next();
          return;
        }

        res.setHeader('content-type', 'text/plain; charset=utf-8');
        fs.createReadStream(path.join(tsLibDir, file)).pipe(res);
      });
    },
    generateBundle() {
      for (const file of tsLibFiles) {
        this.emitFile({
          type: 'asset',
          fileName: `civet-lsp-lib/${file}`,
          source: fs.readFileSync(path.join(tsLibDir, file), 'utf8'),
        });
      }
    },
  };
}

export default async function vitePressConfig() {
  const highlighter = await getHighlighter();
  return defineConfig({
    lang: 'en-US',
    title: 'Civet - A Programming Language for the New Millennium',
    titleTemplate: 'Civet',
    description: 'Code More with Less in a TypeScript Superset',
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
        { text: 'Reference', link: '/reference' },
        { text: 'Cheatsheet', link: '/cheatsheet' },
        { text: 'Comparison', link: '/comparison' },
        { text: 'Integrations', link: '/integrations' },
        { text: 'Config', link: '/config' },
        { text: 'Playground', link: '/playground' },
      ],
      editLink: {
        pattern:
          'https://github.com/DanielXMoore/Civet/edit/main/civet.dev/:path',
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
            const raw = /\braw\b/.test(lines[0]);
            const comptime = /\bcomptime\b/.test(lines[0]);
            const code = lines.slice(1, -1).join('\n');
            const { tsCode } = compileCivet(code, civet, raw ? null : prettier,
              { comptime });
            const inputHtml = highlighter.codeToHtml(code, {
              lang: 'civet',
              theme: 'one-dark-pro',
            });
            const outputHtml = highlighter.codeToHtml(tsCode, {
              lang: 'tsx',
              theme: 'one-dark-pro',
            });

            return `<Playground b64-code="${b64.encode(code)}"${raw ? " raw" : ""}${comptime ? " comptime" : ""}>
              <template #input>${inputHtml}</template>
              <template #output>${outputHtml}</template>
            </Playground>`;
          }

          return defaultRender(tokens, idx, options, env, self);
        };
      },
    },
    head,
    vite: {
      plugins: [tsLibPlugin()],
    },
    transformPageData(pageData) {
      pageData.civetVersion = pkg.version;
      return pageData;
    },
  });
}
