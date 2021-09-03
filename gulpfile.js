'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  prefix = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  debug = require('gulp-debug'),
  mode = require('gulp-mode')(),
  uglifyes = require('uglify-es'),
  composer = require('gulp-uglify/composer'),
  uglify = composer(uglifyes, console),
  svgSprite = require('gulp-svg-sprite'),
  concat = require('gulp-concat'),
  gulpCopy = require('gulp-copy'),
  babel = require('gulp-babel'),
  sasslint = require('gulp-sass-lint'),
  csscomb = require('gulp-csscomb'),
  critical = require('critical'),
  runSequence = require('run-sequence'),
  log = require('fancy-log'),
  requireDir = require('require-dir')('./gulp-tasks');

var $ = require('gulp-load-plugins')();
var config = require('./gulpconfig.js');

// browserSync.
// To get browserSync running locally, you can run fin gulp
// and then be sure to have this snippet in your local
// settings file: $config['drupal_starter_theme.settings']['browsersync'] = 1;
// This hooks into a custom theme setting and adds the JS for browserSync.
// The reason for this is, we use a different local URL so browserSync proxy does
// not understand how to get to the page otherwise.
gulp.task('browser-sync', ['sass'], function () {
  browserSync.init({
    injectChanges: true,
    logPrefix: 'Default Theme',
    baseDir: './',
    open: false,
    notify: true,
    host: process.env.VIRTUAL_HOST,
    openBrowserAtStart: false,
    reloadOnRestart: true,
    port: 31953,
    ui: false,
  });
});

// Copy the src icons to dist.
gulp.task('copy-svg', function () {
  return gulp.src('./src/icon/raw/*.svg')
    .pipe(gulp.dest('./dist/icon/svg'));
});

// svgSprite function.
gulp.task('svgSprite', function (done) {
  // Basic configuration example.
  var config = {
    // log: 'debug',
    shape: {
      dimension: { // Set maximum dimensions.
        maxWidth: 110,
        maxHeight: 110
      },
      spacing: { // Add padding.
        padding: 0
      },
    },
    mode: {
      view: {
        bust: false,
        common: 'ico',
        example: {
          dest: '../dist/icon/icons.html'
        },
        prefix: '.',
        render: {
          scss: {
            template: './src/icon/svg-sprite-template.scss',
            dest: '../src/scss/_icons.scss'
          }
        },
        sprite: '../src/icon/icons.svg',
      }
    }
  };

  gulp.src('**/*.svg', {cwd: './src/icon/raw'})
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./'));
  done();
});

// JS.
gulp.task('scripts', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .on('error', function (err) {
      console.log(err)
    })
});

gulp.task('sass', function () {
  return gulp.src(['!./src/scss/vendor/**/*.scss', './src/scss/**/*.scss'])
    .pipe(sasslint({
      configFile: './sass-lint.yml',
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(csscomb('./csscomb.json'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true,
      match: '**/*.css'
    }))
});

// Combine the global css files into one for ckeditor to use.
gulp.task('concat', function () {
  return gulp.src('./dist/css/global/*.css')
    .pipe(csscomb('./csscomb.json'))
    .pipe(concat('ckeditor.css'))
    .pipe(gulp.dest('./dist/css'));
});

// browser-sync watch.
gulp.task('watch', ['browser-sync'], function (gulpCallback) {
  gulp.watch("./src/scss/**/*.scss", ['sass']);
  gulp.watch("./src/js/**/*.js", ['scripts']).on('change', browserSync.reload);
  gulp.watch("./templates/**/*.html.twig").on('change', browserSync.reload);
  // Notify gulp that this task is done.
  gulpCallback();
});



// Task: Build assets.
gulp.task('build', ['sass', 'scripts']);
// Task: handle svgs.
gulp.task('svg', ['svgSprite', 'copy-svg']);
// Task: Default gulp build and watch.
gulp.task('default', ['sass', 'scripts', 'critical', 'watch']);
// Concat CSS for ckeditor.
gulp.task('combine', ['concat']);
