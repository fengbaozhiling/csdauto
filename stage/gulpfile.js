/*
 * @auth 钟良文
 * @email zhongliangwenwx@163.com
 * */

//引入gulp
var gulp = require('gulp');

var path = require('path');

//引入组件
var lr = require('tiny-lr');
var server = lr();
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var opn = require('opn');
var less = require('gulp-less');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');           //压缩
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-minify-css');
var pngquant = require('imagemin-pngquant');
var htmlmin = require('gulp-htmlmin');

var webpack = require('webpack-stream');

var _projectDir = require(__dirname + '/project.json');

var host_ip = getIPAdress();

var sass = require('gulp-sass');


function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/**/*.scss', ['sass']);
});

//脚本检查
gulp.task('jshint', function () {
    gulp.src(__dirname + '/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//less
gulp.task('less', function () {
    return gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(__dirname + '/src/css/'));
});

gulp.task('less:watch', function () {
    gulp.watch('./less/**/*.less', ['less']);
});

gulp.task('minify-js', function () {
    var reg = /.+\//;
    var _regDir = reg.exec(_projectDir.export.js) ? reg.exec(_projectDir.export.js) : '';
    return gulp.src('./src/js/' + _projectDir.export.js + '.build.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'+_regDir))
});

/*
 * html压缩移动
 * */
gulp.task('html', function () {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/'));
});

/*
 * font移动
 * */
gulp.task('font', function () {
    return gulp.src('./src/font/**/*.*')
        .pipe(gulp.dest('./dist/font/'));
});


gulp.task('webpack-w', function () {
    return gulp.src(__dirname + '/src/js/' + _projectDir.export.js + '.js')
        .pipe(webpack({
            watch: true,
            entry: './src/js/' + _projectDir.export.js + '.js',
            output: {
                filename: _projectDir.export.js + '.build.js'
            },
            module: {
                loaders: [
                    {test: "\.jpg$", loader: "file-loader"},
                    {test: "\.png$", loader: "url-loader?mimetype=image/png"}
                ]
            }
        }))
        .pipe(gulp.dest(__dirname + '/src/js/'));
});

gulp.task('webpack', function () {
    return gulp.src(__dirname + '/src/js/' + _projectDir.export.js + '.js')
        .pipe(webpack({
            watch: false,
            entry: './src/js/' + _projectDir.export.js + '.js',
            output: {
                filename: _projectDir.export.js + '.build.js'
            },
            module: {
                loaders: [
                    {test: "\.jpg$", loader: "file-loader"},
                    {test: "\.png$", loader: "url-loader?mimetype=image/png"}
                ]
            }
        }))
        .pipe(gulp.dest(__dirname + '/src/js/'));

});

//压缩图片
gulp.task('image', function () {
    return gulp.src('./src/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});


//开启本地 Web 服务器功能
gulp.task('site:src', function () {
    gulp.src('./src/')
        .pipe(webserver({
            host: host_ip,
            port: _projectDir.localserver.port,
            livereload: true,
            directoryListing: false
        }));
    opn('http://' + host_ip + ':' + _projectDir.localserver.port + '/')
});


gulp.task('site:dist', function () {
    gulp.src('./dist/')
        .pipe(webserver({
            host: host_ip,
            port: _projectDir.localserver.port,
            livereload: true,
            directoryListing: false
        }));
    opn('http://' + host_ip + ':' + _projectDir.localserver.port + '/')
});


//文件监控
gulp.task('watch', function () {
    /*server.listen(host_ip, function (err) {
        if (err) {
            return console.log(err);
        }
    });*/
    gulp.watch([
        './src/css/' + _projectDir.export.css + '.css',
        './src/js/' + _projectDir.export.js + '.build.js'
    ], function (e) {
        server.changed({
            body: {
                files: [e.path]
            }
        });
    });

});

/*
 *  css压缩
 * */
gulp.task('minify-css', function () {
    return gulp.src('./src/css/' + _projectDir.export.css + '.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('build', ['minify-js', 'minify-css', 'html', 'image', 'font'], function () {
    gulp.run('site:dist');
});

//默认任务
gulp.task('default', function () {
    console.log('欢迎使用' + _projectDir.projectName + '，尽情的写代码吧!');
    gulp.run('less');
    gulp.run('sass:watch');
    gulp.run('less:watch');
    gulp.run('watch');
    gulp.run('webpack-w');
    gulp.run('site:src');
});


