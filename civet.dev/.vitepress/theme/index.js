import { useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { watch } from 'vue';
import Playground from '../components/Playground.vue';
import { compileCivetToHtml } from '../utils/compileCivetToHtml';
import './custom.css';

DefaultTheme.enhanceApp = async ({ app }) => {
  app.component('Playground', Playground);

  // Download compiler in the background
  if (typeof window !== 'undefined') {
    compileCivetToHtml('');
  }

  // Make playground page 100% screen width
  const defaultSetup = app._component.setup;
  app._component.setup = (props) => {
    const route = useRoute();

    watch(
      route,
      (route) => {
        if (typeof document === 'undefined') {
          return;
        }

        if (route.component.name === 'playground.md') {
          document.body.classList.add('playground');
        } else {
          document.body.classList.remove('playground');
        }
      },
      { immediate: true }
    );

    return defaultSetup(props);
  };
};

export default DefaultTheme;
