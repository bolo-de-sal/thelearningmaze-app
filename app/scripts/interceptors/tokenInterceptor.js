'use strict';

angular
	.module('thelearningmaze')
	.factory('TokenInterceptor', TokenInterceptor)
	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('TokenInterceptor');
	}])
	.run(RunInterceptor);

    TokenInterceptor.$inject = ['$q', '$location', '$injector', '$rootScope', 'AppConfig', 'SessionService', 'AlertService'];

    function TokenInterceptor($q, $location, $injector, $rootScope, AppConfig, SessionService, AlertService) {
	    var tokenInterceptor = {
	        request: function(config) {
	        	var token = SessionService.getTokenInfo() ? SessionService.getTokenInfo().userToken ? SessionService.getTokenInfo().userToken : SessionService.getTokenInfo().token : null;

	        	if(token){

	        		config.headers['Authorization'] = 'Token ' + token;
	        	}				

				return config;
	        },
	        responseError: function(response) {
	            var httpStatus = response.status;
	            var data = response.data;

	            // Token expirado
	            if((data === 'Token expirado' || httpStatus === 419) && !$rootScope.recoveredToken){
	            	$rootScope.recoveredToken = true;
	            	// Buscar novo token
	            	console.log('##TOKEN.INTERCEPTOR.RESPONSEERROR## TOKEN EXPIROU');         	
	                var $http = $injector.get('$http');
	                var deferred = $q.defer();

            	    $http.get(AppConfig.api.identifier + '/Tokens/generateToken').then(function (response) {
            	    	console.log('##TOKEN.INTERCEPTOR## INICIANDO RECUPERAÇÃO DO TOKEN');
            	    	if(response.status === 200){
            	    		SessionService.setTokenInfo(response.data);
	                        console.log('##TOKEN.INTERCEPTOR.SUCCESS## TOKEN ' + response.data.token);
	                        $rootScope.recoveredToken = false;
            	    	}
            	        
            	    }).then(deferred.resolve, deferred.reject);

            	    if(httpStatus === 419){
            	    	$rootScope.sessionTimeout = true;
	            	    // Limpar os dados
	            	    if(SessionService.getUser()){
	            	    	$rootScope.userLoggedIn = null;
		            	    SessionService.removeUserData();
		            	    $location.path('/login');		            	    
	            	    }

	            	    return $q.reject(response);
            	    }


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