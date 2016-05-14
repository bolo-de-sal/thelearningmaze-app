'use strict';

    angular
        .module('thelearningmaze')
        .factory('GlobalMessageService', GlobalMessageService);

    GlobalMessageService.$inject = ['$rootScope'];

    function GlobalMessageService($rootScope) {
        var globalMessage = {};

        globalMessage.Success = Success;
        globalMessage.Error = Error;

        initService();

        return globalMessage;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var globalMessage = $rootScope.globalMessage;
                if (globalMessage) {
                    if (!globalMessage.keepAfterLocationChange) {
                        delete $rootScope.globalMessage;
                    } else {
                        // only keep for a single location change
                        globalMessage.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(message, keepAfterLocationChange) {
            $rootScope.globalMessage = {
                message: message,
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.globalMessage = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
    }