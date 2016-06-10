'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:AlunoController
 * @description
 * # AlunoController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('AlunoController', AlunoController);

    AlunoController.$inject = ['AuthenticationService', 'SessionService', '$location', '$rootScope', "EventService"];
    function AlunoController(AuthenticationService, SessionService, $location, $rootScope, EventService) {
    	// Habilita CORS
        jQuery.support.cors = true;

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;

            name = name.replace(/[\[\]]/g, "\\$&");

            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);

            if (!results) return null;

            if (!results[2]) return '';

            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        // Declara endereço do servidor
        //$.connection.hub.url = "http://tlm-api-dev.azurewebsites.net/signalr";
        $.connection.hub.url = "http://localhost:50806/signalr";

        // chatHub é o nome do Hub definido no código do server
        var evento = $.connection.eventoHub;
        
        $.connection.hub.logging = true;

        var groupID = getParameterByName('codGrupo');
        var playerID = getParameterByName('codParticipante');

        // Abre conexão com o servidor
        $.connection.hub.start().done(function () {
            if (groupID) {
                evento.server.joinEvento(groupID, playerID);
            }
        });
    }