'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:ControlPanelController
 * @description
 * # ControlPanelController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('ControlPanelController', ControlPanelController);

    //ControlPanelController.$inject = ['AuthenticationService', 'SessionService', 'EventService', '$rootScope', '$location'];

    function ControlPanelController() {
        var controlPanelCtrl = this;

        controlPanelCtrl.closeOthers = false;

		controlPanelCtrl.groups = [
	        {
	          'open': false
	        },
	        {
	          'open': false
	        },
	        {
	          'open': false
	        },
	        {
	          'open': false
	        },
	        {
	          'open': false
	        },
	        {
	          'open': false
	        },
	        {
	          'open': false
	        }
        ];
        
        $("body").removeClass("bodyLogin");
        $(".header").show();
    }
