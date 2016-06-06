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

        $rootScope.dataLoading = true;

        var eventId = $routeParams.eventId;

        // All requests
        $q.all([
		   EventService.getEventById(eventId),
		   // QuestionService.getCurrentQuestionByEventId(eventId),
		   GroupService.getGroupsByEventId(eventId)
		]).then(function(response){
			console.log(response);
			controlPanelCtrl.event = response[0];
			// controlPanelCtrl.questions.current = response[1];
			// controlPanelCtrl.groups = response[2];
			controlPanelCtrl.groupsInfo = response[1];
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

    QuestionsModalController.$inject = ['$uibModalInstance', 'EventService'];

    function QuestionsModalController($uibModalInstance, EventService){
    	var questionsModalCtrl = this;

    	// questionsModalCtrl.questions = EventService.getEvents(1).then(function(response){return response.Eventos;}, function(){});

    	questionsModalCtrl.questions = [
												{
													"codQuestao": 1,
													"textoQuestao": "sample string 2",
													"codAssunto": 3,
													"codImagem": 4,
													"codTipoQuestao": "sample string 5",
													"codProfessor": 6,
													"ativo": true,
													"dificuldade": "F"
												},
												{
													"codQuestao": 2,
													"textoQuestao": "sample string 2",
													"codAssunto": 3,
													"codImagem": 4,
													"codTipoQuestao": "sample string 5",
													"codProfessor": 6,
													"ativo": true,
													"dificuldade": "M"
											  }
											];


		questionsModalCtrl.difficultyIncludes = [];

		questionsModalCtrl.includeDifficulty = function(difficulty){
			var i = $.inArray(difficulty, questionsModalCtrl.difficultyIncludes);
	        if (i > -1) {
	            questionsModalCtrl.difficultyIncludes.splice(i, 1);
	        } else {
	            questionsModalCtrl.difficultyIncludes.push(difficulty);
	        }
		}

		questionsModalCtrl.difficultyFilter = function(question){
			if(questionsModalCtrl.difficultyIncludes.length > 0 && $.inArray(question.dificuldade, questionsModalCtrl.difficultyIncludes) < 0){
				return;
			}

			return question;
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

		questionsModalCtrl.themeFilter = function(question){
			if(questionsModalCtrl.themeIncludes.length > 0 && $.inArray(question.assunto, questionsModalCtrl.themeIncludes) < 0){
				return;
			}

			return question;
		}

		questionsModalCtrl.sendQuestion = function(question){
			console.log(question);
		}

    	questionsModalCtrl.close = function(){
    		$uibModalInstance.dismiss();
    	}
    }
