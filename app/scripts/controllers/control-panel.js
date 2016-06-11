'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:ControlPanelController
 * @description
 * # ControlPanelController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('ControlPanelController', ControlPanelController);

    ControlPanelController.$inject = ['$routeParams', '$rootScope', '$q', '$uibModal', 'EventService', 'QuestionService', 'GroupService'];

    function ControlPanelController($routeParams, $rootScope, $q, $uibModal, EventService, QuestionService, GroupService) {
    	$("body").removeClass("bodyLogin");
        $(".header").show();

        var controlPanelCtrl = this;
        controlPanelCtrl.questions = {};

        $rootScope.dataLoading = true;

        var eventId = $routeParams.eventId;

        // All requests
        $q.all([
		   EventService.getEventById(eventId),
		   QuestionService.getCurrentQuestionByEventId(eventId),
		   GroupService.getGroupsByEventId(eventId)
		]).then(function(response){
			console.log(response);
			controlPanelCtrl.event = response[0];
			controlPanelCtrl.questions.current = response[1];
			controlPanelCtrl.groupsInfo = response[2];
		}).finally(function(){
			// Close dataLoading after all requests are finished
			$rootScope.dataLoading = false;
		});

        controlPanelCtrl.closeOthers = false;

        // Config questions modal
        controlPanelCtrl.questionsModal = {
        	animationsEnabled: true,
        	open: function(size){
        		var modalInstance = $uibModal.open({
        		  animation: controlPanelCtrl.questionsModal.animationsEnabled,
        		  templateUrl: 'questions-modal.html',
        		  controller: 'QuestionsModalController',
        		  controllerAs: 'questionsModal',
        		  size: size
        		});
        	}
        }
    }

/**
 * @ngdoc function
 * @name thelearningmaze.controller:QuestionsModalController
 * @description
 * # QuestionsModalController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('QuestionsModalController', QuestionsModalController);

    QuestionsModalController.$inject = ['$routeParams', '$rootScope', '$q', '$uibModalInstance', 'QuestionService', 'ThemeService'];

    function QuestionsModalController($routeParams, $rootScope, $q, $uibModalInstance, QuestionService, ThemeService){
    	var questionsModalCtrl = this;

    	$rootScope.dataLoading = true;

    	var eventId = $routeParams.eventId;

    	$q.all([
		   QuestionService.getQuestionsByEvent(eventId)
		   // ThemeService.getThemesByEvent(eventId)
		]).then(function(response){
			questionsModalCtrl.questionsItems = response[0];
			// questionsModalCtrl.themes = response[1];
		}).finally(function(){
			$rootScope.dataLoading = false;
		});	

		questionsModalCtrl.difficultyIncludes = [];

		questionsModalCtrl.includeDifficulty = function(difficulty){
			var i = $.inArray(difficulty, questionsModalCtrl.difficultyIncludes);
	        if (i > -1) {
	            questionsModalCtrl.difficultyIncludes.splice(i, 1);
	        } else {
	            questionsModalCtrl.difficultyIncludes.push(difficulty);
	        }
		}

		questionsModalCtrl.difficultyFilter = function(questionItem){
			if(questionsModalCtrl.difficultyIncludes.length > 0 && $.inArray(questionItem.Questao.dificuldade, questionsModalCtrl.difficultyIncludes) < 0){
				return;
			}

			return questionItem;
		}

		questionsModalCtrl.themeIncludes = [];

		questionsModalCtrl.includeTheme = function(theme){
			var i = $.inArray(theme, questionsModalCtrl.themeIncludes);
	        if (i > -1) {
	            questionsModalCtrl.themeIncludes.splice(i, 1);
	        } else {
	            questionsModalCtrl.themeIncludes.push(theme);
	        }
		}

		questionsModalCtrl.themeFilter = function(questionItem){
			if(questionsModalCtrl.themeIncludes.length > 0 && $.inArray(questionItem.Assunto.descricao, questionsModalCtrl.themeIncludes) < 0){
				return;
			}

			return questionItem;
		}

		questionsModalCtrl.themes = 
		[
			{
				codAssunto: 1,
				descricao: 'Logica'
			},
			{
				codAssunto: 2,
				descricao: 'Teste'
			}
		];

		questionsModalCtrl.selectionThemes = [];

		questionsModalCtrl.toggleSelectionTheme = function(theme) {
			var idx = questionsModalCtrl.selectionThemes.indexOf(theme);

			// is currently selected
			if (idx > -1) {
			  questionsModalCtrl.selectionThemes.splice(idx, 1);
			}
			else {
			  questionsModalCtrl.selectionThemes.push(theme);
			}
		};

		questionsModalCtrl.sendQuestion = function(question){
			console.log(question);
		}

    	questionsModalCtrl.close = function(){
    		$uibModalInstance.dismiss();
    	}
    }
