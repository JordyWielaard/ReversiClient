const { src, dest } = require("gulp");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");


const html = function (backendPath, filehtml) {
    return function () {
        return src(filehtml)
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true,
            removeComments: true
        }))
        .pipe(rename(function (path) {
            path.dirname += "/";
            path.basename = 'index';
            path.extname = ".html";
        }))
        .pipe(dest('./dist/'))
        .pipe(dest(backendPath));
    };
};

exports.html = html;