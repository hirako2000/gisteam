var gulp = require('gulp');
var print = require('gulp-print');
var del = require('del');
var changed = require('gulp-changed-in-place');
var gulpIf = require('gulp-if');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var debounce = require('lodash').debounce;
var gzip = require('gulp-gzip');

gulp.task('clean', done =>
  del(['lib/**/*', '.cache/**/*'], done));

gulp.task('copy', () =>
  gulp.src(['src/**/*', '!src/**/*.es6'], { follow: /*symlinks*/ true })
  .pipe( /*only*/ changed /*files*/ ({ /*after*/ firstPass: true }))
  .pipe(gulp.dest('lib')));

gulp.task('gzip', () =>
  gulp.src(['lib/**/*', '!lib/**/*.es*'])
  .pipe(gzip())
  .pipe(gulp.dest('lib')));

gulp.task('babel', done =>
  gulp.src('src/**/*.es*', { follow: true })
  .pipe(sourcemaps.init())
  .pipe(babel( /*.babelrc*/ ))
  .pipe(sourcemaps.write({
    includeContent: false,
    sourceRoot: 'src'
  }))
  .pipe(gulp.dest('lib')));

gulp.task('watch', () =>
  gulp.watch('src', { followSymlinks: true }, debounce(gulp.series(
    'copy', 'babel'), 2000)));

gulp.task('build',
  gulp.series('clean', 'copy', 'babel', 'gzip'));

gulp.task('default',
  gulp.series('build', 'watch'));

gulp.task('test', function() {
  return gulp.src('./**/*.*')
    .pipe(print(p => 'file:' + p))
    .pipe(gulp.dest('.'));
});
