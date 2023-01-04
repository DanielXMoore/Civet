import pkg from '../../package.json';
import { head } from './head.js';
import { getContributors } from './utils.js';
export default async function vitePressConfig() {
  /**
   * @type {import('vitepress').UserConfig}
   */
  const config = {
    lang: 'en-US',
    title: 'Civet - The Modern Way to Write TypeScript',
    titleTemplate: 'Civet',
    description: 'Concise Syntax and Faster Coding with Civet',
    lastUpdated: true,
    cleanUrls: 'with-subfolders',
    appearance: 'dark',
    themeConfig: {
      contributors: await getContributors(),
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
    },
    head,
  };

  return config;
}
