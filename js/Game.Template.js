Game.Template = (function() {

    //Haal de template op
    const getTemplate = function(templateName){
        return spa_templates.templates[templateName];
    }

    //Return correcte template met de juiste data
    const parseTemplate = function(templateName, data){
        return getTemplate(templateName)(data);
    }
    
    // Waarde/object geretourneerd aan de outer scope
    return {
        parseTemplate: parseTemplate
    };   
})();