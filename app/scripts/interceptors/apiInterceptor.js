'use strict';

angular
	.module('thelearningmaze')
	.factory('ApiInterceptor', ApiInterceptor)
	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('ApiInterceptor');
	}]);

	ApiInterceptor.$inject = ['$q', 'AppConfig'];

	function ApiInterceptor($q, AppConfig){
		var apiInterceptor = {
			request: function(config) {
				if(new RegExp('^' + AppConfig.api.identifier).test(config.url)){
					config.url = AppConfig.api.endpoint + config.url;
				}
				
				return config;
			}
		};

		return apiInterceptor;
	}