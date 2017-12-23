(function () {
  'use strict';

  angular
    .module('core')
    .controller('PaymentRegisterController', PaymentRegisterController);

  PaymentRegisterController.$inject = ['$scope', '$state', 'Authentication', 'DepartmentCustomService', 'Pay'];

  function PaymentRegisterController($scope, $state, Authentication, DepartmentCustomService, Pay) {
    var vm = this;
    vm.authentication = Authentication;

    vm.searchDepartment = function (key) {
      if (key.which === 13) {
        DepartmentCustomService.searchDepartments(vm.code, {
          success: function (response) {
            vm.departments = response.data;
            console.log(vm.departments);
          },
          error: function (err) {
            console.log(err);
          }
        });
      }
    };

    vm.createBillHeader = function (departmentId) {
      console.log(departmentId);
      vm.department = [];
      vm.items = [];
      vm.user = [];
      vm.head = [];
      vm.individuals = [];
      Pay.calculatePay(vm.monthSelected, vm.yearSelected, departmentId, {
        success: function (response) {
          vm.department = response.data.department;
          vm.items = response.data.details;
          vm.total = response.data.total;

          vm.items.forEach(function (key) {
            if (key.type === 4) {
              vm.individuals.push(key);
              vm.items.splice(key, 1);
            }
          });

          vm.user = response.data.fullUser;
          vm.head = response.data.header;
        },
        error: function (err) {
          console.log(err);
        }
      });
    };

    vm.months = [];
    vm.userData = true;
    vm.months.push({ month: 1, name: 'Enero' });
    vm.months.push({ month: 2, name: 'Febrero' });
    vm.months.push({ month: 3, name: 'Marzo' });
    vm.months.push({ month: 4, name: 'Abril' });
    vm.months.push({ month: 5, name: 'Mayo' });
    vm.months.push({ month: 6, name: 'Junio' });
    vm.months.push({ month: 7, name: 'Julio' });
    vm.months.push({ month: 8, name: 'Agosto' });
    vm.months.push({ month: 9, name: 'Setiembre' });
    vm.months.push({ month: 10, name: 'Octubre' });
    vm.months.push({ month: 11, name: 'Noviembre' });
    vm.months.push({ month: 12, name: 'Diciembre' });

    vm.pay = function () {
      alert(vm.department.departmentId + ' ' + vm.monthSelected + ' ' + vm.yearSelected);
    };
  }
}());
