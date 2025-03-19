import { defineConfig } from '@farmfe/core'
import solid from 'vite-plugin-solid'
import civetFarmPlugin from '@danielx/civet/farm'

export default defineConfig({
  plugins: [
    civetFarmPlugin({
      ts: "preserve",
    })
  ],
  vitePlugins: [
    () => ({
      vitePlugin: solid(),
      filters: ['\\.tsx$', '\\.jsx$']
    })
  ]
});
