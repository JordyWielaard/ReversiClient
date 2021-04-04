Game.Data = (function () {
    let stateMap = { environment : 'production' }

    //Configuratie en state waarden
    let configMap = {
        mock: [
            {
                url: "api/Spel/Beurt",
                data: 0
            }
        ]
    };

    //pakt de mockdata
    const getMockData = function () {
        const mockData = configMap["mock"][0]["data"]
        return new Promise(function(resolve, reject) {
            resolve(mockData);
        });
    }

    // haalt de data op uit de api
    const getRealData = function(url){
        console.log(url)
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: { },
                success: function (data) {
                   resolve(data);
                },
                error: function (data) {
                    reject(data);
                },
                type: "GET"
            });
        });
    }

    //Post data naar de api
    const postData = function(url, data){
        console.log(url)
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                data: JSON.stringify(data),
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 
                success: function (data) {
                   resolve(data);
                },
                error: function (data) {
                    reject(data);
                },
                type: "POST"
            });
        });
    }


    //roept de juiste get funtie aan op basis van de stateMap
    const get = function (url) {
        return new Promise(function(resolve, reject) {
            if(stateMap == 'production'){
                resolve(getRealData(url));
            }else{
                reject(getMockData())
            }
        })
    }

    // Private function init
    const privateInit = function (environment) {
        if(environment == 'production' || environment == 'development'){
            stateMap = environment;
        }else{
            new Error("Enviroment heeft een verkeerde waarde");
        }
    };

    // Waarde/object geretourneerd aan de outer scope
    return {
        init: privateInit,
        get: get,
        getRealData, getRealData,
        post: postData
    };
})();