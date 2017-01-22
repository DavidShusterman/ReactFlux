"use strict";
var gulp = require("gulp");
var connect = require("gulp-connect"); // Runs a local dev server
var open = require("gulp-open"); // Open a URL in a web browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // User conventional text streams with Gulp


var config = {
    port: 1337,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        dist: './dist'
    }
}

//Start a local development server
gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({
            uri: config.devBaseUrl + ':' + config.port + '/'
        }));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html'])
});

gulp.task('default', ['html', 'open', 'watch']);