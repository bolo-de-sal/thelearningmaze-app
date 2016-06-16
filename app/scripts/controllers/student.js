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

    StudentController.$inject = ['$rootScope', '$location', '$q', 'GroupService', 'EventService'];

    function StudentController($rootScope, $location, $q, GroupService, EventService) {
        var studentCtrl = this;

        studentCtrl.groupId = $location.search().codGrupo;
        studentCtrl.memberGroupId = $location.search().codParticipante;

        $rootScope.dataLoading = true;

        $q.all([
		   GroupService.getGroupById(studentCtrl.groupId)
		]).then(function(response){
			studentCtrl.studentGroup = response[0];
		}).finally(function(){
	        $q.all([
			   GroupService.getCurrentGroupInfo(studentCtrl.studentGroup.codEvento),
			   GroupService.getGroupsByEventId(studentCtrl.studentGroup.codEvento)
			]).then(function(response){
				studentCtrl.current = response[0];
				studentCtrl.groupsInfo = response[1];
			}).finally(function(){
				studentCtrl.current.Questao.caminhoImagem = $rootScope.imagesUrl +  '/' + studentCtrl.current.Questao.codImagem;
				console.log(studentCtrl.groupId);
				console.log(studentCtrl.current.Grupo.codLider);
				studentCtrl.enabledSendAnsawer = studentCtrl.groupId == studentCtrl.current.Grupo.codLider;
				$rootScope.dataLoading = false;
			});
		});
    }
