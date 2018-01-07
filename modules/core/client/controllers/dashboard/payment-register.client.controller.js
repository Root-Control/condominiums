(function () {
  'use strict';

  angular
    .module('core')
    .controller('PaymentRegisterController', PaymentRegisterController);

  PaymentRegisterController.$inject = ['$window', '$scope', '$state', 'Authentication', 'DepartmentCustomService', 'Pay', 'Messages'];

  function PaymentRegisterController($window, $scope, $state, Authentication, DepartmentCustomService, Pay, Messages) {
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
      vm.department = [];
      vm.items = [];
      vm.user = [];
      vm.head = [];
      vm.individuals = {};
      vm.towerServices = [];
      vm.groupServices = [];
      vm.globalServices = [];
      vm.personalServices = [];
      Pay.calculatePay(vm.monthSelected, vm.yearSelected, departmentId, {
        success: function (response) {
          vm.information = response.data.informative;
          vm.lastConsume = response.data.lastConsume;
          vm.avgWaterSupply = response.data.avgWaterSupply;
          vm.department = response.data.department;
          vm.items = response.data.details;
          vm.total = response.data.total;
          vm.header = response.data.header;

          vm.items.forEach(function(key) {
            switch(key.type) {
              case 1:
                vm.globalServices.push(key);
              break;
              case 2:
                vm.groupServices.push(key);
              break;
              case 3:
                vm.towerServices.push(key);
              break;
              case 4:
                vm.individuals = key;
              break;
              case 5:
                vm.personalServices.push(key);
              break;
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

    vm.confirmAndPay = function () {
      if(!vm.userpay) {
        Messages.errorMessage('No ingresaste el monto que pago el cliente');
        return false;
      }
      Messages.confirmAction()
        .then(function() {
          vm.pay();
        });
    };

    vm.pay = function () {
      vm.difference = (vm.total - vm.userpay).toFixed(2);
      vm.data = { billHeader: vm.header._id, amountPayment: vm.total, amountPayed: vm.userpay, difference: vm.difference };
      Pay.pay(vm.data, {
        success: function(response) {
          Messages.successMessage('Se cancelo el pago correctamente!');
        },
        error: function(err) {
          Messages.errorMessage('Occurio un error, intenta de nuevo');
        }
      });
    };
    //  https://limonte.github.io/sweetalert2/
  }
}());
