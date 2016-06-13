'use strict';

angular
    .module('thelearningmaze')
    .factory('EventService', EventService);

    EventService.$inject = ['$http', '$rootScope', 'AppConfig'];

    function EventService($http, $rootScope, AppConfig) {
        var events = {};

        events.getEventById = getEventById;
        events.getEvents = getEvents;
        events.getActiveEvent = getActiveEvent;
        events.closeEvent = closeEvent;
        events.openEvent = openEvent;
        events.getEventGroups = getEventGroups;
        events.getEventSubjects = getEventSubjects;

        return events;

        function getEventById(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId)
            .then(function(response){
                return response.data;
            });

            return promise;
        }

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

        function getEventGroups(codEvento){
            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + codEvento + '/GruposCompleto')
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;
        }

        function getEventSubjects(codEvento){
            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + codEvento + '/Assuntos')
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;
        }


    }
