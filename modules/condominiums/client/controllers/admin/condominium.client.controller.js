(function () {
  'use strict';

  angular
    .module('condominiums.admin')
    .controller('CondominiumsAdminController', CondominiumsAdminController);

  CondominiumsAdminController.$inject = ['$scope', '$state', '$window', 'condominiumResolve', 'Authentication', 'Notification'];

  function CondominiumsAdminController($scope, $state, $window, condominium, Authentication, Notification) {
    var vm = this;

    vm.condominium = condominium;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Condominium
    function remove() {
      if ($window.confirm('Estás seguro de eliminarlo?')) {
        vm.condominium.$remove(function () {
          $state.go('admin.condominiums.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Condominio eliminado!' });
        });
      }
    }

    // Save Condominium
    function save(isValid) {
      console.log(vm.condominium);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.condominiumForm');
        return false;
      }

      // Create a new condominium, or update the current instance
      vm.condominium.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.condominiums.list'); // should we send the User to the list or the updated Condominium's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Condominio agregado!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al guardar!' });
      }
    }
  }
}());
