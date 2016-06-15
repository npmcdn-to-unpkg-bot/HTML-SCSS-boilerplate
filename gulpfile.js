var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    del = require('del'),
    vinylPaths = require('vinyl-paths');

var config = require('./gulp-config.json');


// Clean
gulp.task('clean', function() {
    return del.sync('build');
});


// Styles
gulp.task('compileSCSS', function() {
    return gulp.src(config.mainScss)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
                sourceComments: 'map',
                sourceMap: 'sass',
                outputStyle: 'expanded'
            })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer('last 2 version'))
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(config.destCss))
        // .pipe(browserSync.reload({
        //     stream: true
        // }));
});

// Images
gulp.task('images', function() {
    return gulp.src(config.imageSrc)
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.imageDest))
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

//gulp svg sprite
svgConfig = {
    shape: {
        dimension: { // Set maximum dimensions
            maxWidth: 32,
            maxHeight: 32
        },
        spacing: { // Add padding
            padding: 10
        }
    },
    mode: {
        view: false,
        symbol: {
            dest: './'
        }
    }
};

gulp.task('svg-sprite', function() {
    return gulp.src(config.svgIn)
        .pipe($.svgSprite(svgConfig))
        .pipe(gulp.dest(config.svgOut));
})

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


gulp.task('concatIncludes', function() {
    return gulp.src(config.jsIncludes)
        .pipe($.sourcemaps.init())
        .pipe($.concat('includes.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(config.temp + '/js'));
});
gulp.task('concatMain', function() {
    return gulp.src(config.jsFiles)
        .pipe($.sourcemaps.init())
        .pipe($.concat('main.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(config.temp + '/js'));
});
gulp.task('compressJS', ['concatIncludes', 'concatMain'], function() {
    return gulp.src(config.temp + 'js/*.js')
        .pipe($.concat('build.js'))
        .pipe(gulp.dest(config.build + 'script/'));
});
gulp.task('compressCSS', ['compileSCSS'], function() {
    return gulp.src(config.destCss + '*.css')
        .pipe($.csso())
        .pipe(gulp.dest(config.build + 'style/'));
})

gulp.task('compressHTML', function() {
  return gulp.src('src/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.build))
});


gulp.task('build', function(callback) {
  runSequence('clean',
              ['compressJS', 'compressCSS', 'compressHTML'],
              callback);
});
