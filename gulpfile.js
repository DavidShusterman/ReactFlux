"use strict";
var gulp = require("gulp");
var gulp_connect = require("gulp-connect"); // Runs a local dev server
var gulp_open = require("gulp-open"); // gulp_open a URL in a web browser
var gulp_concat = require('gulp-concat'); // Concatenates files
var gulp_lint = require('gulp-eslint'); // Lints JS files, including JSX
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
        images: './src/images/*',
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

//Opens the web app in the default browser and calls gulp_connect
gulp.task('gulp_open', ['gulp_connect'], function () {
    gulp.src('dist/index.html')
        .pipe(gulp_open({
            uri: config.devBaseUrl + ':' + config.port + '/'
        }));
});

// Serves the html files from src to dist (client)
gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(gulp_connect.reload());
});

// Serves the js files from src to dist (client) 
// Bundle them up in bundle.js
gulp.task('js', function () {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(gulp_connect.reload());
});

// Serves the css files from src to dist (client)
// Bundle them up in bundle.css
gulp.task('css', function () {
    gulp.src(config.paths.css)
        .pipe(gulp_concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

// Serves the images files from src to dist (client)
gulp.task('images', function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(gulp_connect.reload());
    
    gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(config.paths.dist));
});


// Keeps track over js convention and set of rules
// that are set in eslint.config.json file
gulp.task('lint', function () {
    return gulp.src(config.paths.js)
        .pipe(gulp_lint({
            configFile : 'eslint.config.json'
        }))
        .pipe(gulp_lint.format());
});

//Watches for file changes
gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

// task that is being called when 'gulp' is being called.
//calls all other tasks by order
gulp.task('default', ['html', 'js', 'css','images' ,'lint', 'gulp_open', 'watch']);