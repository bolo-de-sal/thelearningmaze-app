'use strict';

angular
    .module('thelearningmaze')
    .factory('EventService', EventService);

    EventService.$inject = ['$http', '$rootScope', 'AppConfig'];

    function EventService($http, $rootScope, AppConfig) {
        var events = {};

        events.getEvents = getEvents;
        events.getActiveEvent = getActiveEvent;
        events.encerraEvento = encerraEvento;

        return events;

        function getEvents(page) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/Paged/' + page + '/10')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function getActiveEvent() {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/Ativo')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function encerraEvento() {
            $http.post(AppConfig.api.identifier + '/Eventos/Encerrar', { "codEvento": 166 } )
            .success(function (response) {
                console.log("Response: ", response);
              // callback(response);
            });            
        }


    }
