(function () {
  'use strict';

  angular
    .module('towers.admin')
    .controller('TowersAdminController', TowersAdminController);

  TowersAdminController.$inject = ['$scope', '$state', '$window', 'towerResolve', 'Authentication', 'Notification', 'GroupsService', 'ServicesService', 'CustomService'];

  function TowersAdminController($scope, $state, $window, tower, Authentication, Notification, GroupsService, Service, CustomService) {
    var vm = this;

    vm.typeIdentifier = 3;
    vm.tower = tower;

    vm.authentication = Authentication;

    if(vm.authentication.user.roles[0] === 'superadmin') vm.groups = GroupsService.query();
    else vm.groups = GroupsService.query({ condominium: vm.authentication.user.condominium });
    
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.supplyCreator = [];
    vm.supply = {};

    vm.data = {
      entityId: vm.tower._id,
      type: vm.typeIdentifier
    };

    CustomService.unregisteredServices(vm.data, {
      success: function(response) {
        vm.registered = response.data.registered;
        console.log(response.data);
        createSupplies(response.data.unregistered);
      },
      error: function(err) {
        console.log(err);
      }
    });

    function createSupplies(services) {
      services.forEach(function(key) {
        vm.supply.serviceName = key.name;
        vm.supply.supplyCode = '';
        vm.supply.typeSupply = vm.towerIdentifier;
        vm.supply.serviceId = key._id;
        vm.supply.entityId = '';
        vm.supplyCreator.push(vm.supply);
        vm.supply = {};
      });
      console.log(vm.supplyCreator);
    }

    // Remove existing Tower
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tower.$remove(function () {
          $state.go('admin.towers.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tower deleted successfully!' });
        });
      }
    }

    // Save Tower
    function save(isValid) {
      vm.tower.supplyCreator = vm.supplyCreator;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.towerForm');
        return false;
      }

      // Create a new tower, or update the current instance
      vm.tower.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.towers.list'); // should we send the User to the list or the updated Tower's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tower saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tower save error!' });
      }
    }
  }
}());
