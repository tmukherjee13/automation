/* File: gulpfile.js */

var gulp = require('gulp'),
    cleancss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    size = require('gulp-size'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    uncss = require('gulp-uncss'),
    imageresize = require('gulp-image-resize'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    spritesmith = require('gulp.spritesmith');

var config = require('./config.js');


var settings = {
    'source_dir': 'files/source/',
    'build_dir': 'files/build/',
    'production_js_file' : 'production',
    'production_css_file' : 'production',
    'production_suffix' : '.min',
    'cssDir': 'css',
    'sassDir': 'sass',
};

var srcAssets = 'src';
var destAssets = 'dest';

// var config = {
//     src: srcAssets + '/images/*.png',
//     dest: {
//         css: destAssets,
//         image: destAssets + '/sprites/'
//     },
//     options: {
//         cssName: '_sprites.css',
//         cssFormat: 'css',
//         cssOpts: {
//             cssClass: function(item) {
//                 // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
//                 if (item.name.indexOf('-hover') !== -1) {
//                     return '.icon-' + item.name.replace('-hover', ':hover');
//                     // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
//                 } else {
//                     return '.icon-' + item.name;
//                 }
//             }
//         },
//         padding: 5,
//         imgName: 'icon-sprite.png',
//         imgPath: 'sprites/icon-sprite.png'
//     }
// };

var SOURCE_DIR = 'files/source/';
var BUILD_DIR = 'files/build/';
var PRODUCTION_JS_FILE = 'production.min.js';
var PRODUCTION_CSS_FILE = 'production.min.css';



/**
 * Minimize CSS files
 */
gulp.task('css:clean',['clean'], function() {
    return gulp.src(settings.source_dir+'**/*.css')
    	.pipe(size())
        .pipe(cleancss())
        .pipe(gulp.dest(settings.build_dir))
        .pipe(size());
});

/**
 * Compile SASS to CSS
 */
gulp.task('css:compile', function() {
    gulp.src(settings.sassDir+'/**/*.scss')
        .pipe(sass.sync({outputStyle: 'expand'}).on('error', sass.logError))
        .pipe(gulp.dest(settings.cssDir));
});


/**
 * Remove unused CSS
 */

var links = ['http://localhost/'];
gulp.task('css:uncss',['clean'], function() {
    gulp.src(settings.source_dir+'**/*.css')
        .pipe(uncss({
            html: links
        }))
        .pipe(gulp.dest(settings.build_dir));
});



/**
 * Minimize JS files 
 */
gulp.task('js:clean',['clean'], function() {
    return gulp.src(settings.source_dir+'**/*.js')
    	.pipe(size())
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(concat(settings.production_js_file))
        .pipe(gulp.dest(settings.build_dir))
        .pipe(size());
});


/**
 * Search for systax errors in js files
 */

gulp.task('js:lint', function() {
  return gulp.src(settings.source_dir+'**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});



/**
 * Minimize image files
 */

var source = '*';
gulp.task('image:optimize',[], function() {
    return gulp.src(settings.source_dir+'**/*.{jpg,jpeg,png,gif}')
    	.pipe(size())
        // .pipe(imageresize({ 
        //   width : 1000,
        //   upscale: false,
        // }))
        .pipe(imagemin({
            optimizationLevel: 6,
            progessive: true,
            interlaced: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(settings.build_dir))
        .pipe(size());
});

/**
 * Generate sprite and css file from PNGs
 */
gulp.task('image:sprite', function() {
  var spriteData = gulp.src(config.src).pipe(spritesmith(config.options));
  spriteData.img
    .pipe(gulp.dest(config.dest.image));

  spriteData.css
    .pipe(gulp.dest(config.dest.css));
});


/**
 * Minimize HTML
 */
gulp.task('html:minify',['clean'], function() {
    return gulp.src('source/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(settings.build_dir));
});

gulp.task('default', function() {
    gutil.log('Gulp is running!');
    console.log(config);
    gulp.watch(settings.source_dir+settings.sassDir+'/**/*.scss',['css']);
});

gulp.task('clean', function () {  
  return gulp.src(settings.build_dir, {read: false})
    .pipe(clean());
});