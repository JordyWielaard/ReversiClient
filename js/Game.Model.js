Game.Model = (function() {
    
    let baseAddress;
    let spel;
    let huidigeSpeler;

    //Zet de token van de huidige speler
    const _getCurrentPlayer = (function(spelerToken){
        huidigeSpeler = spelerToken
    })

    //Return de kleur van de speler
    const _getPlayerColor = (function(spelerToken){
        if(spelerToken == spel.speler1Token){
            return "Zwart"
        }
        else{
            return "Wit"
        }
    })

    //Return het token van de huidige speler
    const _getSpelerToken = (function(){
        return huidigeSpeler
    })

    //Return de game token
    const _getSpelToken =(function(){
        return spel.token
    })

    //Kijkt of speler aan zet is
    const _getAanzet = (function(spelerToken){
        if(spelerToken == spel.speler1Token && spel.aandeBeurt == 2){
            return 1
        }else if(spelerToken == spel.speler2Token && spel.aandeBeurt == 1){
            return 1
        }else{
            return 2
        }
    })

    //Haalt het spel op
    const _getGameState = (function(token){
        return new Promise(function(resolve, reject) {
            if(token != null){
                Game.Data.get(baseAddress+'api/Spel/' +token).then(data => {
                    spel = data  
                    resolve(data)            
                   })
               .catch(data => {
                   console.log(data[1])
                   resolve(data)
                });
               
            }
            else{
                reject("Token is leeg")
            }
        });
    });

    //Post zet van de speler
    const _postZet = (function(data)  {
        return new Promise(function(resolve, reject) {
            if(data != null){
                    Game.Data.post(baseAddress+'api/Spel/Zet', data).then(data => {
                    Game.API.getRandomPoke();
                    resolve(data)
                })
                .catch(data => {console.log(data)});
                
            }
            else{
                reject("Geen x en y gegeven")
            }
        })
    })

    //Post data van speler die opgeeft
    const _postOpgeven = (function(data) {
        return new Promise(function(resolve, reject) {
            if(data != null){
                    Game.Data.post(baseAddress+'api/Spel/Opgeven', data).then(data => {
                    Game.API.getRandomPoke();
                })
                .catch(data => {console.log(data)});
            }
            else{
                reject("Incorrecte data")
            }
        })
    })
        
    // Private function init
    const privateInit = function(url){
        baseAddress = url;
    };
    
    // Waarde/object geretourneerd aan de outer scope
    return {
    init: privateInit,
    getGameState: _getGameState,
    getSpelerToken: _getSpelerToken,
    getSpelToken: _getSpelToken,
    getCurrentPlayer: _getCurrentPlayer,
    postZet: _postZet,
    postOpgeven: _postOpgeven,
    getAanzet: _getAanzet,
    getPlayerColor: _getPlayerColor
    };    
})();