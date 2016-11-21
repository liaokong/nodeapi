// 引入gulp
var gulp = require('gulp');

// 引入组件
// var jshint = require('gulp-jshint');//检查js
var sass   = require('gulp-sass');  //编译Sass
var concat = require('gulp-concat');//合并
var uglify = require('gulp-uglify');//uglify 组件（用于压缩 JS）
var rename = require('gulp-rename');//重命名
var mincss = require('gulp-minify-css');

// 检查js脚本的任务
// gulp.task('lint', function() {
//     gulp.src('./js/*.js') //可配置你需要检查脚本的具体名字。
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// 编译Sass
gulp.task('sass', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));//dest()写入文件
});

// 合并，压缩js文件
// 找到 js/ 目录下的所有 js 文件，压缩，重命名，最后将处理完成的js存放在 dist/js/ 目录下
gulp.task('scripts', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));

        console.log('gulp task is done');//自定义提醒信息
});

// gulp.task('minifycss', function(){
//     gulp.src('./dist/css/styles.css')
//     .pipe(mincss())
//     .pipe(rename('styles.min.css'))
//     .pipe(gulp.dest('./dist/css'));
// });


gulp.task('default', function(){
    gulp.run('scripts', 'sass');
});

gulp.watch('./src/js/*.js', function(){
    gulp.run('scripts');
});

gulp.watch('./src/sass/*.scss', function(){
    gulp.run('sass');
});
