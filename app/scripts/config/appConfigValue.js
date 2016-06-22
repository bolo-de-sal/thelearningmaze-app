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
		// },
		api: {
			identifier: '/api',
			endpoint: 'http://api-learningmaze.azurewebsites.net'
		},
		signalr:{
			endpoint: 'http://senaquiz.sistemasparainter.net/learningmaze/services/signalr'
		},
		// api: {
		// 	identifier: '/learningmaze/services/api',
		// 	endpoint: 'http://api-learningmaze.azurewebsites.net/api'
		// },
		// signalr:{
		// 	endpoint: 'http://senaquiz.sistemasparainter.net/learningmaze/services/signalr'
		// },
		app: {
			lobby: {
				time: {
					groups: {
						refresh: 3000
					}
				}
			}
		}
	});