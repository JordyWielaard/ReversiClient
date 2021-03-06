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

    const getMockData = function () {
        const mockData = configMap["mock"]
        return new Promise((resolve, reject) => {
            resolve(mockData);
        });
    }

    const getRealData = function(url){
        return new Promise((resolve, reject) => {
            $.get(url).then(data => { resolve(data)})
        });
    }

    //ombouwen naar een promise
    const get = function (url) {
        switch(stateMap){
            case 'production':
                return getRealData(url);
            case 'development':
                return getMockData();
        }
    }

    // Private function init
    const privateInit = function (environment) {
        if(environment == 'production' || environment == 'development'){
            stateMap = environment;
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