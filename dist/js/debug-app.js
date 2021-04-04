const Game = (function() {

    // variable voor de feedbackwidget
    let feedback

    //Haalt het spel op doormiddel van een get methode en zorgt ervoor dat alles wordt getoond.
    const _getCurrentGameState = function(gameToken) {
        Game.Model.getGameState(gameToken)
            .then((data) => {
                let bordFormated = { "bord": JSON.parse(data.bord) }
                Game.Reversi.printBord(bordFormated)
                //Zet data voor template
                let speler1inf = {
                    "aanzet": Game.Model.getAanzet(data.speler1Token),
                    "speler": "Speler 1",
                    "kleur": "Zwart",
                }
                //Zet data voor template
                let speler2inf = {
                    "aanzet": Game.Model.getAanzet(data.speler2Token),
                    "speler": "Speler 2",
                    "kleur": "Wit",
                }
                Game.Reversi.showSpelers(speler1inf, speler2inf);
                //Zet data voor template
                let kleur = {
                    "omschrijving": data.omschrijving,
                    "kleur": Game.Model.getPlayerColor(Game.Model.getSpelerToken())
                }
                Game.Reversi.huidigeSpeler(kleur)
                Game.Stats.updateStats()
                //Als het spel is afgelopen wordt het feedbackwidget met de winnaar getoond
                if (data.afgelopen) {
                    showFeedback("feedback")
                    if (data.winnaar == data.speler1Token || data.winnaar == data.speler2Token) {
                        feedback.show("Het spel is afgelopen. De winnaar is: " + Game.Model.getPlayerColor(data.winnaar), "success")
                    } else {
                        feedback.show("Het spel is afgelopen. Het is " + data.winnaar, "success")
                    }
                }
            })
            .catch((data) => {
                console.log(data)
            })
    }

    //Laat het feedback widget zien
    const showFeedback = function(elementId) {
        var x = document.getElementById(elementId);
        if (x.style.display === "none") {
            x.style.display = "block";
        }
    }

    // Private function init
    const privateInit = function(gameToken, spelerToken, url) {
        feedback = new FeedbackWidget("Winnaar")
        Game.Reversi.init()
        Game.Model.init(url)
        Game.Stats.init(url)
        Game.Model.getCurrentPlayer(spelerToken)
        _getCurrentGameState(gameToken)
        setInterval(function() { _getCurrentGameState(gameToken) }, 5000);
    };
    // Waarde/object geretourneerd aan de outer scope
    return {
        init: privateInit,
    };
})();
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
        $("#feedbackText").text(message)
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
        const mockData = configMap["mock"]
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
               .catch(data => {console.log(data)});
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
Game.Reversi = (function() {

    //Laat pokemon zien
    const _apiDataParse = function(template, data){
        $("#api").html(Game.Template.parseTemplate(template, data));
    }

    //Plaatst fiche op het bord
    const _showFiche = function(bordTegel){
        $("#bord").children().each(function(i, el){
            if(bordTegel == el){
                let x = i % 8
                let y = ~~(i / 8);
                let data = {
                    X: x,
                    Y: y,
                    SpelerToken: Game.Model.getSpelerToken(),
                    SpelToken: Game.Model.getSpelToken(),
                    Pas: false
                }
                Game.Model.postZet(data)   
            }
        })     
    }
    //Click methode voor het overslaan van een beurt
    const _pas = function(){
        let data = {
            X: 0,
            Y: 0,
            SpelerToken: Game.Model.getSpelerToken(),
            SpelToken: Game.Model.getSpelToken(),
            Pas: true
        }
        Game.Model.postZet(data)   
    } 
    //Click methode voor het opgeven van het spel
    const _opgeven = function(){
        let data = {
            SpelerToken: Game.Model.getSpelerToken(),
            SpelToken: Game.Model.getSpelToken(),
        }
        Game.Model.postOpgeven(data)   
    } 

    //Laat spelers zien op basis van spelers template
    const _showSpelers = function(data1, data2){
        $("#speler1").html(Game.Template.parseTemplate("spelers", data1))
        $("#speler2").html(Game.Template.parseTemplate("spelers", data2))
    }
    //Laat bord zien op basis van bord template
    const _printBord = function(bord){
        $("#spelBord").html(Game.Template.parseTemplate("bord", bord));
    }

    //Laat huidige speler zien op basis van huidigeSpeler template
    const _huidigeSpeler = function(data){
        $("#huidigeSpeler").html(Game.Template.parseTemplate("huidigeSpeler", data))
    }


    // Private function init
    const privateInit = function(){
        $("#buttonpas").click(_pas)
        $("#buttonopgeven").click(_opgeven)
        Game.Data.init("production")
    };
    
    // Waarde/object geretourneerd aan de outer scope
    return {
        init: privateInit,
        printBord: _printBord,
        showFiche: _showFiche,
        pas: _pas,
        opgeven: _opgeven,
        apiDataParse: _apiDataParse,
        showSpelers: _showSpelers,
        huidigeSpeler: _huidigeSpeler
    };   
})();
Game.Stats = (function() {

    let baseAddress;
    //Method to update to get the data
    const updateStats = function() {
        _updateAantal().then((data) => {
            _plaatsGraphic(data);
        });
    }
    //Methode die een promise returnt met de data vanuit de api die geparst is voor de template
    const _updateAantal = function() {
        return new Promise(function(resolve, reject) {
            //Haalt speler statistics op vanuit de api
            var token = Game.Model.getSpelToken();
            Game.Data.get(baseAddress+'api/Spel/PieceHistory/' + token).then(function (data) {
                var jsonData = JSON.parse(data);

                //Maakt een js template voor de handlebars
                playerPieceHistory = {
                    player1: [],
                    player2: []
                };

                //Voegt data van speler 1 toe aan de data voor de template
                for (let key in jsonData[0]) {
                    playerPieceHistory.player1.push(jsonData[0][key]);
                }
                //Voegt data van speler 1 toe aan de data voor de template
                for (let key in jsonData[1]) {
                    playerPieceHistory.player2.push(jsonData[1][key]);
                }
                resolve(playerPieceHistory);
            })
            .catch(function (data) {console.log(data)})
        })

    }
    //Methode om de chart te laten zien doormiddel van de handlebar
    const _plaatsGraphic = function(playerPieceHistory) {
        $("#chart").html(Game.Template.parseTemplate("stats", playerPieceHistory))
    }

    const privateInit = function(url){
        baseAddress = url;
    };

    return {
        init: privateInit,
        updateStats: updateStats
    } 
})();


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