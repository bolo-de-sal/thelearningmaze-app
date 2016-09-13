'use strict';

angular
	.module('thelearningmaze')
	.factory('SessionService', SessionService);

	SessionService.$inject = ['$localStorage'];

	function SessionService($localStorage){
		var session = {};
		session.getTokenInfo = getTokenInfo;
		session.setTokenInfo = setTokenInfo;
		session.getUser = getUser;
		session.setUser = setUser;
		session.removeUserData = removeUserData;

		return session;

		function getTokenInfo(){
			return $localStorage.tokenInfo;
		}

		function setTokenInfo(tokenInfo){
			$localStorage.tokenInfo = tokenInfo;
		}

		function getUser(){
			return $localStorage.user;
		}

		function setUser(user){
			$localStorage.user = user;
		}

		function removeUserData(){
			this.setUser(undefined);
      		var tokenInfo = this.getTokenInfo();
        	delete tokenInfo.userToken;
        	this.setTokenInfo(tokenInfo);
		}
	}