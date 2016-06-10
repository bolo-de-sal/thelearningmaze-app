'use strict';

angular.module('thelearningmaze')
	.value('AppConfig', {
		app: {
			production: false
		},
		api: {
			identifier: '/api',
			endpoint: {
				staging: 'http://http://localhost:50806/',
				production: ''
			}
		} 
	});