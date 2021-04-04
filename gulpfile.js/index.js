const { parallel } = require('gulp');
const config = require('./config'),
gulp = require('gulp'),
watch = require('gulp-watch');
browserSync = require("browser-sync").create();


const js = require('./tasks/js').js(config.files.js, config.files.jsOrder, config.localServerProjectPath);
const sass = require('./tasks/sass').sass(config.localServerProjectPath, config.files.sass);
const html = require('./tasks/html').html(config.localServerProjectPath, config.files.html);
const vendor = require('./tasks/vendor').vendor(config.files.vendor, config.localServerProjectPath);
const templates = require('./tasks/templates').templates(config.files.templates, config.files.partials, config.localServerProjectPath);

sass.displayName = 'sass';  
js.displayName = 'js';
html.displayName = 'html';
vendor.displayName = 'vendor';
templates.displayName = 'templates';

const hello = function (done) {
    console.log(`Groeten van ${config.voornaam}!`)
    done();
}

const watchFiles = () => {    
     browserSync.init({server:{baseDir: "./dist/"}});
     watch(['./css/sass/*.scss'], gulp.series(sass));   
     watch(['./js/*.js'], gulp.series(js));
     watch(['./templates/**/*.hbs'], gulp.series(templates));
     watch(['./*.html'], gulp.series(html));
     watch("./**/*.*").on("change", browserSync.reload);
};

exports.build = parallel(js, sass, html, vendor, templates);
exports.js = js;
exports.watch = watchFiles;
exports.sass = sass;
exports.html = html;
exports.vendor = vendor;
exports.templates = templates;