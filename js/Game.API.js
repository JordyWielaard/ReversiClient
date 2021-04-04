Game.API = (function() {

    //Haalt een random pokemin uit de pokeapi
    const getRandomPoke = function(){    
        let rdm = Math.floor(Math.random() * 898) + 1
        Game.Data.get('https://pokeapi.co/api/v2/pokemon-form/'+rdm).then(function(data) 
        {
            let imgUrl = data["sprites"]["front_shiny"]
            Game.Reversi.apiDataParse("api", imgUrl);
        });   
    }    
    
    // Waarde/object geretourneerd aan de outer scope
    return {
        getRandomPoke: getRandomPoke
    };   
})();