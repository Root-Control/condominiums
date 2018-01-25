(function () {
  'use strict';

  angular
    .module('groups.admin')
    .controller('GroupsAdminController', GroupsAdminController);

  GroupsAdminController.$inject = ['$scope', '$state', '$window', 'groupResolve', 'Authentication', 'Notification', 'CondominiumsService', 'ServicesService', 'CustomService', 'CustomSupply'];

  function GroupsAdminController($scope, $state, $window, group, Authentication, Notification, CondominiumsService, Service, CustomService, CustomSupply) {
    var vm = this;

    vm.typeIdentifier = 2;
    vm.group = group;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.supplyCreator = [];
    vm.supply = {};

    vm.changeSupplyStatus = function(item) {
      CustomSupply.changeStatus(item, {
        success: function(response) {
          console.log(response.data);
        },
        error: function(err) {
          console.log(err);
        }
      });
    };

    vm.getUnregisteredServices = function () {
      vm.data = {
        entityId: vm.group._id,
        condominium: vm.authentication.user.condominium || vm.group.condominium,
        type: vm.typeIdentifier
      };
      CustomService.unregisteredServices(vm.data, {
        success: function (response) {
          vm.registered = response.data.registered;
          vm.supplyCreator = [];
          createSupplies(response.data.unregistered);
        },
        error: function (err) {
          console.log(err);
        }
      });
    };

    function createSupplies(services) {
      services.forEach(function (key) {
        vm.supply.serviceName = key.name;
        vm.supply.supplyCode = '';
        vm.supply.typeSupply = vm.typeIdentifier;
        vm.supply.serviceId = key._id;
        vm.supply.entityId = '';
        vm.supply.active = true;
        vm.supplyCreator.push(vm.supply);
        vm.supply = {};
      });
    }
    // Remove existing Group
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.group.$remove(function () {
          $state.go('admin.groups.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Group deleted successfully!' });
        });
      }
    }

    // Save Group
    function save(isValid) {
      if (vm.authentication.user.condominium) vm.group.condominium = vm.authentication.user.condominium;
      vm.group.supplyCreator = vm.supplyCreator;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.groupForm');
        return false;
      }

      // Create a new group, or update the current instance
      vm.group.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.groups.list'); // should we send the User to the list or the updated Group's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Group saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Group save error!' });
      }
    }

    if (vm.authentication.user.roles[0] === 'superadmin') vm.condominiums = CondominiumsService.query();
    else vm.getUnregisteredServices();
  }
}());
