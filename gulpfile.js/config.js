module.exports = {
    localServerProjectPath : 'C:\\Users\\A.W. Wielaard\\source\\repos\\ReversiMvcApp\\ReversiMvcApp\\wwwroot\\',
    files: {
        js: [
            'js/**/*.js',
            'js/*.js'
        ],

        jsOrder: [
            'js/Game.js',
            'js/*.js'
        ], 

        sass: [
            './css/**/*.scss'
        ],

        html: [
            './*.html'
        ],

        vendor:[
            './vendor/*.js'
        ],

        templates:[
            './templates/**/[^_]*.hbs'
        ],

        partials:[
            './templates/**/_*.hbs'
           ], 

    },


    voornaam: 'Jordy Wielaard',

  
};