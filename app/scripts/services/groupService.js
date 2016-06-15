'use strict';

angular
    .module('thelearningmaze')
    .factory('GroupService', GroupService);

    GroupService.$inject = ['$http', '$rootScope', 'AppConfig'];

    function GroupService($http, $rootScope, AppConfig) {
        var groups = {};

        groups.getGroupsByEventId = getGroupsByEventId;
        groups.getCurrentGroupInfo = getCurrentGroupInfo;
        groups.getGroupsQuestions = getGroupsQuestions;

        return groups;

        function getGroupsByEventId(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/GruposCompleto')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function getCurrentGroupInfo(eventId){
            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/InfoGrupoAtual')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function getGroupsQuestions(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/GruposQuestoes')
            .then(function(response){
                return response.data;
            });

            return promise;
        }
    }
