'use strict';

angular.module('thelearningmaze')
	.value('AppConfig', {
		// api: {
		// 	identifier: '/api',
		// 	endpoint: 'http://tlm-api-dev.azurewebsites.net'
		// 	// endpoint: 'http://localhost/TheLearningMaze-API'
		// },
		// signalr:{
		// 	endpoint: 'http://tlm-api-dev.azurewebsites.net/signalr'
		// 	// endpoint: 'http://localhost/TheLearningMaze-API/signalr'
		// }
		api: {
			identifier: '/learningmaze/services/api',
			endpoint: 'http://senaquiz.sistemasparainter.net'
			// endpoint: 'http://localhost/TheLearningMaze-API'
		},
		signalr:{
			endpoint: 'http://senaquiz.sistemasparainter.net/learningmaze/services/signalr'
			// endpoint: 'http://localhost/TheLearningMaze-API/signalr'
		}
	});