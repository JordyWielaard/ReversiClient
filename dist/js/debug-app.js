$(function() {
    let x = new FeedbackWidget("feedback-danger")
    console.log( "ready!" );
    $("#selector").on("click", function(){
        x.show();
        alert("The button was clicked.");
    });
}); 

var logs = 0;
class FeedbackWidget{
    
    constructor(elementId) {
        this._elementId = elementId;
    }
    get elementId() { //getter, set keyword voor setter methode
        return this._elementId;
    }
    
    log(message){
        localStorage.setItem(logs, JSON.stringify(message))
        if(localStorage.length > 9){
            localStorage.removeItem(localStorage.key(0))
        }
        logs++
    }

    removeLog(){
        localStorage.clear();   
    }

    history(){
        for(let i = 0; i < localStorage.length; i++){
            let x = JSON.stringify(new Array(localStorage.getItem(i).message, localStorage.getItem(i).type))
            console.log(x + '\n')
        }
    }

    show(message, type){
        $("#feedback").text(message)
        if(type == "success"){
            $("#feedback").removeClass("alert alert-danger")
            $("#feedback").addClass("alert alert-success")
        }
        else{
            $("#feedback").removeClass("alert alert-success")
            $("#feedback").addClass("alert alert-danger")
        }
        $("#feedback").removeClass("fadeOut")
        $("#feedback").addClass("fadeIn")
        this.log({message: message, type: type})
    }

    hide(){
        $("#feedback").removeClass("fadeIn")
        $("#feedback").addClass("fadeOut")        
    } 
}
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
    //moet promise worden
    const _getGameState = (function(token){
        return new Promise((resolve, reject) => {
            Game.Data.get("/api/Spel/Beurt/" + token).then(data => {
                switch(data){
                    case 0:
                        resolve("Geen specifieke waarde");
                    case 1:
                        resolve("Wit is aan zet")
                    case 2:
                        resolve("Zwart is aan zet")             
                }
            });
        });
    });
        
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
Game.Reversi = (function(url) {
    console.log('hallo, vanuit module Reversi')

    //Configuratie en state waarden
    let configMap = {
        apiUrl: url
    };
    
    let bord = [
        "Geen, Geen, Geen, Geen, Geen, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Geen, Geen, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Geen, Geen, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Wit, Zwart, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Zwart, Wit, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Geen, Geen, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Geen, Geen, Geen, Geen, Geen",
        
        "Geen, Geen, Geen, Geen, Geen, Geen, Geen, Geen"
        
        ];

    const showFiche = function(bordTileId){        
        $("#"+bordTileId).append("<div class=\"ficheBlack\"></div>")
    }


    const _printBord = function(){
        
        $("body").append("<div id=\"bord\">")
        for(let i = 0; i < bord.length; i++){
            var kleur = bord[i].split(", ");

            for(let j = 0; j < kleur.length; j++){
                $("#bord").append("<div id=\""+i+j+"\" class=\"bordTile\" onclick=\"Game.Reversi.showFiche(this.id)\"></div>")
                if(kleur[j] == 'Zwart'){
                    $("#"+i+j).append("<div class=\"ficheBlack\"></div>")
                }
                if(kleur[j] == 'Wit'){
                    $("#"+i+j).append("<div class=\"ficheWhite\"></div>")
                }
            }
        }
    }


    // Private function init
    const privateInit = function(){
        console.log(configMap.apiUrl);
    };
    
    // Waarde/object geretourneerd aan de outer scope
    return {
        init: privateInit,
        printBord: _printBord,
        showFiche: showFiche
    } ;   
})('/api/url');