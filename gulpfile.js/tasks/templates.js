const { src, dest } = require("gulp");
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const handlebars = require('gulp-handlebars');


//tip: vergeet niet dat de extensie .hbs is, dus de glob van 
//templateFiles kan er zo uitzien: templates/**/*.hbs 
const templates = function (templateFiles) {
    return function(){
    return src(templateFiles)
    // Compile each Handlebars template source file to a template function
        .pipe(handlebars())
        // Wrap each template function in a call to Handlebars.template
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        // Declare template functions as properties and sub-properties of MyApp.templates
        .pipe(declare({
            namespace: 'spa_templates',
            noRedeclare: true, // Avoid duplicate declarations
            processName: function(filePath) {
                // Allow nesting based on path using gulp-declare's processNameByPath()
                // You can remove this option completely if you aren't using nested folders
                // Drop the client/templates/ folder from the namespace path by removing it from the filePath
                return declare.processNameByPath(filePath.replace('<parent_map>/templates/', '')); //windows? backslashes: \\
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(dest('dist/js/'))
    }
}

exports.templates = templates;
//meer weten over 'declare': https://github.com/lazd/gulp-handlebars/tree/8e97f01db9edac7068a6402b45f47203841ca705/examples/namespaceByDirectory
