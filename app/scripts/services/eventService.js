'use strict';

angular
    .module('thelearningmaze')
    .factory('EventService', EventService);

    EventService.$inject = ['$http', 'AppConfig'];

    function EventService($http, AppConfig) {
        var events = {};

        events.getEvents = getEvents;

        return events;

        function getEvents(callback) {

            $http.get(AppConfig.api.identifier + '/Eventos/Paged/0/100')
            .success(function (response) {
              callback(response);
            });
        }

    }
