'use strict';

angular
	.module('thelearningmaze')
	.factory('HttpInterceptor', HttpInterceptor)
	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('HttpInterceptor');
	}]);

	HttpInterceptor.$inject = ['$q', '$rootScope', 'SessionService', 'GlobalMessageService'];

	function HttpInterceptor($q, $rootScope, SessionService, GlobalMessageService){
		var httpInterceptor = {
			responseError: function(response) {
				var httpStatus = response.status;
				var hideGlobalMessage = (httpStatus === 419 && !SessionService.getUser());

				// Esconde o loading
				$rootScope.dataLoading = false;

				if(!hideGlobalMessage){
					// verificar o objeto de resposta se existir e exibir a mensagem senão exibir uma mensagem padrão
					GlobalMessageService.Error('Ops! Parece que algo deu errado, tente novamente mais tarde.');
				}
				
				return $q.reject(response);
			}
		};

		return httpInterceptor;
	}