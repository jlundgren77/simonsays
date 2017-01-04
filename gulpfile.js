'use strict'

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    del = require('del'),
    rename = require('gulp-rename'),
	maps = require('gulp-sourcemaps');		

gulp.task("concatScripts", function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'js/main.js'	
		])
		.pipe(maps.init())
		.pipe(concat('app.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src('js/app.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
	return gulp.src('scss/application.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('css'));
})

gulp.task('watchFiles', function() {
	gulp.watch('scss/**/*.scss', ['compileSass']);
	gulp.watch('js/main.js', ['concatScripts']);
});

gulp.task('clean', function() {
	del(['dist', 'css/application.css*', 'js/app*.js*']);
});

gulp.task("build", ['minifyScripts', 'compileSass'], function() {
	return gulp.src(["css/application.css", "js/app.min.js", 'index.html',
					"images/**"], { base: './'})
				.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);


gulp.task('default', ["clean"], function() {
	gulp.start('build');
});