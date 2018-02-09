var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	cssmin = require("gulp-cssmin"),
	rename = require("gulp-rename"),
	sourcemaps = require('gulp-sourcemaps'),
	livereload = require('gulp-livereload');

	gulp.task('sass', function () {
		return gulp.src('scss/**/*.scss')
			.pipe(sass())
			.pipe(autoprefixer({
				cascade: true
			}))
			.pipe(gulp.dest('css'))
			.pipe(sourcemaps.init())
			.pipe(cssmin())
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('css'))
			.pipe(livereload());
	});

	gulp.task('watch', function() {
		livereload.listen();
    	gulp.watch('scss/**/*.scss', ['sass'])/*.on('change', livereload.changed)*/;
    });
	gulp.task('default', ['sass','watch']);
