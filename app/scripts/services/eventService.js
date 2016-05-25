'use strict';

angular
    .module('thelearningmaze')
    .factory('EventService', EventService);

    EventService.$inject = ['$http', 'AppConfig'];

    function EventService($http, AppConfig) {
        var events = {};

        events.getEvents = getEvents;
        events.getActiveEvent = getActiveEvent;
        events.closeEvent = closeEvent;
        events.openEvent = openEvent;
        events.getEventGroups = getEventGroups;

        return events;

        function getEvents(page, callback) {

            $http.get(AppConfig.api.identifier + '/Eventos/Paged/' + page + '/10')
            .success(function (response) {
              callback(response);
            });
        }

        function getActiveEvent(callback) {

            $http.get(AppConfig.api.identifier + '/Eventos/Ativo')
            .success(function (response) {
              callback(response);
            });
        }

        function openEvent(){
            $http.post(AppConfig.api.identifier + '/Eventos/Iniciar', { "codEvento": 114 } )
            .success(function (response) {
                console.log("Response: ", response);
              // callback(response);
            }); 
        }

        function closeEvent() {
            $http.post(AppConfig.api.identifier + '/Eventos/Encerrar', { "codEvento": 75 } )
            .success(function (response) {
                console.log("Response: ", response);
              // callback(response);
            });            
        }

        function getEventGroups(codEvento, callback){
            $http.get(AppConfig.api.identifier + '/Eventos/' + codEvento + '/GruposCompleto')
            .success(function (response) {
              callback(response);
            });
        }


    }
