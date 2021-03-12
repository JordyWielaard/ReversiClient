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