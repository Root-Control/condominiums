(function () {
  'use strict';

  angular
    .module('core')
    .controller('PaymentRegisterController', PaymentRegisterController);

  PaymentRegisterController.$inject = ['$window', '$scope', '$state', 'Authentication', 'DepartmentCustomService', 'Pay', 'Messages', 'Helpers', 'AditionalsService'];

  function PaymentRegisterController($window, $scope, $state, Authentication, DepartmentCustomService, Pay, Messages, Helpers, AditionalsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.aditional = {};

    vm.searchDepartment = function (key) {
      if (key.which === 13) {
        vm.searchDepartment();
      }
    };

    vm.searchDepartment = function() {
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
          vm.aditionals = response.data.aditionals;
          vm.condominiumDetails = response.data.condominiumDetails;
          vm.fullUser = response.data.fullUser;
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

    vm.months = Helpers.getMonths();   
    vm.userData = true;

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

    vm.addAditional = function(item) {
      vm.selectedDepartment = item.code;
      vm.aditional.department = item._id;
      vm.aditional.month = vm.monthSelected;
      vm.aditional.year = vm.yearSelected;
    };

    vm.addPenaltyOrDiscount = function() {
      var type = vm.aditional.type == 1 ? 'este descuento?': 'esta multa?';
      if(isNaN(parseInt(vm.aditional.amount))) {
        Messages.errorMessage('El monto debe ser numérico');
        return false;
      }
        Messages.confirmAction('Estás seguro que deseas agregar ' + type)
        .then(function() {
          AditionalsService.addAditional(vm.aditional, {
            success: function(response) {
              Messages.successMessage('Registrado correctamente!');
              $('#aditional').modal('hide');
            },
            error: function(err) {
              Messages.errorMessage('Oops, ocurrió un error');
            }
          })
        }); 
    };

    vm.showRegisteredAditionals = function(item) {
      vm.selectedDepartment = item.code;
      vm.data = { month: vm.monthSelected, year: vm.yearSelected, department: item._id }; 
      AditionalsService.listAditionals(vm.data, {
        success: function(response) {
          vm.registeredAditional = response.data;
        },
        error: function(err) {
          console.log(err.data);
        }
      })
    };

    vm.deleteAditionalConsumption = function(id) {
        Messages.confirmAction('Estás seguro que deseas eliminar éste item?')
          .then(function() {
          AditionalsService.deleteAditional(id, {
            success: function(response) {
              for(var i = 0 ; i < vm.registeredAditional.length; i ++) {
                if(vm.registeredAditional[i]._id == id) {
                  vm.registeredAditional.splice(i, 1);
                }
              }
              Messages.successMessage('Eliminado correctamente!');
            },
            error: function(err) {
              Messages.errorMessage('Oops, ocurrió un error');
            }
          });
        }); 
    };

    vm.print = function() {
      vm.printElement(document.getElementById("printable"));
      window.print();
      setTimeout(function() {
        var printSection = document.getElementById("printSection");
        printSection.parentNode.removeChild(printSection);
      }, 2000);
    };

    vm.printElement = function(elem, append, delimiter) {
      var domClone = elem.cloneNode(true);

      var printSection = document.getElementById("printSection");

      if (!printSection) {
          var printSection = document.createElement("div");
          printSection.id = "printSection";
          document.body.appendChild(printSection);
      }

      if (append !== true) {
          printSection.innerHTML = "";
      }

      else if (append === true) {
          if (typeof(delimiter) === "string") {
              printSection.innerHTML += delimiter;
          }
          else if (typeof(delimiter) === "object") {
              printSection.appendChlid(delimiter);
          }
      }

      printSection.appendChild(domClone);
    };
  }
}());
