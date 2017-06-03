'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var gulpsync = require('gulp-sync')(gulp)

var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");
var del = require('del');

gulp.task('clean-dist', function () {
  return del.sync(['./dist', './index.html'])
})

gulp.task('clean-rev', function () {
  return del.sync(['./dist/rev'])
})

gulp.task('sass', function () {
  return gulp.src('./assets/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('cssconcat', function () {
  return gulp.src(
    ['bower_components/angular-dropdowns/dist/angular-dropdowns.min.css']
  ).pipe(concat('libs.css')).pipe(gulp.dest('dist'));
});

gulp.task('concat-app', function () {
  return gulp.src('assets/app/**/*.js')
	 .pipe(concat('app.js'))
	 .pipe(gulp.dest('dist/'));
});

gulp.task('concat', function() {
  return gulp.src([
   'bower_components/jquery/dist/jquery.js',
	 'bower_components/humanize-duration/humanize-duration.js',
	 'bower_components/moment/min/moment.min.js',
	 'bower_components/remodal/dist/remodal.js',
	 'bower_components/spin.js/spin.js',
   'bower_components/slick-carousel/slick/slick.js',
   'bower_components/wow/dist/wow.js',
   'bower_components/Tabslet/jquery.tabslet.js',
   'bower_components/select2/dist/js/select2.full.js',
	 'bower_components/angular/angular.min.js',
	 'bower_components/angular-timer/dist/angular-timer.min.js',
	 'bower_components/angular-translate/angular-translate.min.js',
	 'bower_components/angular-dropdowns/dist/angular-dropdowns.min.js',
	 'bower_components/ngSmoothScroll/lib/angular-smooth-scroll.js',
	 'bower_components/angular-slick/dist/slick.js',
	 'bower_components/angular-ui-router/release/angular-ui-router.min.js',
	 'bower_components/angular-touch/angular-touch.min.js',
	 'bower_components/angular-scroll/angular-scroll.min.js',
	 'bower_components/fn-remodal/remodal.js',
	 'bower_components/angular-spinner/angular-spinner.min.js',
	 'bower_components/angular-animate/angular-animate.min.js',
	 'bower_components/ng-videosharing-embed/build/ng-videosharing-embed.min.js',
	 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
   'bower_components/angular-svg-round-progressbar/build/roundProgress.min.js',
   'bower_components/betsol-ng-time-counter/dist/scripts/betsol-ng-time-counter.min.js'
  ])
    .pipe(concat('production.js'))
    .pipe(gulp.dest('assets/js/'));
});

gulp.task('compress', function() {
  return gulp.src('assets/js/production.js')
    .pipe(uglify())
	.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('assets/sass/**/*.scss', gulpsync.sync(['clean-rev', 'sass', 'revision', 'revreplace']));
  gulp.watch('./assets/js/production.js', gulpsync.sync(['clean-rev', 'compress', 'revision', 'revreplace']));
  gulp.watch('./assets/app/**/*.js', gulpsync.sync(['clean-rev', 'concat-app', 'revision', 'revreplace']));
});

gulp.task("revision", function(){
  return gulp.src(["./dist/*.css", "./dist/*.js"])
    .pipe(rev())
    .pipe(gulp.dest('./dist/rev'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev'))
})

gulp.task("revreplace", function(){
  var manifest = gulp.src("./dist/rev/rev-manifest.json");

  return gulp.src("./index.static.html")
    .pipe(gulp.dest("./"))
    .pipe(rename("index.html"))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("./"));
});

gulp.task("copy", function(){
  return gulp.src(["./assets/images/**/*"])
    .pipe(gulp.dest('./dist/assets/images'))
})

gulp.task('default',
	gulpsync.sync(
		['clean-dist', 'concat-app', 'sass', 'concat', 'cssconcat', 'compress', 'revision', 'revreplace', 'copy', 'watch']
	)
);
