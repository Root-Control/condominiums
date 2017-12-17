(function () {
  'use strict';

  angular
    .module('agreements.admin')
    .controller('AgreementsAdminListController', AgreementsAdminListController);

  AgreementsAdminListController.$inject = ['AgreementsService'];

  function AgreementsAdminListController(AgreementsService) {
    var vm = this;

    vm.agreements = AgreementsService.query();
    console.log(vm.agreements);
  }
}());
