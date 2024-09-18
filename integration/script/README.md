# Civet in `<script>` tags

For quick hacks, you can run Civet code directly from your HTML
using `<script type="text/civet">` tags.
First, run the browser build of Civet, for example, from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js"></script>
```

Then you can run inline Civet scripts like so:

```html
<script type="text/civet">
  console.log 'Hello from Civet!'
</script>
```

You can also run Civet code from files, like so:

```html
<script type="text/civet" src="filename.civet"></script>
```

In the latter case, the HTML needs to be served by a web server
(not via `file:` URL) to pass CORS.

If you dynamically add `<script type="text/civet">` tags as children
to the document's `<head>` or `<body>`, they will get automatically get
detected and executed (via a
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)).
Be sure to set the `type` attribute to `text/civet`
and set `innerHTML` or `src` at the same time as appending the tag.

## Example

[`test.html`](test.html) is an example of running Civet code directly from
HTML using `<script type="text/civet">` tags.
The auxiliary [`test.civet`](test.script) script will run
only if serving from a web server.

## Overrides

You can turn off all automatic `<script type="text/civet">` execution
by adding a `no-scripts` attribute to the `<script>` tag that loads Civet:

```html
<script src="https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js" no-scripts></script>
```

You can turn off automatic execution of dynamically added scripts
(but keep initial loading of scripts) by adding a `no-auto-scripts`
attribute:

```html
<script src="https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js" no-auto-scripts></script>
```

You can turn off just the initial loading of scripts (but keep automatic
execution of dynamically added scripts) by adding a `no-start-scripts`
attribute:

```html
<script src="https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js" no-start-scripts></script>
```

If you want to manually trigger running all `<script type="text/civet">`
tags on the page, call `Civet.runScripts()`.  You can also run just
a specific `<script>` tag via `Civet.runScript(scriptTag)`.

If you want to manually create a `MutationObserver` to watch for added
`<script type="text/civet">` tags, call `Civet.autoRunScripts(roots)`,
where `roots` is an array of DOM elements to watch for added children.
You can also specify an alternative `options` for
[`MutationObserver.prototype.observe`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe)
as a second argument.  For example, to watch the entire document,
`Civet.autoRunScripts([document], {childNodes: true, subtree: true})`,
