(function () {
  'use strict';

  angular
    .module('core')
    .controller('CondominiumServiceController', CondominiumServiceController);

  CondominiumServiceController.$inject = ['$scope', '$state', 'Authentication', 'CustomService', 'CondominiumsService', 'CondominiumCustomService'];

  function CondominiumServiceController($scope, $state, Authentication, CustomService, CondominiumsService, CondominiumCustomService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.typeIdentifier = [1, 5];
    vm.supply = {};
    vm.supplyCreator = [];

    vm.getUnregisteredServices = function () {
      vm.supplyCreator = [];
      vm.data = {
        entityId: vm.authentication.user.condominium ? vm.authentication.user.condominium : vm.condominium._id,
        condominium: vm.authentication.user.condominium ? vm.authentication.user.condominium : vm.condominium._id,
        type: vm.typeIdentifier
      };
      CustomService.unregisteredServices(vm.data, {
        success: function (response) {
          vm.registered = response.data.registered;
          if (response.data.unregistered.length > 0) vm.nosupply = false, createSupplies(response.data.unregistered);
          else vm.nosupply = true;
        },
        error: function (err) {
          console.log(err);
        }
      });
    };

    function createSupplies (services) {
      services.forEach(function (key) {
        vm.supply.serviceName = key.name;
        vm.supply.supplyCode = '';
        vm.supply.typeSupply = key.type;
        vm.supply.serviceId = key._id;
        vm.supply.entityId = '';
        vm.supply.active = true;
        vm.supplyCreator.push(vm.supply);
        vm.supply = {};
      });
      console.log(vm.supplyCreator);
    }

    vm.registerCondominiumServices = function () {
      var data = { _id: vm.authentication.user.condominium || vm.condominium._id, supplyCreator: vm.supplyCreator, name: vm.condominium ? vm.condominium.name: 'Condominio' };
      CondominiumCustomService.registerCondominiumServices(data, {
        success: function (response) {
          if (response.data.success) alert(response.data.message);
        },
        error: function (err) {
          console.log(err);
        }
      });
    };

    if (!vm.authentication.user.condominium) vm.condominiums = CondominiumsService.query();
    else vm.getUnregisteredServices();
  } 
}());