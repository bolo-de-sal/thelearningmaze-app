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

    HomeController.$inject = ['$q', 'AuthenticationService', 'SessionService', 'EventService', '$rootScope', '$location', 'AlertService'];

    function HomeController($q, AuthenticationService, SessionService, EventService, $rootScope, $location, AlertService) {
        var homeCtrl = this;

        $rootScope.dataLoading = true;

        //Array para controle de páginas já carregadas
        var pageContentControl = [{ loaded: true }];

        // Variável para desabilitar botões
        homeCtrl.disableButtons;

        // All requests
        $q.all([
            EventService.getEvents(0).then(getEventsSuccess, getEventsError),
            EventService.getActiveEvent().then(getActiveEventSuccess, getActiveEventError)
        ]).then(function(response){
        }).finally(function(){
            // Close dataLoading after all requests are finished
            $rootScope.dataLoading = false;
        });



        // Get Events
        function getEventsSuccess(response){
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


            //Completa o tamanho do array com objetos em vazios
            for(var i = homeCtrl.viewby - 1; i < homeCtrl.totalItems - 1; i++){
                homeCtrl.events.push({});
            }

            //Iteração do array de com a quantidade total de páginas
            for(var i = 1; i <= homeCtrl.numPages; i++){
                pageContentControl.push({loaded: false});
            }
        }

        function getEventsError(error){
            $rootScope.dataLoading = false;
            if(error.status != 500 && error.status != 401){
                AlertService.Add('danger', 'Não existe eventos disponíveis');
            }
        }

        // Get Active Events
        function getActiveEventSuccess(response){
            if(response){
                homeCtrl.activeEvent = homeCtrl.adaptEvent(response);
                homeCtrl.disableButtons = true;
            }
            else{
                homeCtrl.disableButtons = false;
            }
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
            }
            else{
                EventService.getEvents(homeCtrl.currentPage - 1).then(function(response){
                    var eventos = response.Eventos;
                    angular.forEach(eventos, function(evento, key){
                        evento = homeCtrl.adaptEvent(evento);
                        homeCtrl.events[inicio + key] = evento;
                    });
                    pageContentControl[homeCtrl.currentPage - 1].loaded = true;

                    $rootScope.dataLoading = false;
                });
            }
            console.log('Page changed to: ' + homeCtrl.currentPage);
        };

        homeCtrl.checkBtn = function(event){
            if(angular.element(event.currentTarget).hasClass('disabled')){
                AlertService.Add('danger', 'Não é possível ter mais de um evento ativo', true);
            }
        }

        homeCtrl.setPage = function (pageNo) {
            homeCtrl.currentPage = pageNo;
        };

        homeCtrl.setItemsPerPage = function(num) {
            homeCtrl.itemsPerPage = num;
            homeCtrl.currentPage = 1; //reset to first paghe
        }

        homeCtrl.startEvent = function(){
            $location.path("/lobby/" + homeCtrl.activeEvent.codEvento);
        }

        homeCtrl.openEvent = function(eventId){
            if(angular.element(event.currentTarget).hasClass('disabled')){
                return;
            }
            $rootScope.dataLoading = true;
            EventService.openEvent(eventId).then(function(){
                $q.all([
                    EventService.getEvents(0).then(getEventsSuccess, getEventsError),
                    EventService.getActiveEvent().then(getActiveEventSuccess, getActiveEventError)
                ]).then(function(response){
                }).finally(function(){
                    // Close dataLoading after all requests are finished
                    $rootScope.dataLoading = false;
                });
            }, function(error){
                AlertService.Add('danger', error.data.message, true);
                $rootScope.dataLoading = false;
            });


        }
    }
