(function (){
	'use strict';

	angular
	.module('app')
	.controller('LoginController', LoginController);

	LoginController.$inject = ['$location', 'AuthService', 'FlashService'];

	function LoginController($location, AuthService, FlashService) {
		var vm = this;
		vm.login = login;

		(function initController() {
			// Reset no login status
			AuthService.ClearCredentials();
		})();

		function login() {
			vm.dataLoading = true;
			AuthService.Login(vm.username, vm.password, function(response) {
				if (response.success) {
					AuthService.SetCredentials(vm.username, vm.password);
					$location.path('/');
				}
				else {
					FlashService.Error(response.message);
					vm.dataLoading = false;
				}
			});
		};
	}
})();