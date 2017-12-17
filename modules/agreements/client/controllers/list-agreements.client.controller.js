(function () {
  'use strict';

  angular
    .module('agreements')
    .controller('AgreementsListController', AgreementsListController);

  AgreementsListController.$inject = ['AgreementsService'];

  function AgreementsListController(AgreementsService) {
    var vm = this;

    vm.agreements = AgreementsService.query();
  }
}());
