(function () {
  'use strict';

  angular
    .module('clients.admin')
    .controller('ClientsAdminController', ClientsAdminController);

  ClientsAdminController.$inject = ['$scope', '$state', '$window', 'clientResolve', 'Authentication', 'Notification'];

  function ClientsAdminController($scope, $state, $window, client, Authentication, Notification) {
    var vm = this;

    vm.client = client;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Client
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.client.$remove(function () {
          $state.go('admin.clients.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Client deleted successfully!' });
        });
      }
    }

    // Save Client
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clientForm');
        return false;
      }

      // Create a new client, or update the current instance
      vm.client.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.clients.list'); // should we send the User to the list or the updated Client's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Client saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Client save error!' });
      }
    }
  }
}());
