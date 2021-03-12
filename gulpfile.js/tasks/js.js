const { src, dest } = require("gulp");
const concat = require("gulp-concat");
const order = require("gulp-order");
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');

const fn = function (filesJs, filesJsOrder, backendPath) {
    return function () {
        return src(filesJs)
            .pipe(order(filesJsOrder, { base: './' }))
            .pipe(concat('debug-app.js'))
            .pipe(dest('./dist/js'))
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))    
            .pipe(uglify({compress: true})) 
            .pipe(concat('app.js'))                   
            .pipe(dest('./dist/js'))
            .pipe(dest(backendPath + "js"));
    };
};

exports.js = fn;
