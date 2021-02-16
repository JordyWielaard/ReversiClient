Game.Reversi = (function(url) {
    console.log('hallo, vanuit module Reversi')

    //Configuratie en state waarden
    let configMap = {
        apiUrl: url
    };
    
    // Private function init
    const privateInit = function(){
        console.log(configMap.apiUrl);
    };
    
    // Waarde/object geretourneerd aan de outer scope
    return {
    init: privateInit
    } ;   
})('/api/url');