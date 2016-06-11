'use strict';

angular
    .module('thelearningmaze')
    .factory('ThemeService', ThemeService);

    ThemeService.$inject = ['$http', 'AppConfig'];

    function ThemeService($http, AppConfig) {
        var themes = {};

        themes.getThemesByEvent = getThemesByEvent;

        return themes;

        function getThemesByEvent(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/Assuntos')
            .then(function(response){
                return response.data;
            });

            return promise;
        }
    }
