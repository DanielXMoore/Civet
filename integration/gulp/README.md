# gulp-civet

`gulp-civet` compiles your [Civet](https://civet.dev) code
in a [Gulp](https://gulpjs.com/) workflow

The code is based on [gulp-coffee](https://github.com/gulp-community/gulp-coffee).

## Usage

```js
const civet = require('gulp-civet');

gulp.task('civet', () => {
  gulp.src('./src/*.civet')
  .pipe(civet({
    extension: '.js',
    js: true,
  })
  .pipe(gulp.dest('./dist'));
});
```

## Options

* `extension` (optional): Output filename extension to use.
  Default: `.civet.tsx`, or `.civet.jsx` if `js` is true.
* Other Civet compiler options (e.g. `js: true`).
