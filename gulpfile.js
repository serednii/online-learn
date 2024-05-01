const { src, dest, parallel, series } = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
const del = require('del');
const sync = require('browser-sync').create();

function styles() {
  return src('app/scss/style.scss')
    //.pipe(sass ({outputStyle:"expanded"}).on('error', sass.logError))//не зжимае файл
    .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))//зжимае файл
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(sync.stream())
}

function browser() {
  sync.init({
    server: {
      baseDir: 'app/'
    },
    port: 3040,
    notify: false
  })
}

function scripts() {
  return src(
    [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/slick-carousel/slick/slick.js', //Display multiple slick image slider and carousel using shortcode with category.
      // 'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js', //Также fancyBox позволяет группировать картинки, создавая галереи,
      'node_modules/rateyo/src/jquery.rateyo.js', //рейтингами звезд
      // 'node_modules/ion-rangeslider/js/ion.rangeSlider.js', //Плагин ion.rangeSlider  динамически менять шаг ползунка?
      // 'node_modules/jquery-form-styler/dist/jquery.formstyler.js', //плагин для стилизации селектов, чекбоксов, радиокнопок, файловых и числовых полей
      'app/js/send-mail.js',
      'app/js/validate.js',
      'app/js/send-newsletter.js',
      'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify()) // мініиізує файл
    .pipe(dest('app/js'))
    .pipe(sync.stream())
}

function images() {
  return src('app/images/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest('dist/images'))
}

function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], { base: 'app' })
    .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html',]).on('change', sync.reload);
  // watch(['css/style.css'],styles);
  // watch(['js/**/*.js'], scripts);
  //watch(['js**/*.js','!js/main.min.js'], scripts);
  // watch(['**/*.html',]).on('change', sync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browser = browser;
exports.watching = watching;
exports.images = images;
exports.build = series(cleanDist, images, build);
exports.cleanDist = cleanDist;
exports.default = parallel(styles, scripts, browser, watching);

//exports.default = parallel(browser, watching);
