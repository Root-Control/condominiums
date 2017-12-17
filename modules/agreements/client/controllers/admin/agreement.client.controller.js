(function () {
  'use strict';

  angular
    .module('agreements.admin')
    .controller('AgreementsAdminController', AgreementsAdminController);

  AgreementsAdminController.$inject = ['$scope', '$state', '$window', 'agreementResolve', 'Authentication', 'Notification', 'ClientsService', 'DepartmentsService', 'GroupsService', 'TowersService'];

  function AgreementsAdminController($scope, $state, $window, agreement, Authentication, Notification, Clients, Departments, Groups, Towers) {
    var vm = this;

    vm.agreement = agreement;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.clients = Clients.query();
    vm.groups = Groups.query();

    vm.searchTowers = function(groupId) {
      vm.towers = Towers.query({ groupAssigned: groupId });
      console.log(vm.towers);
    };

    vm.searchDepartments = function(towerId) {
      vm.departments = Departments.query({ tower: towerId });
    };

    // Remove existing Agreement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.agreement.$remove(function () {
          $state.go('admin.agreements.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Agreement deleted successfully!' });
        });
      }
    }

    // Save Agreement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.agreementForm');
        return false;
      }

      // Create a new agreement, or update the current instance
      vm.agreement.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.agreements.list'); // should we send the User to the list or the updated Agreement's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Agreement saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Agreement save error!' });
      }
    }
  }
}());
