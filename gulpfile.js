'use strict';
/** Requires */
const fs            = require('fs');
const path          = require('path');

const gulp          = require('gulp');
const babel         = require('gulp-babel');
const eslint        = require('gulp-eslint');

const sourcemaps    = require('gulp-sourcemaps');
const del           = require('del');
const gutil         = require('gulp-util');
const plumber       = require('gulp-plumber');
const yaml          = require('js-yaml');

/** Constants */
const jsPath = {
  from: [
    './development/**/*.js',
    '!./node_modules/**/*'
  ],
  to: './bin/'
};

const babelOptions = JSON.parse(fs.readFileSync('./.babelrc').toString());

const eslintOptions = yaml.load(
  fs.readFileSync(path.join(__dirname, './.eslintrc.yml'))
);

/** Helps */
function onError(err) {
  gutil.log(gutil.colors.red('Error'), err.toString());

  this.end();
}

/** Tasks */
gulp.task('build:js', () => {
  return gulp.src(jsPath.from)
    /** @todo: Пламбер перезапускает TS */
    .pipe(plumber({
      errorHandler: onError
    }))
    // Source map
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions))
    // End source map
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(jsPath.to));
});

gulp.task('clear', () => {
  del(path.join(__dirname, jsPath.to, '/**/*'));
});

gulp.task('build', ['build:js']);

gulp.task('lint', () => {
  return gulp.src([].concat(jsPath.from, ['./gulpfile.js']))
    /** @todo: Пламбер перезапускает TS */
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(eslint(eslintOptions))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch:js', () => {
  gulp.watch(jsPath.from, ['build:js']);
});

gulp.task('watch:lint', () => {
  gulp.watch(jsPath.from, ['lint']);
});

gulp.task('watch', ['watch:js']);

gulp.task('default', ['clear', 'build', 'lint']);
