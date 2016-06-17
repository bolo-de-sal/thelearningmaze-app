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

    StudentController.$inject = ['$rootScope', '$location', '$q', 'GroupService', 'EventService', 'QuestionService'];

    function StudentController($rootScope, $location, $q, GroupService, EventService, QuestionService) {
        var studentCtrl = this;

        studentCtrl.groupId = $location.search().codGrupo;
        studentCtrl.memberGroupId = $location.search().codParticipante;

        $rootScope.dataLoading = true;

        $q.all([
		   EventService.getEventByGroupIdAndMemberGroupId(studentCtrl.groupId, studentCtrl.memberGroupId),
		   GroupService.getGroupById(studentCtrl.groupId)
		]).then(function(response){
			studentCtrl.event = response[0];
			studentCtrl.studentGroup = response[1];
		}).finally(function(){
			$q.all([
			   GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento),
			   GroupService.getGroupsByEventId(studentCtrl.studentGroup.codEvento)
			]).then(function(response){
				studentCtrl.current = response[0];
				studentCtrl.groupsInfo = response[1];
			}).finally(function(){
				if(!studentCtrl.current.Questao){
					studentCtrl.current.Questao = {};
				}
				studentCtrl.current.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + studentCtrl.current.Questao.codImagem;
				studentCtrl.enabledSendAnsawer = studentCtrl.groupId == studentCtrl.current.Grupo.codLider;
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

			});
		});

		studentCtrl.sendSelectedAnsawer = function(ansawerText, ansawerAlternative, ansawerIsTrue){
			$rootScope.dataLoading = true;
			QuestionService.sendAnsawer(studentCtrl.studentGroup.codEvento, studentCtrl.current.Questao.codTipoQuestao, ansawerAlternative, ansawerIsTrue, ansawerText).then(function(response){
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
				AlertService.Add('danger', error.data, true);
			}).finally(function(){
				$rootScope.dataLoading = false;
			});
		}

		function updateStudentInfo(fn){
			$rootScope.dataLoading = true;
			GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento).then(function(response){
				studentCtrl.current = response;
				if(!studentCtrl.current.Questao){
					studentCtrl.current.Questao = {};
					studentCtrl.current.Questao.textoQuestao = 'Sem pergunta no momento';
					studentCtrl.current.Questao.assunto.descricao = 'Sem assunto';
				}
				studentCtrl.current.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + studentCtrl.current.Questao.codImagem;
				studentCtrl.enabledSendAnsawer = studentCtrl.groupId == studentCtrl.current.Grupo.codLider;
			}, function(error){
				AlertService.Add('danger', error.data, true);
			}).finally(function(){
				fn();
				$rootScope.dataLoading = false;
			});
		}
    }
