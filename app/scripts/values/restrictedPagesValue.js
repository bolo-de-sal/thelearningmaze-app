'use strict';

angular.module('thelearningmaze')
	.value('RestrictedPagesConfig', {
		anonymousAccess: ['/login', '/student', '/404']
	});