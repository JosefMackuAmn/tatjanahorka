var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
//var rename = require('gulp-rename');
//var uglifyjs = require('gulp-uglify-es').default;

sass.compiler = require('node-sass');

var paths = {
    sass: {
        source: './src/client/scss/main.scss',
        destination: './public/css'
    }
};

gulp.task('scss', () => {
    return gulp.src(paths.sass.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest(paths.sass.destination));
});