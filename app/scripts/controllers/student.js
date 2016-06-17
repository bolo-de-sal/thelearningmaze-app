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

    StudentController.$inject = ['$rootScope', '$location', '$q', 'GroupService', 'EventService', 'QuestionService', 'QuestionDifficultyConfig', 'AlertService', '$localStorage', '$base64'];

    function StudentController($rootScope, $location, $q, GroupService, EventService, QuestionService, QuestionDifficultyConfig, AlertService, $localStorage, $base64) {
        var studentCtrl = this;

        if(!$localStorage.memberGroupId){
	        $localStorage.memberGroupId = 'lm' + $base64.encode($location.search().codParticipante);
        }

        studentCtrl.groupId = $location.search().codGrupo;
        studentCtrl.memberGroupId = $base64.decode($localStorage.memberGroupId.substring(2));

        $.connection.hub.start().done(function () {
            $rootScope.evento.client.ativarTimer = function () {
              console.log("## TIMER ATIVADO ##");

              switch(studentCtrl.current.Questao.dificuldade){
              	case 'F':
	              	studentCtrl.countdown = QuestionDifficultyConfig.F;
	             	break;
	            case 'M':
	             	studentCtrl.countdown = QuestionDifficultyConfig.M;
	             	break;
	            default:
	            	studentCtrl.countdown = QuestionDifficultyConfig.D;
	            	break;
              }
            }
        })
        .fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });

        $rootScope.dataLoading = true;

        $q.all([
		   EventService.getEventByGroupIdAndMemberGroupId(studentCtrl.groupId, studentCtrl.memberGroupId),
		   GroupService.getGroupById(studentCtrl.groupId)
		]).then(function(response){
			studentCtrl.event = response[0];
			studentCtrl.studentGroup = response[1];
		}, function(error){
			AlertService.Add('danger', error.data.message, true);
		}).finally(function(){
			$q.all([
			   // GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento),
			   GroupService.getGroupsByEventId(studentCtrl.studentGroup.codEvento)
			]).then(function(response){
				studentCtrl.current = {};
				studentCtrl.current.Grupo = studentCtrl.studentGroup;
				studentCtrl.groupsInfo = response[0];
			}, function(error){
				AlertService.Add('danger', error.data.message, true);
			}).finally(function(){
				updateCurrentStudentInfo(studentCtrl.current || {});
				$rootScope.dataLoading = false;

				$.connection.hub.start().done(function () {
			        $rootScope.evento.client.iniciarJogo = function () {
			          console.log("## JOGO INICIADO ##");
			          updateStudentInfo(function(){
			          	studentCtrl.gameStarted = true;
			          });
			        }
			    })
			    .fail(function (reason) {
			        console.log("SignalR connection failed: " + reason);
			    });

				$.connection.hub.start().done(function () {
			        $rootScope.evento.client.lancarPergunta = function () {
			          console.log("## PERGUNTA LANÇADA ##");
			          updateStudentInfo(function(){
			        	  studentCtrl.gameStarted = false;
			        	  studentCtrl.questionAnswered = false;
			        	  studentCtrl.receivedQuestion = true;
			          });
			        }
			    })
			    .fail(function (reason) {
			        console.log("SignalR connection failed: " + reason);
			    });

			    $.connection.hub.start().done(function () {
			        $rootScope.evento.client.responderPergunta = function (ok, isChampion, groupIdChampion, qtdQuestionsOk) {
			          console.log("## PERGUNTA RESPONDIDA ##");
			          updateStudentInfo(function(){
			        	  studentCtrl.receivedQuestion = false;
			        	  studentCtrl.questionAnswered = !isChampion;
			        	  studentCtrl.hasChampion = isChampion;
			          });
			        }
			    })
			    .fail(function (reason) {
			        console.log("SignalR connection failed: " + reason);
			    });

			    $.connection.hub.start().done(function () {
			        $rootScope.evento.client.encerrarJogo = function () {
			          console.log("## JOGO ENCERRADO ##");
			          updateStudentInfo(function(){
			        	  studentCtrl.receivedQuestion = false;
			        	  studentCtrl.questionAnswered = false;
			        	  studentCtrl.hasChampion = false;
			        	  studentCtrl.closeEvent = true;
			          });
			        }
			    })
			    .fail(function (reason) {
			        console.log("SignalR connection failed: " + reason);
			    });

			});
		});

		studentCtrl.sendSelectedAnsawer = function(ansawerText, ansawerAlternative, ansawerIsTrue, questionTimerFinished){
			$rootScope.dataLoading = true;
			document.getElementById('timer-question').stop();
			QuestionService.sendAnsawer(studentCtrl.studentGroup.codEvento, studentCtrl.current.Questao.codTipoQuestao, ansawerAlternative, ansawerIsTrue, ansawerText, questionTimerFinished).then(function(response){
				if(response.correta){
					AlertService.Add('success', 'Resposta correta', true);
				}else{
					AlertService.Add('danger', 'Resposta errada', true);
				}
				$.connection.hub.start().done(function () {
		            $rootScope.evento.server.responderPergunta(studentCtrl.studentGroup.codEvento, studentCtrl.current.Grupo.codGrupo, response.correta);
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
			this.sendSelectedAnsawer('', 0, false, true);
		}

		function updateStudentInfo(fn){
			$rootScope.dataLoading = true;
			GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento).then(function(response){
				updateCurrentStudentInfo(response);
			}, function(error){
				AlertService.Add('danger', error.data.message, true);
			}).finally(function(){
				fn();
				$rootScope.dataLoading = false;
			});
		}

		function updateCurrentStudentInfo(response){
			studentCtrl.current = response;
			if(studentCtrl.current.lenght > 0){
				if(!studentCtrl.current.Questao){
					studentCtrl.current.Questao = {};
					studentCtrl.current.Questao.textoQuestao = 'Sem pergunta no momento';
					if(!controlPanelCtrl.questions.current.Questao.assunto){
						controlPanelCtrl.questions.current.Questao.assunto = {};
					}
					studentCtrl.current.Questao.assunto.descricao = 'Sem assunto';
				}
				studentCtrl.current.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + studentCtrl.current.Questao.codImagem;
				studentCtrl.enabledSendAnsawer = studentCtrl.groupId == studentCtrl.current.Grupo.codLider;

				if(studentCtrl.enabledSendAnsawer){
					$.connection.hub.start().done(function () {
					    $rootScope.evento.server.ativarTimer(studentCtrl.studentGroup.codEvento);
					})
					.fail(function (reason) {
					    console.log("SignalR connection failed: " + reason);
					});
				}
			}
		}
    }
