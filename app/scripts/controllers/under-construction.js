'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:UnderConstructionController
 * @description
 * # UnderConstructionController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('UnderConstructionController', UnderConstructionController);

    UnderConstructionController.$inject = [/*'AuthenticationService', 'SessionService',*/ '$location', '$rootScope'];
    function UnderConstructionController(/*AuthenticationService, SessionService,*/ $location, $rootScope) {

        console.log("--->UnderConstructionController init");

        $("body").removeClass("bodyLogin");
        $(".header").hide();
        $("body").css("overflow-y", "hidden");
        $(".content").css("top", "0px");
    }