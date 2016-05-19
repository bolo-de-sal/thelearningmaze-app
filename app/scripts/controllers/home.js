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

    HomeController.$inject = ['AuthenticationService', 'SessionService', 'EventService', '$rootScope', '$location'];

    function HomeController(AuthenticationService, SessionService, EventService, $rootScope, $location) {
        var homeCtrl = this;

        //homeCtrl.user = SessionService.getUser();
        $rootScope.user = SessionService.getUser();
        //homeCtrl.logout = logout;
        $rootScope.Logout = Logout;

        $("body").removeClass("bodyLogin");
        $(".header").show();

        $rootScope.dataLoading = true;

        //Array para controle de páginas já carregadas
        var pageContentControl = [{ loaded: true }];

        // Variável para desabilitar botões
        homeCtrl.disableButtons = true;

        function setFunctionButton(){
            $(".eventos").on("click", ".listButton", function(){                
                if($(this).hasClass("disabled")){
                    console.log("Evento: " + $(this).parent().siblings().first().html() + " !hasClass('enabled')");
                }
                else{
                    alert("Clique no botão do evento: " + $(this).parent().siblings().first().html());
                    console.log("Clique no botão do evento: ", $(this).parent().siblings().first().html());
                }
            });
        }

        EventService.getEvents(0, function(response){
            var eventos = response.Eventos;
            angular.forEach(eventos, function(evento, key){
                console.log(evento.data);
                evento.inicio = evento.data.substr(11, 5);
                evento.data = (evento.data.substr(8, 2) + evento.data.substr(4, 4) + evento.data.substr(0, 4)).replace(/\-/g, "/");
                evento.codStatus = homeCtrl.replaceStatus(evento.codStatus);
                console.log(evento);
            });
            homeCtrl.events = eventos;

            //Pagination controls
            homeCtrl.viewby = 10;
            homeCtrl.totalItems = response.TotalEventos;
            homeCtrl.currentPage = 1;
            homeCtrl.itemsPerPage = homeCtrl.viewby;
            homeCtrl.maxSize = 5; //Number of pager buttons to show
            homeCtrl.numPages = parseInt(homeCtrl.totalItems / homeCtrl.itemsPerPage);

            console.log("homeCtrl.totalItems ", homeCtrl.totalItems);
            console.log("homeCtrl.itemsPerPage: ", homeCtrl.itemsPerPage);
            console.log("homeCtrl.numPages: ", homeCtrl.numPages);

            //Completa o tamanho do array com objetos em vazios
            for(var i = homeCtrl.viewby - 1; i < homeCtrl.totalItems - 1; i++){
                homeCtrl.events.push({});
            }

            //Iteração do array de com a quantidade total de páginas
            for(var i = 1; i <= homeCtrl.numPages; i++){
                pageContentControl.push({loaded: false});
                console.log("pageContentControl: ", pageContentControl);
            }

            setFunctionButton();
            
            $rootScope.dataLoading = false;
        });

        // EventService.encerraEvento();

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
                console.log("Dados já carregados!");
                $rootScope.dataLoading = false;
            }
            else{
                // $('.eventos').hide();
                EventService.getEvents(homeCtrl.currentPage - 1, function(response){
                    var eventos = response.Eventos;
                    angular.forEach(eventos, function(evento, key){
                        console.log(evento.data);
                        evento.inicio = evento.data.substr(11, 5);
                        evento.data = (evento.data.substr(8, 2) + evento.data.substr(4, 4) + evento.data.substr(0, 4)).replace(/\-/g, "/");
                        if(evento.codEvento == 166){
                            evento.codStatus = "FECHADO";
                        }
                        else{
                            evento.codStatus = homeCtrl.replaceStatus(evento.codStatus);
                        }
                        console.log(evento);
                        homeCtrl.events[inicio + key] = evento;
                    });
                    pageContentControl[homeCtrl.currentPage - 1].loaded = true;

                    $rootScope.dataLoading = false;
                    // $('.eventos').show();
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

        function Logout(){
            AuthenticationService.Logout();
            $("body").addClass("bodyLogin");
            $(".header").hide();
        }
    }
