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
        var groupIdDecoded = $localStorage.groupId ? $base64.decode($localStorage.groupId) : 0;
        var otherGroup = groupIdDecoded != $location.search().codGrupo;

        if(!$localStorage.memberGroupId || otherGroup){
	        $localStorage.memberGroupId = 'lm' + $base64.encode($location.search().codParticipante);
	        $localStorage.groupId = $base64.encode($location.search().codGrupo);
        }

        studentCtrl.groupId = $base64.decode($localStorage.groupId);
        studentCtrl.memberGroupId = $base64.decode($localStorage.memberGroupId.substring(2));

        // $.connection.hub.start().done(function () {
        //     $rootScope.evento.client.ativarTimer = function () {
        //       console.log("## TIMER ATIVADO ##");

        //       switch(studentCtrl.current.Questao.dificuldade){
        //       	case 'F':
	       //        	studentCtrl.countdown = QuestionDifficultyConfig.F;
	       //       	break;
	       //      case 'M':
	       //       	studentCtrl.countdown = QuestionDifficultyConfig.M;
	       //       	break;
	       //      default:
	       //      	studentCtrl.countdown = QuestionDifficultyConfig.D;
	       //      	break;
        //       }
        //     }
        // })
        // .fail(function (reason) {
        //     console.log("SignalR connection failed: " + reason);
        // });

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
			console.log("Event: ", studentCtrl.event);
			console.log("StudentGroup: ", studentCtrl.studentGroup);

			if(studentCtrl.event.codStatus == "E"){
				studentCtrl.gameStarted = true;
			}

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
				console.log("current.Grupo: ", studentCtrl.current.Grupo);
				console.log("groupsInfo: ", studentCtrl.groupsInfo);

				updateCurrentStudentInfo(studentCtrl.current || {});
				$rootScope.dataLoading = false;

				console.log("Entrou no finally...");

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
			$q.all([
			   // GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento),
			   GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento),
			   EventService.getEventByGroupIdAndMemberGroupId(studentCtrl.groupId, studentCtrl.memberGroupId)
			]).then(function(response){
				updateCurrentStudentInfo(response[0]);
				studentCtrl.evemt = response[1];
			}, function(error){
				AlertService.Add('danger', error.data.message, true);
			}).finally(function(){
				console.log("studentCtrl.event: ", studentCtrl.event);

				fn();

				$rootScope.dataLoading = false;
			});

			// GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento).then(function(response){
			// 	updateCurrentStudentInfo(response);
			// }, function(error){
			// 	AlertService.Add('danger', error.data.message, true);
			// }).finally(function(){
			// 	fn();
			// 	studentCtrl.event.codStatus = "E";
			// 	$rootScope.dataLoading = false;
			// });
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

		$rootScope.evento.client.iniciarJogo = function () {
          console.log("## JOGO INICIADO ##");
          updateStudentInfo(function(){
          	studentCtrl.gameStarted = true;
          });
        }

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

        $rootScope.evento.client.lancarPergunta = function () {
          console.log("## PERGUNTA LANÇADA ##");
          updateStudentInfo(function(){
        	  studentCtrl.gameStarted = false;
        	  studentCtrl.questionAnswered = false;
        	  studentCtrl.receivedQuestion = true;
          });
        }

        $rootScope.evento.client.responderPergunta = function (ok, isChampion, groupIdChampion, qtdQuestionsOk) {
          console.log("## PERGUNTA RESPONDIDA ##");
          updateStudentInfo(function(){
        	  studentCtrl.receivedQuestion = false;
        	  studentCtrl.questionAnswered = !isChampion;
        	  studentCtrl.hasChampion = isChampion;
          });
        }

        $rootScope.evento.client.encerrarJogo = function () {
          console.log("## JOGO ENCERRADO ##");
          updateStudentInfo(function(){
        	  studentCtrl.receivedQuestion = false;
        	  studentCtrl.questionAnswered = false;
        	  studentCtrl.hasChampion = false;
        	  studentCtrl.closeEvent = true;
          });
        }
    }
