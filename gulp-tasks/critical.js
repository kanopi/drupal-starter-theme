var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var urljoin = require('url-join');
var replace = require('gulp-replace');
var rimraf = require('rimraf');
var request = require('request');
var rp = require('request-promise');
var critical = require('critical');
var osTmpdir = require('os-tmpdir');
var config = require('../gulpconfig.js');
var log = require('fancy-log');
// Set the local url.
var configLocal = require('../gulpconfig.local.js');

// Allow requests to work with non-valid SSL certificates.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

gulp.task('critical', ['critical:clean'], function (done) {
  Object.keys(config.critical.urls).map(function (url, index) {
    var pageUrl = urljoin(configLocal.critical.baseDomain, url);
    var destCssPath = path.join(process.cwd(), config.critical.dest, config.critical.urls[url] + '.css');

    return rp({uri: pageUrl, strictSSL: false}).then(function (body) {
      var htmlString = body
        .replace(/href="\//g, 'href="' + urljoin(configLocal.critical.baseDomain, '/'))
        .replace(/src="\//g, 'src="' + urljoin(configLocal.critical.baseDomain, '/'));

      // Fancy log Debug output, this will print in terminal output.
      console.log(gutil.colors.green('Generating critical css in'), gutil.colors.yellow(destCssPath), gutil.colors.magenta('from'), gutil.colors.yellow(pageUrl));
      console.log(gutil.colors.green('The page URL'), gutil.colors.yellow(pageUrl))
      console.log(gutil.colors.green('The CSS path'), gutil.colors.yellow(destCssPath))

      critical.generate({
        base: osTmpdir(),
        html: htmlString,
        target: {css: destCssPath},
        inline: false,
        minify: false,
        dimensions: config.critical.dimensions,
        width: config.critical.width,
        height: config.critical.height
      }).catch((err) => {
        console.log(err);
      });

      if (index + 1 === Object.keys(config.critical.urls).length) {
        return done();
      }
    });
  });
});

gulp.task('critical:clean', function (done) {
  return rimraf(config.critical.dest, function () {
    gutil.log('Critical directory', gutil.colors.magenta(config.critical.dest), 'deleted');
    return done();
  });
});
