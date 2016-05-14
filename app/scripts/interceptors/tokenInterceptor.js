'use strict';

angular
	.module('thelearningmaze')
	.factory('TokenInterceptor', TokenInterceptor)
	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('TokenInterceptor');
	}])
	.run(RunInterceptor);

    TokenInterceptor.$inject = ['$q', 'SessionService'];

    function TokenInterceptor($q, SessionService) {
	    var tokenInterceptor = {
	        request: function(config) {
	        	var token = SessionService.getTokenInfo() ? SessionService.getTokenInfo().userToken ? SessionService.getTokenInfo().userToken : SessionService.getTokenInfo().token : null;

	        	if(token){

	        		config.headers['Authorization'] = 'Token ' + token;
	        	}				

				return config;
	        },
	        responseError: function(response) {
	            // Sessão expirada
	            if (response.status == 419){
	                var $http = $injector.get('$http');
	                var deferred = $q.defer();

            	    $http.get(AppConfig.api.identifier + '/Tokens/generateToken').success(function (tokenInfo) {
            	        SessionService.setTokenInfo(tokenInfo);
                        console.log('##TOKEN.INTERCEPTOR.SUCCESS## TOKEN ' + tokenInfo.token);
            	    })
            	    .error(function(){
                        console.log('##TOKEN.INTERCEPTOR.ERROR##');
                    });

	                // Refaz as requisições
	                return deferred.promise.then(function() {
	                    return $http(response.config);
	                });
	            }
	            
	            return $q.reject(response);
	        }
	    };

    	return tokenInterceptor;
	}

	RunInterceptor.$inject = ['$http', 'SessionService', 'AppConfig'];

	function RunInterceptor($http, SessionService, AppConfig){
		console.log('##TOKEN.INTERCEPTOR##');

		var token = SessionService.getTokenInfo() ? SessionService.getTokenInfo().token : null;

		if(!token){
			console.log('##TOKEN.INTERCEPTOR##');
		    $http.get(AppConfig.api.identifier + '/Tokens/generateToken').success(function (tokenInfo) {
		        SessionService.setTokenInfo(tokenInfo);
	            console.log('##TOKEN.INTERCEPTOR.SUCCESS## TOKEN ' + tokenInfo.token);
		    })
		    .error(function(){
	            console.log('##TOKEN.INTERCEPTOR.ERROR##');
	        });
		}	

		console.log('##TOKEN.INTERCEPTOR## TOKEN ' + token);    
	}