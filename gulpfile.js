var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    del = require('del');
var config = require('./gulp-config.js')();


// Styles
gulp.task('styles', function() {
    return gulp.src('src/styles/sass/**/*.scss')
        .pipe($.sass({
            outputStyle: 'expanded'
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer('last 2 version'))
        .pipe(gulp.dest('src/styles/css'))
        .pipe($.notify({
            message: 'Styles task complete'
        }))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.notify({
            message: 'Images task complete'
        }))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('fonts', function() {
        return gulp.src('src/styles/fonts/**/*')
            .pipe(gulp.dest('dist/styles/fonts'))
    })
    // Clean
gulp.task('clean', function() {
    return del.sync('dist');
});

// browserSync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
})


// Watch
gulp.task('run', ['browserSync', 'styles'], function() {

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', browserSync.reload);

    // Watch image files
    gulp.watch('src/images/**/*', browserSync.reload);
    // Watch HTML files
    gulp.watch('src/**/*.html', browserSync.reload);

});



// Default task
gulp.task('default', function() {
    runSequence(['styles', 'browserSync']);
});