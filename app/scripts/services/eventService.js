'use strict';

angular
    .module('thelearningmaze')
    .factory('EventService', EventService);

    EventService.$inject = ['$http', '$rootScope', 'AppConfig'];

    function EventService($http, $rootScope, AppConfig) {
        var events = {};

        events.getEventById = getEventById;
        events.getEventByGroupIdAndMemberGroupId = getEventByGroupIdAndMemberGroupId;
        events.getEvents = getEvents;
        events.getActiveEvent = getActiveEvent;
        events.closeEvent = closeEvent;
        events.initEvent = initEvent;
        events.getEventGroups = getEventGroups;
        events.getEventThemes = getEventThemes;
        events.getEventCurrentGroupInfo = getEventCurrentGroupInfo;

        return events;

        function getEventById(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId)
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function getEventByGroupIdAndMemberGroupId(groupId, memberGroupId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + groupId + '/' + memberGroupId)
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

        function initEvent(eventId){
            var promise = $http.post(AppConfig.api.identifier + '/Eventos/Iniciar', {'codEvento': eventId } )
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;
        }

        function closeEvent(eventId) {
            var promise = $http.post(AppConfig.api.identifier + '/Eventos/Encerrar', {'codEvento': eventId })
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;           
        }

        function getEventGroups(eventId){
            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/GruposCompleto')
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;
        }

        function getEventThemes(codEvento){
            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + codEvento + '/Assuntos')
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;
        }

        function getEventCurrentGroupInfo(codEvento){
            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + codEvento + '/InfoGrupoAtual')
            .then(function (response) {
                return response.data;
              // callback(response);
            });

            return promise;
        }


    }
