(function () {
  'use strict';

  angular
    .module('agreements')
    .controller('AgreementsController', AgreementsController);

  AgreementsController.$inject = ['$scope', 'agreementResolve', 'Authentication'];

  function AgreementsController($scope, agreement, Authentication) {
    var vm = this;

    vm.agreement = agreement;
    vm.authentication = Authentication;

  }
}());
