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
	        	var token = SessionService.getTokenInfo() ? SessionService.getTokenInfo().newToken ? SessionService.getTokenInfo().newToken : SessionService.getTokenInfo().token : null;

	        	if(token){

	        		config.headers['Authorization'] = 'Token ' + token;
	        	}				

				return config;

	            // var deferred = $q.defer();
	            // var http = $injector.get('$http');
	            // http.get('http://tlm-api-dev.azurewebsites.net/api/Tokens/generateToken').success(function (ret) {
	            //     sessionData.setToken(ret);
	            //     console.log("successfully authenticated with token " + sessionData.getToken());
	            //     config.headers['Authorization'] = 'Token ' + sessionData.getToken();
	            //     deferred.resolve(config);
	            // })
	            // .error(function(){
	            //     console.log("failed to authenticate");
	            //     deferred.resolve(config);
	            // });

	            // return deferred.promise;

	        }
	    };

    	return tokenInterceptor;
	}

	RunInterceptor.$inject = ['$http', 'SessionService'];

	function RunInterceptor($http, SessionService){
		console.log('##TOKEN.INTERCEPTOR##');

		var token = SessionService.getTokenInfo() ? SessionService.getTokenInfo().token : null;

		if(!token){
			console.log('##TOKEN.INTERCEPTOR##');
		    $http.get('/api/Tokens/generateToken').success(function (tokenInfo) {
		        SessionService.setTokenInfo(tokenInfo);
	            console.log('##TOKEN.INTERCEPTOR.SUCCESS## TOKEN ' + tokenInfo.token);
		    })
		    .error(function(){
	            console.log('##TOKEN.INTERCEPTOR.ERROR##');
	        });
		}	

		console.log('##TOKEN.INTERCEPTOR.SUCCESS## TOKEN ' + token);    
	}