(function () {
  'use strict';

  angular
    .module('service_consumptions.admin')
    .controller('Service_consumptionsAdminController', Service_consumptionsAdminController);

  Service_consumptionsAdminController.$inject = ['$q', '$scope', '$state', '$window', 'service_consumptionResolve', 'Authentication', 'Notification', 'SuppliesService', 'Consumption', 'CondominiumsService', 'DepartmentCustomService', 'ServicesService', 'Messages'];

  function Service_consumptionsAdminController($q, $scope, $state, $window, service_consumption, Authentication, Notification, SuppliesService, Consumption, CondominiumsService, DepartmentCustomService, ServicesService, Messages) {
    var vm = this;
    vm.loading = false;
    vm.service_consumption = service_consumption;
    vm.authentication = Authentication;
    vm.monthSelected = false;
    vm.consumption = {};
    vm.consumptions = [];
    vm.month = 0;
    vm.tabSelected = {
      id: 2,
      type: 'Grupo'
    };

    vm.years = [{ text: 2014, value: 2014 }, { text: 2015, value: 2015 }, { text: 2016, value: 2016 }, { text: 2017, value: 2017 }, { text: 2018, value: 2018 } ];

    vm.yearSelected = 2018;

    vm.typeConsumption = function (id, type) {
      vm.tabSelected.id = id;
      vm.tabSelected.type = type;
      if (id !== 4) vm.generalSupplies(id, type);
      else vm.individualSupplies(id, type);
    };

    vm.generalSupplies = function (id, type) {
      if(id === 5) vm.personalSupplies = true;
      vm.individual = false;
      vm.consumptions = [];
      vm.type = type;
      vm.supplies = SuppliesService.query({ type: id, condominium: vm.condominium, active: true });

      vm.supplies.$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.consumption.supplyCode = data[i].supplyCode;
          vm.consumption.year = vm.yearSelected;
          vm.consumption.serviceName = data[i].serviceId.name;
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
            vm.consumption.year = vm.yearSelected;
            vm.consumption.supplyDescription = vm.departments[i].code;
            vm.consumption.globalIdentifier = vm.departments[i]._id;
            vm.consumption.month = vm.month;
            vm.consumption.service = vm.service[0]._id;
            vm.consumption.total = '';
            vm.consumption.consumed = 0;
            vm.consumption.type = 4;

            vm.consumption.avgWaterSupply = vm.departments[i].avgWaterSupply;
            vm.consumption.lastConsume = vm.departments[i].lastConsume;
            vm.consumption.emptyLastConsume = vm.consumption.lastConsume > 0 ? false: true;

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
      vm.typeConsumption(vm.tabSelected.id, vm.tabSelected.type);
    };

    vm.registerServices = function () {
      if (vm.tabSelected.id === 4 || vm.tabSelected.id === 5) {
        vm.verification = vm.servicesVerification();
        if(!vm.verification) return false;
      }

      var emptyValues = 0;
      vm.consumptions.forEach(function (key) {
        if (key.total === '') {
          emptyValues = emptyValues + 1;
        }
      });
      if (emptyValues > 0 && vm.tabSelected.id !== 4) {
        alert('Faltan ' + emptyValues + ' Suministros por agregar');
        return false;
      }
      vm.loading = true;
      Consumption.bulkConsumption(vm.consumptions, {
        success: function (response) {
          vm.loading = false;
          Messages.successMessage('Se registraron los consumos correctamente!');
        },
        error: function (err) {
          vm.loading = false;
          console.log(err);
        }
      });
    };


    vm.servicesVerification = function() {
      vm.errorsOrnegativeTotal = 0;
      vm.consumptions.forEach(function(key) {
        if(vm.tabSelected.id === 4) key.total = (key.consumed - key.lastConsume) * key.avgWaterSupply;
        else if (vm.tabSelected.id === 5) key.total = (key.consumed * key.qtyWorkers).toFixed(2);
        if(key.total < 1 || isNaN(key.total)) vm.errorsOrnegativeTotal = vm.errorsOrnegativeTotal + 1;
      });
      if(vm.errorsOrnegativeTotal > 0) {
        alert('Verifica los datos por favor');
        return false;
      }   
      return true;
    };

    if (vm.authentication.user.roles[0] === 'superadmin') vm.condominiums = CondominiumsService.query();
    else vm.condominium = vm.authentication.user.condominium;
  }
}());
