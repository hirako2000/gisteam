const gulp = require('gulp');
const print = require('gulp-print');
const del = require('del');
const changed = require('gulp-changed-in-place');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const debounce = require('lodash').debounce;
const gzip = require('gulp-gzip');

gulp.task('clean', done =>
  del(['api/**/*', '.cache/**/*'], done));

gulp.task('copy', () =>
  gulp.src(['src/**/*'], {follow: /* symlinks */ true})
  .pipe(/* only */ changed({firstPass: true}))
  .pipe(gulp.dest('api')));

gulp.task('gzip', () =>
  gulp.src(['src/public/**/*.*'])
  .pipe(gzip())
  .pipe(gulp.dest('api/public')));

gulp.task('babel', done =>
  gulp.src(['src/**/*.js', '!src/public/**/*'], {follow: true})
  .pipe(sourcemaps.init())
  .pipe(babel(/* .babelrc */))
  .pipe(sourcemaps.write({
    includeContent: false,
    sourceRoot: 'src'
  }))
  .pipe(gulp.dest('api')));

gulp.task('watch', () =>
  gulp.watch('src', {followSymlinks: true}, debounce(gulp.series(
    'copy', 'babel'), 2000)));

gulp.task('build',
  gulp.series('clean', 'copy', 'babel', 'gzip'));

gulp.task('default',
  gulp.series('build', 'watch'));

gulp.task('test', () => {
  return gulp.src('./**/*.*')
    .pipe(print(p => 'file:' + p))
    .pipe(gulp.dest('.'));
});
