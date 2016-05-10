'use strict';

angular
	.module('thelearningmaze')
	.factory('HttpInterceptor', HttpInterceptor)
	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('HttpInterceptor');
	}]);

	HttpInterceptor.$inject = ['$q', '$rootScope', 'GlobalMessageService'];

	function HttpInterceptor($q, $rootScope, GlobalMessageService){
		var httpInterceptor = {
			responseError: function(rejection) {
				//if(rejection.status === 404){
					// var apiUrl = AppConfig.app.production ? AppConfig.api.production : AppConfig.api.staging;

					// if(rejection.config.url.startsWith(apiUrl + AppConfig.api.identifier)){
					// 	GlobalMessageService.Error('Ops! Parece que algo deu errado, tente novamente mais tarde.');
					// }
				//}

				$rootScope.dataLoading = false;

				// verificar o objeto de resposta se existir e exibir a mensagem senão exibir uma mensagem padrão
				GlobalMessageService.Error('Ops! Parece que algo deu errado, tente novamente mais tarde.');
				
				return $q.reject(rejection);
			}
		};

		return httpInterceptor;
	}