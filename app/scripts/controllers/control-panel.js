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

    ControlPanelController.$inject = ['$scope', '$routeParams', '$rootScope', '$q', '$timeout', '$uibModal', 'EventService', 'QuestionService', 'GroupService', 'QuestionDifficultyConfig'];

    function ControlPanelController($scope, $routeParams, $rootScope, $q, $timeout, $uibModal, EventService, QuestionService, GroupService, QuestionDifficultyConfig) {
        var controlPanelCtrl = this;

        $rootScope.dataLoading = true;

        var eventId = $routeParams.eventId;
        var addCountdownDelay = 5;

        controlPanelCtrl.questions = {};
        controlPanelCtrl.currentInitialized = false;

        $rootScope.selectedEvent = $routeParams.eventId;

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

        		modalInstance.result.then(function () {
        			$rootScope.dataLoading = true;
			    	controlPanelCtrl.loadControlPanel();
			    }, function () {
			    });
        	}
        }

        controlPanelCtrl.loadControlPanel = function(fn){
        	controlPanelCtrl.currentInitialized = false;        	

	        $q.all([
			   EventService.getEventById(eventId),
			   GroupService.getCurrentGroupInfo(eventId),
			   GroupService.getGroupsByEventId(eventId),
			   GroupService.getGroupsQuestions(eventId)
			]).then(function(response){
				controlPanelCtrl.event = response[0];
				controlPanelCtrl.questions.current = response[1];
				controlPanelCtrl.currentInitialized = true;
				controlPanelCtrl.groupsInfo = response[2];
				controlPanelCtrl.groupsQuestions = response[3];
			}).finally(function(){
				if(!controlPanelCtrl.questions.current.Questao){
					controlPanelCtrl.questions.current.Questao = {};
					controlPanelCtrl.questions.current.Questao.textoQuestao = 'Sem pergunta no momento';
					if(!controlPanelCtrl.questions.current.Questao.assunto){
						controlPanelCtrl.questions.current.Questao.assunto = controlPanelCtrl.questions.current.Grupo.assunto;
					}
				}else{
					console.log('Current Question Time From API', controlPanelCtrl.questions.current.Questao.tempo);
					console.log('Student Received Question', controlPanelCtrl.studentReceivedQuestion);
					var timer = document.getElementById('timer-question');

					if(controlPanelCtrl.questions.current.Questao.tempo > 0){
						if(controlPanelCtrl.studentReceivedQuestion){							
							controlPanelCtrl.countdown = controlPanelCtrl.questions.current.Questao.tempo

				          	$timeout(function(){
						        timer.start();
						    }, 0);

						    var timeoutSendQuestion = (controlPanelCtrl.questions.current.Questao.tempo + addCountdownDelay) * 1000;

						    $timeout(function(){
						    	controlPanelCtrl.sendAnsawer();
						    	console.log('Question ansawered from timeout', timeoutSendQuestion);
						    }, timeoutSendQuestion);							
						}else{
							console.log('Question no received');
							controlPanelCtrl.countdown = getTimerDifficultyQuestion();
							$timeout(function(){
						        timer.reset();
						    }, 0);
							console.log('Question no received', controlPanelCtrl.countdown);
						}
					}else{
						controlPanelCtrl.sendAnsawer();
					}
				}
				controlPanelCtrl.event.dataFormatada = new Date(controlPanelCtrl.event.data).getTime();
				controlPanelCtrl.questions.current.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + controlPanelCtrl.questions.current.Questao.codImagem;
				controlPanelCtrl.maxQtdQuestions = 0;
				angular.forEach(controlPanelCtrl.groupsQuestions, function(groupQuestion, key){
					if(groupQuestion.Questoes.length > controlPanelCtrl.maxQtdQuestions){
						controlPanelCtrl.maxQtdQuestions = groupQuestion.Questoes.length;
					}
				});

				$timeout(function(){
					document.getElementById('event-time').start();
				}, 100);				

				if(!$scope.$$phase) {
	          	  $scope.$apply();
	          	}

	          	if(fn){
	          		fn();
	          	}

				$rootScope.dataLoading = false;
			});
        }

        controlPanelCtrl.getMaxQtdQuestions = function(qtd){
        	return new Array(qtd);
        }

        controlPanelCtrl.closeEvent = function(){
        	$rootScope.dataLoading = true;
        	EventService.closeEvent(eventId).then(function(){
        		AlertService.Add('success', 'Evento encerrado com sucesso', true);
				$.connection.hub.start().done(function () {
		            $rootScope.evento.server.encerrarJogo(eventId);
		        })
		        .fail(function (reason) {
		            console.log("SignalR connection failed: " + reason);
		        });
        	}, function(error){
        		AlertService.Add('danger', error.data.message, true);
        	}).finally(function(){
        		$rootScope.dataLoading = false;
        	});
        }

        controlPanelCtrl.sendAnsawer = function (){
        	if(!controlPanelCtrl.studentQuestionAnswered){
	        	$rootScope.dataLoading = true;
	        	QuestionService.sendAnsawer(eventId, controlPanelCtrl.questions.current.Grupo.codGrupo, '', 0, false, '', true).then(function(response){
	        		$.connection.hub.start().done(function () {
	                    $rootScope.evento.server.responderPergunta(eventId, controlPanelCtrl.questions.current.Grupo.codGrupo, response.correta);
	                })
	                .fail(function (reason) {
	                    console.log("SignalR connection failed: " + reason);
	                });
	                controlPanelCtrl.loadControlPanel();
	                controlPanelCtrl.studentQuestionAnswered = false;
	        	}, function(error){
	        		controlPanelCtrl.loadControlPanel();
	        	});
        	}
        }

        function getTimerDifficultyQuestion(){
			var time = 0;
			switch(controlPanelCtrl.questions.current.Questao.dificuldade){
				case 'F':
			    	time = QuestionDifficultyConfig.difficulties.time.F;
			   		break;
			 	case 'M':
			   		time = QuestionDifficultyConfig.difficulties.time.M;
			   		break;
			  	default:
			  		time = QuestionDifficultyConfig.difficulties.time.D;
			  		break;
			}
			console.log('getTimerDifficultyQuestion');

			return time;
		}

        $rootScope.evento.client.ativarTimer = function (time) {
			console.log("## TIMER ATIVADO ##");
			controlPanelCtrl.studentReceivedQuestion = true;

			var timer = document.getElementById('timer-question');

			controlPanelCtrl.countdown = time;

			if(!$scope.$$phase){
          		$scope.$apply();
          	}

          	$timeout(function(){
		        timer.start();
		    }, 0);

			time = (time + addCountdownDelay) * 1000;

		    $timeout(function(){
		        controlPanelCtrl.sendAnsawer();
		    }, time);

		    console.log("## EXECUTOU TIMER ATIVADO ##");
        }

        $rootScope.evento.client.responderPergunta = function (ok, isChampion, groupIdChampion, qtdQuestionsOk) {
	        console.log("## PERGUNTA RESPONDIDA ##");
	        document.getElementById('timer-question').stop();
            $rootScope.dataLoading = true;
            controlPanelCtrl.studentQuestionAnswered = true;
            controlPanelCtrl.studentReceivedQuestion = false;
            $scope.$apply();
            controlPanelCtrl.loadControlPanel(function(){
            	$timeout(function() {
	            	controlPanelCtrl.countdown = 0;
	            	$scope.$apply();
	            	document.getElementById('timer-question').reset();
			        // document.getElementById('timer-question').stop();
			        console.log('timer stoped');
				});
            });
        }

    	$.connection.hub.start().done(function () {
			console.log("Professor entrou no grupo do evento: " + eventId);
			$rootScope.evento.server.joinEventoProfessor(eventId);
		})
		.fail(function (reason) {
			console.log("SignalR connection failed: " + reason);
		});              

        controlPanelCtrl.loadControlPanel();
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

    QuestionsModalController.$inject = ['$timeout', '$routeParams', '$rootScope', '$q', '$uibModalInstance', 'AlertService', 'QuestionService', 'ThemeService', 'GroupService'];

    function QuestionsModalController($timeout, $routeParams, $rootScope, $q, $uibModalInstance, AlertService, QuestionService, ThemeService, GroupService){
    	var questionsModalCtrl = this;

    	$rootScope.dataLoading = true;

    	var eventId = $routeParams.eventId;

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
			var i = $.inArray(theme, questionsModalCtrl.themeIncludes);
	        if (i > -1){
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

				QuestionService.sendQuestion(eventId, selectedQuestionId).then(function(response){
					AlertService.Add('success', 'Pergunta lançada com sucesso.');
					$.connection.hub.start().done(function () {
			            $rootScope.evento.server.lancarPergunta(eventId, selectedQuestionId);
			        })
			        .fail(function (reason) {
			            console.log("SignalR connection failed: " + reason);
			        });
				}, function(error){
					AlertService.Add('danger', 'Ops! Não foi possível lançar a questão: ' + error.data.message + '.');
				}).finally(function(){
					angular.forEach(questionsModalCtrl.questionsItems, function(value, key){
						if(questionsModalCtrl.questionsItems[key].Questao.codQuestao === questionId){
							questionsModalCtrl.questionsItems.slice(key, 1);
						}
					});

					$rootScope.dataLoading = false;
					questionsModalCtrl.close();
				});
			}else{
				AlertService.Add('danger', 'Nenhuma questão disponível para o assunto e nível do grupo atual.', true);
			}

		}

    	questionsModalCtrl.close = function(){
    		$uibModalInstance.close();
    	}

    	questionsModalCtrl.cancel = function(){
    		$uibModalInstance.dismiss();
    	}    	

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
			var found = false;
			angular.forEach(questionsModalCtrl.questionsItems, function(value, key){
				value.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + value.Questao.codImagem;
				if(!found && value.Questao.dificuldade == questionsModalCtrl.currentGroupInfo.Grupo.questao.dificuldade && value.Assunto.codAssunto == questionsModalCtrl.currentGroupInfo.Grupo.assunto.codAssunto){
					found = true;
					questionsModalCtrl.questionsEnabled = true;
				}
			});

			questionsModalCtrl.selectionDifficulties.push(questionsModalCtrl.currentGroupInfo.Grupo.questao.dificuldade);
			questionsModalCtrl.difficultyIncludes.push(questionsModalCtrl.currentGroupInfo.Grupo.questao.dificuldade);

			questionsModalCtrl.selectionThemes.push(questionsModalCtrl.currentGroupInfo.Grupo.assunto.descricao);
			questionsModalCtrl.themeIncludes.push(questionsModalCtrl.currentGroupInfo.Grupo.assunto.descricao);

			questionsModalCtrl.filtersLoaded = true;
			$rootScope.dataLoading = false;
		});
    }
