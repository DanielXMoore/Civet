# Civet in `<script>` tags

For quick hacks, you can run Civet code directly from your HTML
using `<script type="text/civet">` tags.
First, run the browser build of Civet, for example, from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js"></script>
```

Then you can run Civet scripts like so:

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

Note that `<script type="text/civet">` tags get run once,
when the page is fully loaded.  If you need to run them at a specific time
(e.g. after dynamically generating content), call `Civet.runScripts()`.

## Example

[`test.html`](test.html) is an example of running Civet code directly from
HTML using `<script type="text/civet">` tags.
The auxiliary [`test.civet`](test.script) script will run
only if serving from a web server.
