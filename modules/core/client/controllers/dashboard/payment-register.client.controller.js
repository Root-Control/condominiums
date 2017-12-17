(function () {
  'use strict';

  angular
    .module('core')
    .controller('PaymentRegisterController', PaymentRegisterController);

 PaymentRegisterController.$inject = ['$scope', '$state', 'Authentication'];

  function PaymentRegisterController($scope, $state, Authentication) {
  	alert('PaymentRegisterController');
    var vm = this;
    vm.authentication = Authentication;
  } 
}());