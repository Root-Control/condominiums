(function () {
  'use strict';

  angular
    .module('service_consumptions.admin')
    .controller('Service_consumptionsAdminController', Service_consumptionsAdminController);

  Service_consumptionsAdminController.$inject = ['$scope', '$state', '$window', 'service_consumptionResolve', 'Authentication', 'Notification', 'ServicesService', 'CondominiumsService', 'DepartmentsService', 'GroupsService', 'TowersService'];

  function Service_consumptionsAdminController($scope, $state, $window, service_consumption, Authentication, Notification, ServicesService, GlobalService, DepartmentsService, GroupsService, TowersService) {
    var vm = this;

    vm.service_consumption = service_consumption;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.services = ServicesService.query();

    vm.showMonths = function() {
      vm.monthData = true;
      vm.months = [];
      vm.months.push({ name: 'Enero', value: 1 }, { name: 'Febrero', value: 2 });
      vm.months.push({ name: 'Marzo', value: 3 }, { name: 'Abril', value: 4 });
      vm.months.push({ name: 'Mayo', value: 5 }, { name: 'Junio', value: 6 });
      vm.months.push({ name: 'Julio', value: 7 }, { name: 'Agosto', value: 8 });
      vm.months.push({ name: 'Setiembre', value: 9 }, { name: 'Octubre', value: 10 });
      vm.months.push({ name: 'Noviembre', value: 11 }, { name: 'Diciembre', value: 12 });      
    }

    vm.getIdService = function(service) {
      vm.globalService = true;
      vm.services.forEach(function(key, value) {
        //  1 Global
        //  2 Grupal
        //  3 Torre
        //  4 Departamento
        if (service === key._id) {
          switch(key.type) {
            case 1:
              vm.type = 'Indica el condominio: ';
              vm.data = GlobalService.query();
              break;
            case 2:
              vm.type = 'Indica el grupo: ';
              vm.data = GroupsService.query();
              break;
            case 3:
              vm.type = 'Indica la torre: ';
              vm.data = TowersService.query();
              break;
            case 4:
              vm.type = 'Indica el departamento: ';
              vm.data = DepartmentsService.query();
              break;
          }          
        }
      });
    };

    // Remove existing Service_consumption
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.service_consumption.$remove(function () {
          $state.go('admin.service_consumptions.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Service_consumption deleted successfully!' });
        });
      }
    }

    // Save Service_consumption
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.service_consumptionForm');
        return false;
      }

      // Create a new service_consumption, or update the current instance
      vm.service_consumption.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.service_consumptions.list'); // should we send the User to the list or the updated Service_consumption's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Service_consumption saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Service_consumption save error!' });
      }
    }
  }
}());
