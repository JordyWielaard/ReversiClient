Game.Data = (function (url) {
    console.log('hallo, vanuit module Data')

    let stateMap = { environment : 'development' }

    //Configuratie en state waarden
    let configMap = {
        apiKey: "68a956cfaf34f3905b3bad7e40532b14",
        mock: [
            {
                url: "api/Spel/Beurt",
                data: 0
            }
        ]
    };

    const getMockData = function (url) {
        const mockData = configMap["mock"]
        return new Promise((resolve, reject) => {
            resolve(mockData);
        });
    }

    const get = function (url) {
        switch(stateMap){
            case 'production':
                return $.get(url)
                .then(r => {
                    return r
                })
                .catch(e => {
                    console.log(e.message);
                });
            case 'development':
                return getMockData(url);
        }
    }

    // Private function init
    const privateInit = function (environment) {
        if(environment == 'production' || environment == 'development'){
            stateMap = environment;
            get("http://api.openweathermap.org/data/2.5/weather?q=zwolle&apikey=68a956cfaf34f3905b3bad7e40532b14").then(data => console.log(data));
        }else{
            new Error("Enviroment heeft een verkeerde waarde");
        }
        console.log(configMap.apiUrl);
    };

    // Waarde/object geretourneerd aan de outer scope
    return {
        init: privateInit,
        get: get
    };
})('/api/url');