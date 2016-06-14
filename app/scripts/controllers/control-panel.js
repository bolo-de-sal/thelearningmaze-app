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

    QuestionsModalController.$inject = ['$routeParams', '$rootScope', '$q', '$uibModalInstance', 'AlertService', 'QuestionService', 'ThemeService', 'GroupService'];

    function QuestionsModalController($routeParams, $rootScope, $q, $uibModalInstance, AlertService, QuestionService, ThemeService, GroupService){
    	var questionsModalCtrl = this;    	

    	$rootScope.dataLoading = true;

    	var eventId = $routeParams.eventId;

    	$q.all([
		   GroupService.getCurrentGroupInfo(eventId),
		   QuestionService.getQuestionsByEvent(eventId),
		   ThemeService.getThemesByEvent(eventId)
		]).then(function(response){
			questionsModalCtrl.currentGroupInfo = response[0];
			questionsModalCtrl.questionsItems = response[1];
			questionsModalCtrl.themes = response[2];
			questionsModalCtrl.difficultiesItems = [
				{
					descricao: 'Fácil',
					dificuldade: 'F'	
				},
				{
					descricao: 'Médio',
					dificuldade: 'M'	
				},
				{
					descricao: 'Difícil',
					dificuldade: 'D'	
				}
			];
		}).finally(function(){
			angular.forEach(questionsModalCtrl.questionsItems, function(value, key){
				value.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + value.Questao.codImagem
			});

			questionsModalCtrl.difficultyIncludes.push(questionsModalCtrl.currentGroupInfo.Grupo.questao.dificuldade);

			questionsModalCtrl.themeIncludes.push(questionsModalCtrl.currentGroupInfo.Grupo.assunto.descricao);

			questionsModalCtrl.questionsEnabled = !($('.radio input[type=radio]:enabled').length > 0);

			questionsModalCtrl.filtersLoaded = true;
			$rootScope.dataLoading = false;
		});		

		questionsModalCtrl.difficultyIncludes = [];

		questionsModalCtrl.includeDifficulty = function(difficulty){
			if(difficulty != questionsModalCtrl.currentGroupInfo.Grupo.questao.dificuldade){
				var i = $.inArray(difficulty, questionsModalCtrl.difficultyIncludes);
		        if (i > -1) {
		            questionsModalCtrl.difficultyIncludes.splice(i, 1);
		        } else {
		            questionsModalCtrl.difficultyIncludes.push(difficulty);
		        }
			}else{
				AlertService.Add('danger', 'A questão e dificuldade do grupo atual deve estar sempre selecionada.');
			}		
		}

		questionsModalCtrl.difficultyFilter = function(questionItem){
			if(questionsModalCtrl.difficultyIncludes.length > 0 && $.inArray(questionItem.Questao.dificuldade, questionsModalCtrl.difficultyIncludes) < 0){
				return;
			}

			return questionItem;
		}

		questionsModalCtrl.selectionDifficulties = [];

		questionsModalCtrl.toggleSelectionDifficulty = function(difficulty) {
			var idx = questionsModalCtrl.selectionDifficulties.indexOf(difficulty);

			// is currently selected
			if (idx > -1){
			  questionsModalCtrl.selectionDifficulties.splice(idx, 1);
			}else{
			  questionsModalCtrl.selectionDifficulties.push(difficulty);
			}
		};

		questionsModalCtrl.themeIncludes = [];

		questionsModalCtrl.includeTheme = function(theme){
			if(theme != questionsModalCtrl.currentGroupInfo.Grupo.assunto.descricao)
			{
				var i = $.inArray(theme, questionsModalCtrl.themeIncludes);
		        if (i > -1){
		            questionsModalCtrl.themeIncludes.splice(i, 1);
		        } else {
		            questionsModalCtrl.themeIncludes.push(theme);
		        }
			}else{
				AlertService.Add('danger', 'A questão e dificuldade do grupo atual deve estar sempre selecionada.');
			}			
		}

		questionsModalCtrl.themeFilter = function(questionItem){
			if(questionsModalCtrl.themeIncludes.length > 0 && $.inArray(questionItem.Assunto.descricao, questionsModalCtrl.themeIncludes) < 0){
				return;
			}

			return questionItem;
		}

		questionsModalCtrl.selectionThemes = [];

		questionsModalCtrl.toggleSelectionTheme = function(theme) {
			var idx = questionsModalCtrl.selectionThemes.indexOf(theme);

			// is currently selected
			if (idx > -1){
			  questionsModalCtrl.selectionThemes.splice(idx, 1);
			}else{
			  questionsModalCtrl.selectionThemes.push(theme);
			}
		};

		questionsModalCtrl.sendQuestion = function(questionId){
			var selectedQuestionId = questionId;
			var questionsEnabled = $('.radio input[type=radio]:enabled');

			if(questionsEnabled.length > 0){
				$rootScope.dataLoading = true;

				if(!selectedQuestionId){				
					var random = Math.floor((Math.random() * questionsEnabled.length));
					var questionRandom = questionsEnabled.eq(random);
					var questionIdRandom = questionRandom.val();

					angular.forEach(questionsModalCtrl.questionsItems, function(questionItem, key){
						if(questionItem.Questao.codQuestao == questionIdRandom){
							selectedQuestionId = questionItem.Questao.codQuestao
						}
					});
					questionRandom.prop('checked', true);
				}

				QuestionService.sendQuestion(selectedQuestionId).then(function(response){
					AlertService.Add('success', 'Pergunta lançada com sucesso.');
				}, function(error){
					console.log(error);
					AlertService.Add('danger', 'Ops! Não foi possível lançar a questão: ' + error.data.message + '.');
				}).finally(function(){
					angular.forEach(questionsModalCtrl.questionsItems, function(value, key){
						if(questionsModalCtrl.questionsItems[key].Questao.codQuestao === questionId){
							questionsModalCtrl.questionsItems.slice(key, 1);
						}
					});

					$rootScope.dataLoading = false;
				});

				questionsModalCtrl.close();
			}else{
				AlertService.Clear();
				AlertService.Add('danger', 'Nenhuma questão disponível para o assunto e nível do grupo atual.');
			}

		}

    	questionsModalCtrl.close = function(){
    		$uibModalInstance.dismiss();
    	}
    }
