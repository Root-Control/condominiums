(function () {
  'use strict';

  angular
    .module('core')
    .controller('DashBoardController', DashBoardController);

 DashBoardController.$inject = ['$scope', '$state', 'Authentication', 'DepartmentCustomService'];

  function DashBoardController($scope, $state, Authentication, DepartmentCustomService) {
    var vm = this;
    vm.authentication = Authentication;

    DepartmentCustomService.activeDepartments({
    	success: function(response) {
    		vm.qty = response.data.qty;
    	},
    	error: function(err) {
    		console.log(err);
    	}
    })
  } 
}());