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

        // Declara endereço do servidor
        $.connection.hub.url = "http://tlm-api-dev.azurewebsites.net/signalr";

        // chatHub é o nome do Hub definido no código do server
        var evento = $.connection.eventoHub;
        
        $.connection.hub.logging = true;

        evento.client.joinEvento = function (message) {
            //$('#discussion').append('<li>' + message + ' entrou no evento!</li>');
            alert('Alguém entrou no lobby. Mensagem SignalR: ' + message);
        }

        // Abre conexão com o servidor SignalR
        $.connection.hub.start().done(function () {
            console.log("Teste");
            evento.server.joinEventoProfessor("JJJJJJ");
        });
    }