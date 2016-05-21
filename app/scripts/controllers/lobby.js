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

    LobbyController.$inject = ['$location', '$rootScope', 'GlobalMessageService'];
    function LobbyController($location, $rootScope, GlobalMessageService) {

        console.log("--->LobbyController init");

        var div = '<div class="col-md-4"><div class="card grupo"><p>P</p><p>POWERPUFF</p><p>Formação</p><p>Alunos: 4</p><div class="alunos"><div class="aluno"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno1</p></div><div class="aluno"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno2</p></div><div class="aluno"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno3</p></div><div class="aluno"><img src="../images/pu.jpg" alt="Professor Utonio"><p>aluno4</p></div></div><p>Assunto</p></div></div>';

        for(var i = 0; i < 100; i++){
        	$('.grupos').append(div);
        }

    }