'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:HomeController
 * @description
 * # HomeController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['AuthenticationService', 'SessionService', 'EventService', '$rootScope', '$location', 'AlertService'];

    function HomeController(AuthenticationService, SessionService, EventService, $rootScope, $location, AlertService) {
        var homeCtrl = this;

        $rootScope.dataLoading = true;

        $("body").removeClass("bodyLogin");
        $(".header").show();
        $(".content").css("top", "50px");

        //Array para controle de páginas já carregadas
        var pageContentControl = [{ loaded: true }];

        // Variável para desabilitar botões
        homeCtrl.disableButtons;

        // EventService.closeEvent(); 
        // EventService.openEvent(); 

        EventService.getEvents(0).then(getEventsSuccess, getEventsError);

        EventService.getActiveEvent().then(getActiveEventSuccess, getActiveEventError);

        // Get Events

        function getEventsSuccess(response){
            // console.log("Eventos: ", response);
            var eventos = response.Eventos;
            angular.forEach(eventos, function(evento, key){
                evento = homeCtrl.adaptEvent(evento);
            });
            homeCtrl.events = eventos;

            //Pagination controls
            homeCtrl.viewby = 10;
            homeCtrl.totalItems = response.TotalEventos;
            homeCtrl.currentPage = 1;
            homeCtrl.itemsPerPage = homeCtrl.viewby;
            homeCtrl.maxSize = 5; //Number of pager buttons to show
            homeCtrl.numPages = parseInt(homeCtrl.totalItems / homeCtrl.itemsPerPage);

            // console.log("homeCtrl.totalItems ", homeCtrl.totalItems);
            // console.log("homeCtrl.itemsPerPage: ", homeCtrl.itemsPerPage);
            // console.log("homeCtrl.numPages: ", homeCtrl.numPages);

            //Completa o tamanho do array com objetos em vazios
            for(var i = homeCtrl.viewby - 1; i < homeCtrl.totalItems - 1; i++){
                homeCtrl.events.push({});
            }

            //Iteração do array de com a quantidade total de páginas
            for(var i = 1; i <= homeCtrl.numPages; i++){
                pageContentControl.push({loaded: false});
                // console.log("pageContentControl: ", pageContentControl);
            }

            $rootScope.dataLoading = false;
        }

        function getEventsError(error){
            $rootScope.dataLoading = false;

            AlertService.Add('danger', 'Não existe eventos disponíveis');
        }

        // Get Active Events

        function getActiveEventSuccess(response){
            // console.log("Evento aberto: ", response);
            if(response){
                homeCtrl.activeEvent = homeCtrl.adaptEvent(response);
                homeCtrl.disableButtons = true;
            }
            else{
                homeCtrl.disableButtons = false;
            }

            $rootScope.dataLoading = false;
        }

        function getActiveEventError(error){
        }

        homeCtrl.adaptEvent = function(evento){
            evento.inicio = evento.data.substr(11, 5);
            evento.data = (evento.data.substr(8, 2) + evento.data.substr(4, 4) + evento.data.substr(0, 4)).replace(/\-/g, "/");
            evento.codStatus = homeCtrl.replaceStatus(evento.codStatus);

            return evento;
        };

        homeCtrl.replaceStatus = function(letra){
            var response = "";
            switch (letra){
                case "A":
                    response = "ABERTO"
                    break;

                case "C":
                    response = "CRIADO"
                    break;

                case "E":
                    response = "EXECUTANDO"
                    break;

                case "F":
                    response = "FECHADO"
                    break;
            }
            return response;
        };

        homeCtrl.pageChanged = function() {
            $rootScope.dataLoading = true;

            var inicio = homeCtrl.itemsPerPage * (homeCtrl.currentPage - 1);
            if(pageContentControl[homeCtrl.currentPage - 1].loaded){
                $rootScope.dataLoading = false;
                // console.log("Dados já carregados!");
            }
            else{
                // $('.event').hide();
                EventService.getEvents(homeCtrl.currentPage - 1).then(function(response){
                    var eventos = response.Eventos;
                    angular.forEach(eventos, function(evento, key){
                        evento = homeCtrl.adaptEvent(evento);
                        homeCtrl.events[inicio + key] = evento;
                    });
                    pageContentControl[homeCtrl.currentPage - 1].loaded = true;

                    $rootScope.dataLoading = false;

                    // $('.event').show();
                });
            }
            console.log('Page changed to: ' + homeCtrl.currentPage);
        };

        homeCtrl.setPage = function (pageNo) {
            homeCtrl.currentPage = pageNo;
        };

        homeCtrl.setItemsPerPage = function(num) {
            homeCtrl.itemsPerPage = num;
            homeCtrl.currentPage = 1; //reset to first paghe
        }
    }
