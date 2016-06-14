'use strict';

angular.module('thelearningmaze')
	.value('AppConfig', {
		app: {
			production: false
		},
		api: {
			identifier: '/api',
			endpoint: {
				staging: 'http://tlm-api-dev.azurewebsites.net',
				production: ''
			}
		} 
	});