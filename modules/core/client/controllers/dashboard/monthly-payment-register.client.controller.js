(function () {
  'use strict';

  angular
    .module('core')
    .controller('MonthlyPaymentRegisterController', MonthlyPaymentRegisterController);

  MonthlyPaymentRegisterController.$inject = ['$window', '$scope', '$state', 'Authentication', 'DepartmentCustomService', 'Pay', 'Messages'];

  function MonthlyPaymentRegisterController($window, $scope, $state, Authentication, DepartmentCustomService, Pay, Messages) {
    var vm = this;
    vm.authentication = Authentication;
    vm.allmonths = false;

    vm.searchDepartment = function (key) {
      if (key.which === 13) {
        vm.data = {
          code: vm.code,
          allmonths : vm.allmonths
        };
        Pay.paymentDetails(vm.data, {
          success: function (response) {
            vm.detailObject = {};
            vm.details = [];

            for(var i = 0; i < response.data.length; i++) {
              vm.detailObject.client = response.data[i].client;
              vm.detailObject.headerId = response.data[i].headerId;
              vm.detailObject.month = response.data[i].month;
              vm.detailObject.name = response.data[i].name;
              vm.detailObject.status = response.data[i].status;
              vm.detailObject.total = response.data[i].total;
              vm.detailObject.tower = response.data[i].tower;
              vm.detailObject.paymentOwner = response.data[i].paymentOwner;
              vm.detailObject.payed = 0;
              vm.details.push(vm.detailObject);
              vm.detailObject = {};
            }
            console.log(vm.details);
          },
          error: function (err) {
            console.log(err);
          }
        });
      }
    };

  vm.confirmPay = function(item) {
    if(!item.payed) {
      Messages.errorMessage('No ingresaste el monto que pago el cliente');
      return false;
    }
    Messages.confirmAction()
      .then(function() {
        vm.pay(item);
      });
  };


  vm.pay = function(item) {
    vm.difference = (item.total - item.payed).toFixed(2);
    vm.data = { billHeader: item.headerId, amountPayment: item.total, amountPayed: item.payed , difference: vm.difference, paymentOwner: item.paymentOwner };
    Pay.pay(vm.data, {
      success: function(response) {
        Messages.successMessage('Se cancelo el pago correctamente!');
        if(vm.difference > 0)  item.status = 'Refinanciamiento';
        else item.status = 'Pagado';
      },
      error: function(err) {
        Messages.errorMessage('Occurio un error, intenta de nuevo');
      }
    });
  };

  }
}());
