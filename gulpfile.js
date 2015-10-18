var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var through = require('through2');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackDev = require('./webpack.config.development.js');
var webpackProd = require('./webpack.config.production.js');

gulp.task('default', ['sass', 'webpack-dev-server', 'serve'], function() {
    console.log('Running Gulp');
});

// production build
gulp.task('build', ['webpack:build', 'sass']);

// dev build
gulp.task('build-dev', ['webpack:build-dev'], function() {
    gulp.watch(["app/assets/js/**/*.js"], ["webpack:build-dev"]);
});

// gulp.task('webpack:build', function(cb) {
//     var config = Object.create(webpackProd);
//
//     // run webpack
//     webpack(config, function(err, stats) {
//         if (err) throw new gutil.PluginError("webpack:build", err);
//         gutil.log("[webpack:build]", stats.toString({
//             colors: true
//         }));
//         cb();
//     });
// });

// create a single instance of the compiler to allow caching
var devConfig = Object.create(webpackDev);
var devCompiler = webpack(devConfig);

gulp.task('webpack:build-dev', function(cb) {
    // run webpack
    devCompiler.run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        cb();
    });
});

// dev server
gulp.task('webpack-dev-server', function(cb) {
    var config = Object.create(webpackDev);
    config.devtool = "source-map";

    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        historyApiFallback: true,
        inline: true,
        stats: {
            colors: true
        }
    }).listen(4000, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:4000/webpack-dev-server");
    });
    cb();
});

// SASS
gulp.task('sass', function() {
    gulp.src('app/assets/scss/**/*.scss')
        .pipe(plumber({errorHandler:
            notify.onError({
                title: 'SASS Error',
                message: function(error) {
                    process.stdout.write('\x07');
                    console.log(error);
                    return error.message + ' on line ' + error.lineNumber + ' in ' + error.fileName.split("/").slice(-1);
                }
            })
        }))
        .pipe(sass())
        .pipe(gulp.dest('app/public/css'));
    // reload();
});

// Watch
gulp.task('serve', ['sass', 'webpack-dev-server'], function() {
    gulp.watch(['app/assets/scss/**/*.scss', 'app/assets/scss/*.scss'], ['sass']);
    // nodemon({
    //     script: './app/bootstrap.js'
    // }).on('restart', function () {
    //   // @TODO Applesauce: log event
    // });
    // gulp.watch(['app/views/**/*.mustache', 'app/views/*.mustache']).on('change', reload);
});
//**
