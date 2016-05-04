(function () {

	angular.module('app').factory('sessionData', function () {
	    var currentToken = '[uninitialized-token]';

	    return {
	        getToken: function () {
	            return currentToken;
	        },
	        setToken: function (token) {
	            currentToken = token;
	        }
	    }
	})

	.factory('sessionInjector', ['sessionData', '$injector', '$q', function(sessionData, $injector, $q) {  
	    var sessionInjector = {
	        request: function(config) {
	            // if (!SessionService.isAnonymus) {
	            //     config.headers['Authorization'] = "Token " + SessionService.token;
	            // }
	            // return config;

				config.headers['Authorization'] = "Token " + sessionData.currentToken;

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

    	return sessionInjector;
	}])

	.config(['$httpProvider', function ($httpProvider) {
    	$httpProvider.interceptors.push('sessionInjector');
	}])

	.run(['$http', 'sessionData', function ($http, configs, sessionData) {
	    $http.get('http://tlm-api-dev.azurewebsites.net/api/Tokens/generateToken').success(function (ret) {
	        sessionData.setToken(ret);
            console.log("successfully authenticated with token " + sessionData.getToken());
	    })
	    .error(function(){
            console.log("failed to authenticate");
        });
    }])

})();