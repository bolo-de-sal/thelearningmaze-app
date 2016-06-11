'use strict';

angular
    .module('thelearningmaze')
    .factory('GroupService', GroupService);

    GroupService.$inject = ['$http', '$rootScope', 'AppConfig'];

    function GroupService($http, $rootScope, AppConfig) {
        var groups = {};

        groups.getGroupsByEventId = getGroupsByEventId;

        return groups;

        function getGroupsByEventId(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/GruposCompleto')
            .then(function(response){
                return response.data;
            });

            return promise;
        }
    }
