# Civet in React Native / Metro

To use Civet with [React Native](https://reactnative.dev/),
you need to configure the [Metro bundler](https://reactnative.dev/docs/metro) to:

1. [Allow the `.civet` extension](https://metrobundler.dev/docs/configuration/#sourceexts)
2. Add the [Civet Babel plugin](https://github.com/DanielXMoore/Civet/blob/main/source/babel-plugin.civet)

Here is an example diff for the configuration:

```diff
// include .civet files to module resolution in metro.config.js
-const config = {};
+const config = {
+  resolver: {
+    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'civet'],
+  },
+};

// add plugin in babel.config.js
 module.exports = {
   presets: ['module:@react-native/babel-preset'],
+  plugins: [['@danielx/civet/babel-plugin']],
+  sourceMaps: 'inline',
 };
```
