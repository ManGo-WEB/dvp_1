"use strict"

const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const removeComments = require("gulp-strip-css-comments");
const del = require("del");
const cssbeautify = require("gulp-cssbeautify");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const panini = require("panini");
const sourcemaps = require("gulp-sourcemaps");
const browsersync = require("browser-sync").create();

// Определяем пути к файлам //
var path = {
    build: {
        html: "dist/",
        css: "dist/assets/css/",
        js: "dist/assets/js/",
        fonts: "dist/assets/fonts/",
        images: "dist/assets/img/"
    },
    src: {
        html: "src/*.html",
        css: "src/assets/sass/style.scss",
        js: "src/assets/js/*.js",
        fonts: "src/assets/fonts/**/*.*",
        images: "src/assets/img/**/*.{jpg,gif,ico,png}"
    },
    watch: {
        html: "src/**/*.html",
        css: "src/assets/sass/**/*.scss",
        js: "src/assets/js/**/*.js",
        fonts: "src/assets/fonts/**/*.*",
        images: "src/assets/img/**/*.{jpg,gif,ico,png}"
    },
    clean: "./dist"
}

// Настройки browserSync //
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload();
}

// Сборка HTML //
function html() {
    panini.refresh();
    return src(path.src.html, {base: "src/"})
        .pipe(plumber())
        .pipe(panini({
            root: 'src/',
            layouts: 'src/tpl/layouts/',
            partials: 'src/tpl/partials/'
          }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

// Сборка CSS //
function css() {
    return src(path.src.css, {base: "src/assets/sass/"})
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            Browserslist: ['last 8 versions'],
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(gulp.dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discsrdComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream());
}

// Сборка JS //
function js() {
    return src(path.src.js, {base: "src/assets/js/"})
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream());

}

// Сборка картинок //
function images() {
    return src(path.src.images, {base: "src/assets/img/"})
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images));
}

// Сборка шрифтов //
function fonts() {
    return src(path.src.fonts, {base: "src/assets/fonts/"})
        .pipe(gulp.dest(path.build.fonts));
}

// Очистка папки dest //
function clean() {
    return del(path.clean);
}

// Watcher //
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, gulp.parallel(html, js, css, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);


// Export tasks //
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.watch = watch;
exports.build = build;
exports.default = watch;