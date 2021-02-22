"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(function () {
  var x = new FeedbackWidget("feedback-danger");
  console.log("ready!");
  $("#selector").on("click", function () {
    x.show();
    alert("The button was clicked.");
  });
});
var logs = 0;

var FeedbackWidget = /*#__PURE__*/function () {
  function FeedbackWidget(elementId) {
    _classCallCheck(this, FeedbackWidget);

    this._elementId = elementId;
  }

  _createClass(FeedbackWidget, [{
    key: "elementId",
    get: function get() {
      //getter, set keyword voor setter methode
      return this._elementId;
    }
  }, {
    key: "log",
    value: function log(message) {
      localStorage.setItem(logs, JSON.stringify(message));

      if (localStorage.length > 9) {
        localStorage.removeItem(localStorage.key(0));
      }

      logs++;
    }
  }, {
    key: "removeLog",
    value: function removeLog() {
      localStorage.clear();
    }
  }, {
    key: "history",
    value: function history() {
      for (var i = 0; i < localStorage.length; i++) {
        var x = JSON.stringify(new Array(localStorage.getItem(i).message, localStorage.getItem(i).type));
        console.log(x + '\n');
      }
    }
  }, {
    key: "show",
    value: function show(message, type) {
      $("#feedback").text(message);

      if (type == "success") {
        $("#feedback").removeClass("alert alert-danger");
        $("#feedback").addClass("alert alert-success");
      } else {
        $("#feedback").removeClass("alert alert-success");
        $("#feedback").addClass("alert alert-danger");
      }

      document.getElementById(this._elementId).style.display = "block";
      this.log({
        message: message,
        type: type
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      document.getElementById(this._elementId).style.display = "none";
    }
  }]);

  return FeedbackWidget;
}();

Game.Data = function (url) {
  console.log('hallo, vanuit module Data');
  var stateMap = {
    environment: 'development'
  }; //Configuratie en state waarden

  var configMap = {
    apiKey: "68a956cfaf34f3905b3bad7e40532b14",
    mock: [{
      url: "api/Spel/Beurt",
      data: 0
    }]
  };

  var getMockData = function getMockData(url) {
    var mockData = configMap["mock"];
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  };

  var get = function get(url) {
    switch (stateMap) {
      case 'production':
        return $.get(url).then(function (r) {
          return r;
        })["catch"](function (e) {
          console.log(e.message);
        });

      case 'development':
        return getMockData(url);
    }
  }; // Private function init


  var privateInit = function privateInit(environment) {
    if (environment == 'production' || environment == 'development') {
      stateMap = environment;
      get("http://api.openweathermap.org/data/2.5/weather?q=zwolle&apikey=68a956cfaf34f3905b3bad7e40532b14").then(function (data) {
        return console.log(data);
      });
    } else {
      new Error("Enviroment heeft een verkeerde waarde");
    }

    console.log(configMap.apiUrl);
  }; // Waarde/object geretourneerd aan de outer scope


  return {
    init: privateInit,
    get: get
  };
}('/api/url');

var Game = function (url) {
  console.log('hallo, vanuit een module');
  console.log(url); //Configuratie en state waarden

  var configMap = {
    apiUrl: url
  };

  var _getCurrentGameState = function _getCurrentGameState() {
    Game.Model.getGameState();
  }; // Private function init


  var privateInit = function privateInit(afterInit) {
    console.log(configMap.apiUrl);
    setInterval(_getCurrentGameState(), 2000);
    afterInit();
  }; // Waarde/object geretourneerd aan de outer scope


  return {
    init: privateInit
  };
}('/api/url');

Game.Model = function (url) {
  console.log('hallo, vanuit module Model'); //Configuratie en state waarden

  var configMap = {
    apiUrl: url
  };

  var getWeather = function getWeather(WeatherURL) {
    var promise = new Promise(function (resolve, reject) {
      Game.Data.get(WeatherURL).then(function (data) {
        temprature = data["main"]["temp"];

        if (temprature == null) {
          reject("Temprature was null");
        } else {
          resolve(temprature);
        }
      });
    });
    console.log(promise.then());
  };

  var _getGameState = function _getGameState(token) {
    //aanvraag via Game.Data
    var state = Game.Data.get("/api/Spel/Beurt/" + token); //controle of ontvangen data valide is

    switch (state) {
      case 0:
        return "Geen specifieke waarde";

      case 1:
        return "Wit is aan zet";

      case 2:
        return "Zwart is aan zet";
    }
  }; // Private function init


  var privateInit = function privateInit() {
    console.log(configMap.apiUrl);
  }; // Waarde/object geretourneerd aan de outer scope


  return {
    init: privateInit,
    getWeather: getWeather,
    getGameState: _getGameState
  };
}('/api/url');

Game.Reversi = function (url) {
  console.log('hallo, vanuit module Reversi'); //Configuratie en state waarden

  var configMap = {
    apiUrl: url
  }; // Private function init

  var privateInit = function privateInit() {
    console.log(configMap.apiUrl);
  }; // Waarde/object geretourneerd aan de outer scope


  return {
    init: privateInit
  };
}('/api/url');