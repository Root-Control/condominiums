(function () {
  'use strict';

  angular
    .module('service_consumptions.admin')
    .controller('Service_consumptionsAdminController', Service_consumptionsAdminController);

  Service_consumptionsAdminController.$inject = ['$q', '$scope', '$state', '$window', 'service_consumptionResolve', 'Authentication', 'Notification', 'SuppliesService', 'Consumption'];

  function Service_consumptionsAdminController($q, $scope, $state, $window, service_consumption, Authentication, Notification, SuppliesService, Consumption) {
    var vm = this;

    vm.service_consumption = service_consumption;
    vm.authentication = Authentication;
    vm.monthSelected = false;;
    vm.consumption = {};
    vm.consumptions = [];
    vm.month = 0;

    vm.typeConsumption = function(id, type) {
      vm.consumptions = [];
      vm.type = type;
      vm.supplies = SuppliesService.query({ type: id });
      console.log(vm.supplies);
      vm.supplies.$promise.then(function(data) {
        for (var i = 0; i< data.length; i++) {
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


    vm.months = [];
    vm.months.push({ name: 'Enero', value: 1 }, { name: 'Febrero', value: 2 });
    vm.months.push({ name: 'Marzo', value: 3 }, { name: 'Abril', value: 4 });
    vm.months.push({ name: 'Mayo', value: 5 }, { name: 'Junio', value: 6 });
    vm.months.push({ name: 'Julio', value: 7 }, { name: 'Agosto', value: 8 });
    vm.months.push({ name: 'Setiembre', value: 9 }, { name: 'Octubre', value: 10 });
    vm.months.push({ name: 'Noviembre', value: 11 }, { name: 'Diciembre', value: 12 });      


    vm.initialize = function() {
      vm.typeConsumption(2, 'Grupo');
    }

    vm.registerServices = function() {
      var emptyValues = 0;
      vm.consumptions.forEach(function(key) {
        if(key.total === '') {
          emptyValues = emptyValues + 1;
        }
      });
       if(emptyValues>0) alert('Faltan ' + emptyValues + ' Suministros por agregar');
       Consumption.bulkConsumption(vm.consumptions, {
        success: function(response) {
          console.log(response);
        },
        error: function(err) {
          console.log(err);
        }
       });
    }
  }
}());
