'use strict';

angular
    .module('thelearningmaze')
    .factory('QuestionService', QuestionService);

    QuestionService.$inject = ['$http', 'AppConfig'];

    function QuestionService($http, AppConfig) {
        var questions = {};

        questions.getQuestionsByEvent = getQuestionsByEvent;
        questions.getCurrentQuestionByEventId = getCurrentQuestionByEventId;

        return questions;

        function getQuestionsByEvent(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Questaos/' + eventId)
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function getCurrentQuestionByEventId(eventId) {

            var promise = $http.get(AppConfig.api.identifier + '/Questaos/' + eventId + '/QuestaoAtual')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

    }
