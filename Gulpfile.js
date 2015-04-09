'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths,
    slim = require('gulp-slim'),
    del = require('del');

var config = {
  src: 'app',
  dest: 'dist'
}

gulp.task('clean', function(cb) {
  del([
    config.dest.concat('/**')
  ], cb);
});

gulp.task('serve', function() {
  connect.server({
    //livereload: true,
    root: config.dest
  });
});

gulp.task('sass', function() {
  var src = config.src.concat('/sass/**/*.scss'),
    dest = config.dest.concat('/css');

  gulp.src(src)
    .pipe(sass({
      includePaths: neat
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('slim', function() {
  var src = config.src.concat('/**/*.slim'),
    dest = config.dest;

  gulp.src(src)
    .pipe(slim({
      pretty: false
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(config.src.concat('/sass/**/*.scss'), ['sass']);
  gulp.watch(config.src.concat('/*.slim'), ['slim']);
});

gulp.task('default', ['clean', 'sass', 'slim', 'serve', 'watch']);
