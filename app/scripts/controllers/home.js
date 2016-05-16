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

        EventService.getEvents(function(response){
            var eventos = response.Eventos;
            angular.forEach(eventos, function(evento, key){
                console.log(evento.data);
                evento.data = (evento.data.substr(8, 2) + evento.data.substr(4, 4) + evento.data.substr(0, 4)).replace(/\-/g, "/");
                console.log(evento);
            });
            homeCtrl.events = eventos;
            $rootScope.dataLoading = false;

            //Pagination controls
            homeCtrl.viewby = 10;
            homeCtrl.totalItems = homeCtrl.events.length;
            homeCtrl.currentPage = 1;
            homeCtrl.itemsPerPage = homeCtrl.viewby;
            homeCtrl.maxSize = 5; //Number of pager buttons to show
        });


        homeCtrl.setPage = function (pageNo) {
            homeCtrl.currentPage = pageNo;
        };

        homeCtrl.pageChanged = function() {
            console.log('Page changed to: ' + homeCtrl.currentPage);
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
