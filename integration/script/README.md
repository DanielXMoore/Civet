# Civet in `<script>` tags

For quick hacks, you can run Civet code directly from your HTML, like so:

```html
<script type="text/civet">
  console.log 'Hello from Civet!'
</script>
```

You can also run Civet from files, like so:

```html
<script type="text/civet" src="filename.civet"></script>
```

In the latter case, the HTML needs to be served by a web server
(not via `file:` URL) to pass CORS.

## Example

[`test.html`](test.html) is an example of running Civet code directly from
HTML using `<script type="text/civet">` tags.
The auxiliary [`test.civet`](test.script) script will run
only if serving from a web server.
