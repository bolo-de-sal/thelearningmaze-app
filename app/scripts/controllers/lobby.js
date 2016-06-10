'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:LobbyController
 * @description
 * # LobbyController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('LobbyController', LobbyController);

    LobbyController.$inject = ['AuthenticationService', 'SessionService', '$location', '$rootScope', "EventService"];
    function LobbyController(AuthenticationService, SessionService, $location, $rootScope, EventService) {

    	var lobbyCtrl = this;

        // console.log("--->LobbyController init");

        $("body").removeClass("bodyLogin");
        $(".header").show();

        // var div = '<div class="col-md-4"><div class="card group"><p>P</p><p>POWERPUFF</p><p>Formação</p><p>Alunos: 4</p><div class="students"><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno1</p></div><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno2</p></div><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno3</p></div><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno4</p></div></div><p>Assunto</p></div></div>';

        // // var p1 = '<div class="col-md-4"><div class="card group"><p>P</p><p>Grupo ';
        // // var p2 = '</p><p>Formação</p><p>students: 4</p><div class="students"><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno1</p></div><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno2</p></div><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno3</p></div><div class="student"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno4</p></div></div><p>Assunto</p></div></div>';

        // for(var i = 0; i < 100; i++){
        // 	$('.groups').append(div);
        // 	// $('.groups').append(p1 + i + p2);
        // }

        var codEvento = 1;

        $rootScope.dataLoading = true;

        EventService.getEventGroups(codEvento).then(getEventGroupsSuccess, getEventGroupsFailure);

        function getEventGroupsSuccess(response){
        	console.log("Grupos do evento: " + codEvento);
            console.log(response);

            lobbyCtrl.groups = response;
            $rootScope.dataLoading = false;
        }

        function getEventGroupsFailure(response){
        	console.log("Grupos do evento: " + codEvento);
            console.log(response);
            $rootScope.dataLoading = false;
        }

        // Habilita CORS
        jQuery.support.cors = true;
        
        // function getUrlParameter(sParam) {
        //     var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        //         sURLVariables = sPageURL.split('&'),
        //         sParameterName,
        //         i;

        //     alert('Location ' + window.location);
        //     alert('decode ' + decodeURIComponent(window.location.search.substring(1)));
        //     alert('sPageURL ' + sPageURL);
        //     alert('sURLVariables ' + sURLVariables);
        //     alert('sParameterName ' + sParameterName);
        //     alert('i ' + i);

        //     for (i = 0; i < sURLVariables.length; i++) {
        //         sParameterName = sURLVariables[i].split('='); alert('sParameterName ' + sParameterName);

        //         if (sParameterName[0] === sParam) {
        //             alert('sParameterName[0] ' + sParameterName[0]);
        //             alert('sParam ' + sParam);
        //             return sParameterName[1] === undefined ? true : sParameterName[1];
        //         }
        //     }
        // };

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

        evento.client.joinEvento = function (message) {
            //$('#discussion').append('<li>' + message + ' entrou no evento!</li>');
            alert('Alguém entrou no lobby. Mensagem SignalR: ' + message);
        }

        // Abre conexão com o servidor
        $.connection.hub.start().done(function () {
            if (groupID) {
                evento.server.joinEvento(groupID, 0);
            }
        });
    }