Game.Model = (function(url) {
    console.log('hallo, vanuit module Model')

    //Configuratie en state waarden
    let configMap = {
        apiUrl: url
    };

    let getWeather = function (WeatherURL) {
        let promise = new Promise((resolve, reject) =>{
            Game.Data.get(WeatherURL).then(data => {
                temprature = data["main"]["temp"]
                if (temprature == null){
                    reject("Temprature was null")
                }
                else{
                    resolve(temprature);
                }
            });  
        });   
        console.log(promise.then())  
    }
    
    const _getGameState = function(token){
        //aanvraag via Game.Data
        let state = Game.Data.get("/api/Spel/Beurt/" + token);
        //controle of ontvangen data valide is
        switch(state){
            case 0:
                return "Geen specifieke waarde"
            case 1:
                return "Wit is aan zet"
            case 2:
                return "Zwart is aan zet"             
        }
    };
        
    // Private function init
    const privateInit = function(){
        console.log(configMap.apiUrl);
    };
    
    // Waarde/object geretourneerd aan de outer scope
    return {
    init: privateInit,
    getWeather: getWeather,
    getGameState: _getGameState
    };    
})('/api/url');