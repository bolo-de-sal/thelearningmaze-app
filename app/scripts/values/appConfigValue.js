'use strict';

angular.module('thelearningmaze')
	.value('AppConfig', {
		api: {
			identifier: '/api',
			endpoint: 'http://tlm-api-dev.azurewebsites.net'
			// endpoint: 'http://localhost/TheLearningMaze-API'
		} 
	});