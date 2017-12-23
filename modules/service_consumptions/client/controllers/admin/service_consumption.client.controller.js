(function () {
  'use strict';

  angular
    .module('service_consumptions.admin')
    .controller('Service_consumptionsAdminController', Service_consumptionsAdminController);

  Service_consumptionsAdminController.$inject = ['$q', '$scope', '$state', '$window', 'service_consumptionResolve', 'Authentication', 'Notification', 'SuppliesService', 'Consumption', 'CondominiumsService', 'DepartmentCustomService', 'ServicesService'];

  function Service_consumptionsAdminController($q, $scope, $state, $window, service_consumption, Authentication, Notification, SuppliesService, Consumption, CondominiumsService, DepartmentCustomService, ServicesService) {
    var vm = this;

    vm.service_consumption = service_consumption;
    vm.authentication = Authentication;
    vm.monthSelected = false;
    vm.consumption = {};
    vm.consumptions = [];
    vm.month = 0;

    vm.typeConsumption = function (id, type) {
      if (id !== 4) vm.generalSupplies(id, type);
      else vm.individualSupplies(id, type);
    };

    vm.generalSupplies = function (id, type) {
      vm.individual = false;
      vm.consumptions = [];
      vm.type = type;
      vm.supplies = SuppliesService.query({ type: id, condominium: vm.condominium });

      vm.supplies.$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.consumption.supplyCode = data[i].supplyCode;
          vm.consumption.serviceName = data[i].serviceName;
          vm.consumption.supplyDescription = data[i].supplyDescription;
          vm.consumption.globalIdentifier = data[i].entityId;
          vm.consumption.month = vm.month;
          vm.consumption.service = data[i].serviceId;
          vm.consumption.total = '';
          vm.consumption.type = data[i].type;
          vm.consumptions.push(vm.consumption);
          vm.consumption = {};
        }
      });
    };

    vm.individualSupplies = function (id, type) {
      vm.individual = true;
      vm.service = ServicesService.query({ type: id, condominium: vm.condominium });
      vm.type = type;
      vm.consumptions = [];
      var condominium = vm.condominium ? vm.condominium : vm.authentication.user.condominium;
      DepartmentCustomService.departmentsByCondominium(condominium, vm.month, {
        success: function (response) {
          vm.departments = response.data;
          for (var i = 0; i < vm.departments.length; i++) {
            vm.consumption.supplyCode = 'Servicio individual';
            vm.consumption.serviceName = vm.service[0].name;
            vm.consumption.supplyDescription = vm.departments[i].code;
            vm.consumption.globalIdentifier = vm.departments[i]._id;
            vm.consumption.month = vm.month;
            vm.consumption.service = vm.service[0]._id;
            vm.consumption.total = '';
            vm.consumption.consumed = 0;
            vm.consumption.type = 4;
            vm.consumptions.push(vm.consumption);
            vm.consumption = {};
          }
        },
        error: function (response) {
          console.log(response);
        }
      });
    };

    vm.months = [];
    vm.months.push({ name: 'Enero', value: 1 }, { name: 'Febrero', value: 2 });
    vm.months.push({ name: 'Marzo', value: 3 }, { name: 'Abril', value: 4 });
    vm.months.push({ name: 'Mayo', value: 5 }, { name: 'Junio', value: 6 });
    vm.months.push({ name: 'Julio', value: 7 }, { name: 'Agosto', value: 8 });
    vm.months.push({ name: 'Setiembre', value: 9 }, { name: 'Octubre', value: 10 });
    vm.months.push({ name: 'Noviembre', value: 11 }, { name: 'Diciembre', value: 12 });

    vm.initialize = function () {
      vm.typeConsumption(2, 'Grupo');
    };

    vm.registerServices = function () {
      var emptyValues = 0;
      vm.consumptions.forEach(function (key) {
        if (key.total === '') {
          emptyValues = emptyValues + 1;
        }
      });
      if (emptyValues > 0) {
        alert('Faltan ' + emptyValues + ' Suministros por agregar');
        return false;
      }
      Consumption.bulkConsumption(vm.consumptions, {
        success: function (response) {
          console.log(response);
        },
        error: function (err) {
          console.log(err);
        }
      });
    };


    if (vm.authentication.user.roles[0] === 'superadmin') vm.condominiums = CondominiumsService.query();
    else vm.condominium = vm.authentication.user.condominium;
  }
}());
