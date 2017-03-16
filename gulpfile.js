"use strict";
var gulp = require("gulp");
var gulp_connect = require("gulp-connect"); // Runs a local dev server
var gulp_open = require("gulp-open"); // gulp_open a URL in a web browser
var gulp_concat= require('gulp-concat');
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // User conventional text streams with Gulp



var config = {
    port: 1337,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.js'
    }
}

//Start a local development server
gulp.task('gulp_connect', function () {
    gulp_connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('gulp_open', ['gulp_connect'], function () {
    gulp.src('dist/index.html')
        .pipe(gulp_open({
            uri: config.devBaseUrl + ':' + config.port + '/'
        }));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(gulp_connect.reload());
});

gulp.task('js', function () {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error',console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(gulp_connect.reload());
});

gulp.task('css', function () {
   gulp.src(config.paths.css) 
        .pipe(gulp_concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist+'/css'));
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['html','js','css','gulp_open', 'watch']);