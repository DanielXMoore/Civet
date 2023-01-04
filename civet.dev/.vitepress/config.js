const pkg = require('../../package.json');

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
  themeConfig: {
    logo: 'https://user-images.githubusercontent.com/13007891/210392977-03a3b140-ec63-4ce9-b6e3-0a0f7cac6cbe.png',
    siteTitle: 'Civet',
    nav: [
      { text: 'Getting started', link: '/getting-started' },
      { text: 'Guide', link: '/guide' },
      { text: 'JSX', link: '/jsx' },
      { text: 'Integrations', link: '/integrations' },
      { text: 'Config', link: '/config' },
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
  head: [
    [
      'meta',
      {
        name: 'og:title',
        content: 'Civet - The Modern Way to Write TypeScript',
      },
    ],
    [
      'meta',
      {
        name: 'og:site_name',
        content: 'Civet',
      },
    ],
    [
      'meta',
      {
        name: 'og:url',
        content: 'https://civet.dev',
      },
    ],
    [
      'meta',
      {
        name: 'og:type',
        content: 'website',
      },
    ],
    [
      'meta',
      {
        name: 'og:image',
        content:
          'https://user-images.githubusercontent.com/18894/184558519-b675a903-7490-43ba-883e-0d8addacd4b9.png',
      },
    ],
    [
      'meta',
      {
        name: 'og:description',
        content:
          'With Civet, you can enjoy a more concise and readable syntax while leveraging the power of TypeScript. Check out the documentation and resources on our website to learn more about Civet and how to use it effectively',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
    ],
  ],
};

export default config;
