const config = require('./config'),
gulp = require('gulp'),
watch = require('gulp-watch');

const js = require('./tasks/js').js(config.files.js["0"], config.files.js, config.localServerProjectPath);
const sass = require('./tasks/sass').sass(config.localServerProjectPath, config.files.sass);
const html = require('./tasks/html').html(config.localServerProjectPath, config.files.html);

sass.displayName = 'sass';  
js.displayName = 'js';
html.displayName = 'html'

const hello = function (done) {
    console.log(`Groeten van ${config.voornaam}!`)
    done();
}

const watchFiles = () => {    
     watch(['./css/sass/*.scss'], gulp.series(sass));   
};

exports.default = hello;
exports.js = js;
exports.watch = watchFiles;
exports.sass = sass;
exports.html = html;