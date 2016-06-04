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

    ControlPanelController.$inject = ['$routeParams', '$uibModal'];

    function ControlPanelController($routeParams, $uibModal) {
        var controlPanelCtrl = this;

        $("body").removeClass("bodyLogin");
        $(".header").show();

        //console.log($routeParams.eventId);

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

        controlPanelCtrl.items = ['item1', 'item2', 'item3'];

		controlPanelCtrl.animationsEnabled = true;

		controlPanelCtrl.open = function (size) {

		var modalInstance = $uibModal.open({
		  animation: controlPanelCtrl.animationsEnabled,
		  templateUrl: 'myModalContent.html',
		  controller: 'ControlPanelController',
		  size: size,
		  resolve: {
		    items: function () {
		      return controlPanelCtrl.items;
		    }
		  }
		});

		modalInstance.result.then(function (selectedItem) {
			  controlPanelCtrl.selected = selectedItem;
			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		};

		controlPanelCtrl.toggleAnimation = function () {
			controlPanelCtrl.animationsEnabled = !controlPanelCtrl.animationsEnabled;
		};
    }
