'use strict';

angular
    .module('thelearningmaze')
    .factory('QuestionService', QuestionService);

    QuestionService.$inject = ['$http', 'AppConfig'];

    function QuestionService($http, AppConfig){
        var questions = {};

        questions.getQuestionsByEvent = getQuestionsByEvent;
        questions.getCurrentQuestionByEventId = getCurrentQuestionByEventId;
        questions.sendQuestion = sendQuestion;
        questions.sendAnsawer = sendAnsawer;

        return questions;

        function getQuestionsByEvent(eventId){

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/Questoes')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function getCurrentQuestionByEventId(eventId){

            var promise = $http.get(AppConfig.api.identifier + '/Eventos/' + eventId + '/QuestaoAtual')
            .then(function(response){
                return response.data;
            });

            return promise;
        }

        function sendQuestion(eventId, questionId){
            var promisse = $http.post(AppConfig.api.identifier + '/Eventos/LancarPergunta', {codEvento: eventId, codQuestao: questionId})
            .then(function(response){
                return response.data;
            });

            return promisse;
        }

        function sendAnsawer(eventId, groupId, questionType, alternative, isTrue, text, questionTimerFinished){
            var promisse = $http.post(AppConfig.api.identifier + '/Eventos/ResponderPergunta', {codEvento: eventId, codGrupo: groupId, tipoQuestao: questionType, alternativa: alternative, verdadeiro: isTrue, texto: text, tempoExpirou: questionTimerFinished})
            .then(function(response){
                return response.data;
            });

            return promisse;
        }

    }
