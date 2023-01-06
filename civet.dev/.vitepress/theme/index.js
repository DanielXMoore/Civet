import DefaultTheme from 'vitepress/theme';
import Playground from '../components/Playground.vue';
import './custom.css';

DefaultTheme.enhanceApp = async ({ app }) => {
  app.component('Playground', Playground);
};

export default DefaultTheme;
