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