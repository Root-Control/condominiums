(function () {
  'use strict';

  angular
    .module('condominiums')
    .controller('CondominiumsController', CondominiumsController);

  CondominiumsController.$inject = ['$stateParams', '$scope', 'condominiumResolve', 'Authentication', 'CustomGroupsService'];

  function CondominiumsController($stateParams, $scope, condominium, Authentication, CustomGroupsService) {
    var vm = this;

    vm.condominium = condominium;
    vm.authentication = Authentication;
    vm.id = $stateParams.condominiumId;

    CustomGroupsService.getGroupsByCondominium(vm.id, {
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.log(error);
      }
    });

  }
}());
