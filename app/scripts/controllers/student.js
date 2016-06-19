'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:StudentController
 * @description
 * # StudentController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('StudentController', StudentController);

    StudentController.$inject = ['$scope', '$rootScope', '$location', '$timeout', '$q', 'GroupService', 'EventService', 'QuestionService', 'QuestionDifficultyConfig', 'AlertService', '$localStorage', '$base64'];

    function StudentController($scope, $rootScope, $location, $timeout, $q, GroupService, EventService, QuestionService, QuestionDifficultyConfig, AlertService, $localStorage, $base64) {
        var studentCtrl = this;
        var groupIdDecoded = $localStorage.groupId ? $base64.decode($localStorage.groupId) : 0;
        var otherGroup = groupIdDecoded != $location.search().codGrupo;

        if(!$localStorage.memberGroupId || otherGroup){
        	var groupId = parseInt($location.search().codGrupo);
        	var memberId = parseInt($location.search().codParticipante);
	        $localStorage.groupId = $base64.encode(groupId);
	        $localStorage.memberGroupId = 'lm' + $base64.encode(memberId);
        }

        studentCtrl.groupId = $base64.decode($localStorage.groupId);
        studentCtrl.memberGroupId = $base64.decode($localStorage.memberGroupId.substring(2));

        studentCtrl.currentInitialized = false;

        $rootScope.dataLoading = true;

        $q.all([
		   EventService.getEventByGroupIdAndMemberGroupId(studentCtrl.groupId, studentCtrl.memberGroupId),
		   GroupService.getGroupById(studentCtrl.groupId)
		   
		]).then(function(response){
			studentCtrl.event = response[0];
			studentCtrl.Group = response[1];
		}, function(error){
			$rootScope.dataLoading = false;
			AlertService.Add('danger', error.data.message, true);
		}).finally(function(){
			$q.all([
			   GroupService.getCurrentGroupInfo(studentCtrl.Group.codEvento),
			   GroupService.getGroupsByEventId(studentCtrl.Group.codEvento)				   
			]).then(function(response){
				studentCtrl.current = response[0];
				studentCtrl.currentInitialized = true;
				if(!studentCtrl.current.Grupo){
					studentCtrl.current.Grupo = studentCtrl.Group;
				}
				studentCtrl.groupsInfo = response[1];
			}, function(error){
				$rootScope.dataLoading = false;
			}).finally(function(){
				updateCurrentStudentInfo(studentCtrl.current);

				$rootScope.dataLoading = false;
			});
		});

		studentCtrl.sendSelectedAnsawer = function(ansawerText, ansawerAlternative, ansawerIsTrue, questionTimerFinished){
			$rootScope.dataLoading = true;
			document.getElementById('timer-question').stop();
			QuestionService.sendAnsawer(studentCtrl.Group.codEvento, studentCtrl.current.Questao.codGrupo, studentCtrl.current.Questao.codTipoQuestao, ansawerAlternative, ansawerIsTrue, ansawerText, questionTimerFinished).then(function(response){
				if(response.correta){
					AlertService.Add('success', 'Resposta correta', true);
				}else{
					AlertService.Add('danger', 'Resposta errada', true);
				}
				$.connection.hub.start().done(function () {
		            $rootScope.evento.server.responderPergunta(studentCtrl.Group.codEvento, studentCtrl.current.Grupo.codGrupo, response.correta);
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

		studentCtrl.timerFinished = function(){
			console.log('Questao enviada de forma automática');
			// this.sendSelectedAnsawer('', 0, false, true);
		}

		function updateStudentInfo(fn){
			$rootScope.dataLoading = true;
			$q.all([
			   GroupService.getCurrentGroupInfo(studentCtrl.Group.codEvento),
			   EventService.getEventByGroupIdAndMemberGroupId(studentCtrl.groupId, studentCtrl.memberGroupId)
			]).then(function(response){
				updateCurrentStudentInfo(response[0]);
				studentCtrl.event = response[1];
			}, function(error){
				AlertService.Add('danger', error.data.message, true);
			}).finally(function(){
				fn();
				$rootScope.dataLoading = false;
			});
		}

		function updateCurrentStudentInfo(response){
			studentCtrl.current = response;

			if(studentCtrl.event.codStatus == "E" && !studentCtrl.current.Questao){
				studentCtrl.gameStarted = true;
			}else if(studentCtrl.event.codStatus == "E" && studentCtrl.current && studentCtrl.current.Questao){
				studentCtrl.gameStarted = false;
				studentCtrl.receivedQuestion = true;
			}else if(studentCtrl.event.codStatus == "F"){
				studentCtrl.gameStarted = false;
				studentCtrl.receivedQuestion = false;
				studentCtrl.closeEvent = true;
			}

			if(studentCtrl.current){
				if(!studentCtrl.current.Questao){
					studentCtrl.current.Questao = {};
					studentCtrl.current.Questao.textoQuestao = 'Sem pergunta no momento';
					if(!studentCtrl.current.Questao.assunto){
						studentCtrl.current.Questao.assunto = {};
					}
					studentCtrl.current.Questao.assunto.descricao = 'Sem assunto';
				}
				studentCtrl.current.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + studentCtrl.current.Questao.codImagem;
				studentCtrl.enabledSendAnsawer = studentCtrl.memberGroupId == studentCtrl.current.Grupo.codLider;
				console.log(studentCtrl.receivedQuestion);
				if(studentCtrl.enabledSendAnsawer && studentCtrl.event.codStatus == 'E' && studentCtrl.receivedQuestion){
					$.connection.hub.start().done(function () {
					    $rootScope.evento.server.ativarTimer(studentCtrl.Group.codEvento, getTimerDifficultyQuestion());
					        studentCtrl.countdown = getTimerDifficultyQuestion();
					        if(!$scope.$$phase){
					        	$scope.$apply();
					        }

					        // Elemento não está no DOM
					        $timeout(function(){
						        var timer = document.getElementById('timer-question');
						        timer.start();
					        }, 0);
					})
					.fail(function (reason) {
					    console.log("SignalR connection failed: " + reason);
					});					
				}
			}
		}

		function getTimerDifficultyQuestion(){
			var time = 0;
			switch(studentCtrl.current.Questao.dificuldade){
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
			console.log('pegou tempo');

			return time;
		}

		$rootScope.evento.client.iniciarJogo = function () {
          console.log("## JOGO INICIADO ##");
          updateStudentInfo(function(){
          	studentCtrl.gameStarted = true;
          	if(!$scope.$$phase) {
          	  $scope.$apply();
          	}
          });
        }

        $rootScope.evento.client.ativarTimer = function () {
			console.log("## TIMER ATIVADO ##");
			var timer = document.getElementById('timer-question');

			if(studentCtrl.current){
				studentCtrl.countdown = getTimerDifficultyQuestion();
			  	$scope.$apply();
				timer.start();
				console.log('start-1');
			}else{
				$scope.$watch('studentCtrl.current', function(newValue, oldValue){
					if(studentCtrl.currentInitialized){
						studentCtrl.countdown = getTimerDifficultyQuestion();
					  	$scope.$apply();
						timer.start();
						console.log('start-1');
					}
				});
			}   	
        }

        $rootScope.evento.client.lancarPergunta = function (response) {
          console.log("## PERGUNTA LANÇADA ##");
          updateStudentInfo(function(){
        	  studentCtrl.gameStarted = false;
        	  studentCtrl.questionAnswered = false;
        	  studentCtrl.receivedQuestion = true;
        	  if(!$scope.$$phase) {
	        	  $scope.$apply();
        	  }
          });
        }

        $rootScope.evento.client.responderPergunta = function (ok, isChampion, groupIdChampion, qtdQuestionsOk) {
          console.log("## PERGUNTA RESPONDIDA ##");
          updateStudentInfo(function(){
        	  studentCtrl.receivedQuestion = false;
        	  studentCtrl.questionAnswered = !isChampion;
        	  studentCtrl.hasChampion = isChampion;
        	  if(!$scope.$$phase) {
	        	  $scope.$apply();
        	  }
          });
        }

        $rootScope.evento.client.encerrarJogo = function () {
          console.log("## JOGO ENCERRADO ##");
          updateStudentInfo(function(){
        	  studentCtrl.receivedQuestion = false;
        	  studentCtrl.questionAnswered = false;
        	  studentCtrl.hasChampion = false;
        	  studentCtrl.closeEvent = true;
          	  if(!$scope.$$phase) {
  	        	  $scope.$apply();
          	  }
          });
        }		
    }
