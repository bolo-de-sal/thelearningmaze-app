'use strict';

angular
    .module('thelearningmaze')
    .factory('eventService', eventService);

    AuthenticationService.$inject = ['$http', '$rootScope', '$timeout', '$location', 'AppConfig', 'GlobalMessageService'];

    function eventService($http, $rootScope, $timeout, $location, AppConfig, GlobalMessageService) {
        var events = {};

        events.getEvents = getEvents;

        return events;

        function getEvents(callback) {

            $http.get(AppConfig.api.identifier + '/Eventoes')
            .success(function (response) {
              callback(response);
            });
        }

    }
