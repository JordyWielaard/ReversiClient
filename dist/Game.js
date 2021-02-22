const Game = (function(url){
    console.log('hallo, vanuit een module')
    console.log(url)

    //Configuratie en state waarden
    let configMap = {
        apiUrl: url
    };

    const _getCurrentGameState = function(){
        Game.Model.getGameState()
    } 
    
    // Private function init
    const privateInit = function(afterInit){
        console.log(configMap.apiUrl);

        setInterval(
            _getCurrentGameState(),
            2000
        );

        afterInit();
    };
    // Waarde/object geretourneerd aan de outer scope
    return {
    init: privateInit,
    };
})('/api/url');