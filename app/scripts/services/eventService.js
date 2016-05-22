'use strict';

angular
    .module('thelearningmaze')
    .factory('EventService', EventService);

    EventService.$inject = ['$http', 'AppConfig'];

    function EventService($http, AppConfig) {
        var events = {};

        events.getEvents = getEvents;
        events.getActiveEvent = getActiveEvent;
        events.encerraEvento = encerraEvento;

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

        function encerraEvento() {
            $http.post(AppConfig.api.identifier + '/Eventos/Encerrar', { "codEvento": 166 } )
            .success(function (response) {
                console.log("Response: ", response);
              // callback(response);
            });            
        }


    }
