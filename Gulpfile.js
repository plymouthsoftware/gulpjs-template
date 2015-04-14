'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths,
    slim = require('gulp-slim'),
    del = require('del'),
    imgmin = require('gulp-imagemin'),
    optipng = require('imagemin-optipng'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

var config = {
  src: 'app',
  dest: 'dist'
}

config.images = {
  src: config.src.concat('/images'),
  dest: config.dest.concat('/assets/images'),
}

gulp.task('clean', function(cb) {
  del([
    config.dest.concat('/**')
  ], cb);
});

gulp.task('serve', function() {
  connect.server({
    root: config.dest
  });
});

gulp.task('lint', function() {
  var src = config.src.concat('/javascript/*.js');

  return gulp.src(src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function() {
  var src = config.src.concat('/sass/**/*.scss'),
    dest = config.dest.concat('/assets/css');

  gulp.src(['bower_components/fontawesome/scss/*.scss', src])
    .pipe(sass({
      includePaths: neat
    }))
    .pipe(concat('application.css'))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('minify', function() {
  var src = config.src.concat('/javascript/*.js'),
    dest = config.dest.concat('/assets/js');

  gulp.src(src)
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('fonts', function() {
  gulp.src('bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest(config.dest.concat('/assets/fonts')))
    .pipe(connect.reload());
})

gulp.task('slim', ['fonts'], function() {
  var src = config.src.concat('/**/*.slim'),
    dest = config.dest;

  gulp.src(src)
    .pipe(slim({
      pretty: false
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('pngmin', function() {
  var src = config.images.src.concat('/**/*.png'),
    dest = config.images.dest;

  gulp.src(src)
    .pipe(imgmin({
      use: [optipng({optimizationLevel: 3})]
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(config.src.concat('/sass/**/*.scss'), ['sass']);
  gulp.watch(config.src.concat('/*.slim'), ['slim']);
  gulp.watch(config.images.src.concat('/**/*'), ['images']);
  gulp.watch(config.src.concat('/js/*.js'), ['lint', 'minify']);
});

gulp.task('images', ['pngmin']);

gulp.task('build', ['clean', 'lint', 'minify', 'sass', 'images', 'slim', 'serve', 'watch'])

gulp.task('default', ['build']);
