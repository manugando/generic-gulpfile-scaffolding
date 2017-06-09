var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');  
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegoptim = require('imagemin-jpegoptim');

var release = require('./release.json');

var jsDistFolder = 'dist/js';
var jsLibDistMinFileName = 'libs.min.js';
var jsAppDistMinFileName = 'app.min.js';

var cssDistFolder = 'dist/css';
var cssLibDistFileName = 'libs.min.css';
var cssAppDistFileName = 'app.min.css';

var imgDistFolder = 'dist/img';
var fontsDistFolder = 'dist/fonts';

gulp.task('clean:js:lib', function() {
	return del.sync([jsDistFolder + '/' + jsLibDistMinFileName]);
});

gulp.task('build:js:lib', ['clean:js:lib'], function() {
    return gulp.src(release.js_lib)
        .pipe(concat(jsLibDistMinFileName))
        .pipe(uglify())
        .pipe(gulp.dest(jsDistFolder));
});

gulp.task('clean:css:lib', function() {
    return del.sync([cssDistFolder + '/' + cssLibDistFileName]);
});

gulp.task('build:css:lib', ['clean:css:lib'], function() {
    return gulp.src(release.css_lib)
        .pipe(cssnano( {safe : true} ))
    	.pipe(concat(cssLibDistFileName))
    	.pipe(gulp.dest(cssDistFolder));
});

gulp.task('build:lib', ['build:js:lib', 'build:css:lib']);

gulp.task('clean:js:app', function() {
    return del.sync([jsDistFolder + '/' + jsAppDistMinFileName]);
});

gulp.task('build:js:app', ['clean:js:app'], function() {
    return gulp.src(release.js_app)
        .pipe(concat(jsAppDistMinFileName))
        .pipe(uglify())
        .pipe(gulp.dest(jsDistFolder));
});

gulp.task('clean:css:app', function() {
    return del.sync([cssDistFolder + '/' + cssAppDistFileName]);
});

gulp.task('build:css:app', ['clean:css:app'], function() {
    return gulp.src(release.css_app)
        .pipe(less())
        .pipe(cssnano( {safe : true} ))
        .pipe(concat(cssAppDistFileName))
        .pipe(gulp.dest(cssDistFolder));
});

gulp.task('build:app', ['build:js:app', 'build:css:app']);

gulp.task('watch:app', function() {
    gulp.watch(release.watch_js_app, ['build:js:app']);
    gulp.watch([release.watch_css_app], ['build:css:app']);
});

gulp.task('clean:img', function() {
    return del.sync([imgDistFolder + '/**/*']);
});

gulp.task('build:img', ['clean:img'], function() {
    return gulp.src(release.img)
        .pipe(imagemin(
                [
                    imageminPngquant({speed: 1}), 
                    imageminJpegoptim({max : 90})
                ],
                {verbose : true}
            ))
        .pipe(gulp.dest(imgDistFolder));
});

gulp.task('clean:fonts', function() {
    return del.sync([fontsDistFolder + '/**/*.*']);
});

gulp.task('build:fonts', ['clean:fonts'], function() {
    return gulp.src(release.fonts)
    	.pipe(gulp.dest(fontsDistFolder));
});

gulp.task('default', ['watch:app']);