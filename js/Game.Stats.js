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

