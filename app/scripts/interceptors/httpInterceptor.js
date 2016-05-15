'use strict';

angular
	.module('thelearningmaze')
	.factory('HttpInterceptor', HttpInterceptor)
	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('HttpInterceptor');
	}]);

	HttpInterceptor.$inject = ['$q', '$rootScope', 'SessionService', 'AlertService'];

	function HttpInterceptor($q, $rootScope, SessionService, AlertService){
		var httpInterceptor = {
			responseError: function(response) {
				var httpStatus = response.status;
				var hideGlobalMessage = (httpStatus === 400 && !SessionService.getUser());

				if(!hideGlobalMessage){
					// Esconde o loading
					$rootScope.dataLoading = false;

					// Recuperar mensagem vinda do servidor
					AlertService.Add('danger', 'Ops! Parece que algo deu errado, tente novamente mais tarde.');
				}
				
				return $q.reject(response);
			}
		};

		return httpInterceptor;
	}