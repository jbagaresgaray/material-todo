var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var usemin = require('gulp-usemin');
var wrap = require('gulp-wrap');
var minifyCss = require('gulp-minify-css');
var minifyJs = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var rename = require('gulp-rename');

var paths = {
    styles: './assets/css/**/*.*',
    sass: './assets/scss/**/*.scss',
    images: './assets/images/**/*.*',
    lib: './assets/lib/**/*.*',
    routes: './routes/**/*',
    scripts: './app/**/*.js',
    templates: './app/**/*.html',
    bower_fonts: './assets/bower_components/**/*.{ttf,woff,woff2,eof,eot,svg}',
    index: 'index.html'
};

gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./assets/scss/**/*.scss', ['sass']);
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean({ force: true }));
});

gulp.task('copy', function() {
    gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({
                keepSpecialComments: 0
            }), 'concat'],
            js1: [minifyJs(), 'concat']
        }))
        .pipe(gulp.dest('dist'));
    gulp.src([
            './assets/bower_components/font-awesome/fonts/fontawesome-webfont.*'
        ])
        .pipe(gulp.dest('dist/lib/fonts'));
    gulp.src(paths.templates)
        .pipe(gulp.dest('dist/app'));
    gulp.src(paths.images)
        .pipe(gulp.dest('dist/assets/images'));
});


gulp.task('serve', function() {
    browserSync.init({
        notify: false,
        port: 8080,
        server: "./"
    });

    gulp.watch(['index.html', 'app/**/*.*', 'assets/**/*.*'])
        .on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'sass:watch']);
gulp.task('build', ['clean', 'copy']);
