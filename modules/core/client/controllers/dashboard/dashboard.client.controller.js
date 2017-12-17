(function () {
  'use strict';

  angular
    .module('core')
    .controller('DashBoardController', DashBoardController);

 DashBoardController.$inject = ['$scope', '$state', 'Authentication'];

  function DashBoardController($scope, $state, Authentication) {
  	alert('DashBoardController');
    var vm = this;
    vm.authentication = Authentication;
  } 
}());