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
                let kleurOmschrijving = {
                    "omschrijving": data.omschrijving,
                    "kleur": Game.Model.getPlayerColor(Game.Model.getSpelerToken())
                }
                Game.Reversi.huidigeSpeler(kleurOmschrijving)
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