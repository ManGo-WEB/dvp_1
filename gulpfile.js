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
const browserSync = require("browser-sync").create();

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
        css: "src/assets/scss/style.scss",
        js: "src/assets/js/*.js",
        fonts: "src/assets/fonts/**/*.*",
        images: "src/assets/img/**/*.{jpg,gif,ico,png}"
    },
    watch: {
        html: "src/**/*.html",
        css: "src/assets/scss/**/*.scss",
        js: "src/assets/js/**/*.js",
        fonts: "src/assets/fonts/**/*.*",
        images: "src/assets/img/**/*.{jpg,gif,ico,png}"
    },
    clean: "./dist"
}


function html() {
    return src(path.src.html, {base: "src/"})
        .pipe(plumber())
        .pipe(dest(path.build.html));
}




exports.html = html;