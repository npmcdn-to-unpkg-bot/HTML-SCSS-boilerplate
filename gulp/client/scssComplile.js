module.exports = function(gulp, $, config) {
    return function() {
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
            .pipe(browserSync.reload({
                stream: true
            }))
            .pipe($.notify({
                message: 'Sass Compilation complete'
            }))
    }
}
