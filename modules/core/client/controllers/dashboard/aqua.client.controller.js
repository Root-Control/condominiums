(function () {
  'use strict';

  angular
    .module('core')
    .controller('AquaController', AquaController);

  AquaController.$inject = ['$window', '$scope', '$state', 'Authentication', 'Messages', 'TowersService', 'Helpers', 'Consumption']
  ;

  function AquaController($window, $scope, $state, Authentication, Messages, TowersService, Helpers, Consumption) {
    var vm = this;
    vm.authentication = Authentication;
	vm.years = [{ text: 2014, value: 2014 }, { text: 2015, value: 2015 }, { text: 2016, value: 2016 }, { text: 2017, value: 2017 }, { text: 2018, value: 2018 }, { text: 2019, value: 2019 } ];
    vm.selectedYear = 2019;
    vm.selectedTowerName = 'Seleccionar';

    vm.towers = TowersService.query({ active: true });

    vm.selectTower = function(item) {
    	vm.selectedTowerName = item.name;
    	vm.selectedTower = item._id;
    };

    vm.validateFields = function() {
    	if(!vm.selectedMonth) {
			alert('Selecciona un mes'); 
			return false;
    	}
    	if(!vm.selectedTower) {
    		alert('Selecciona una torre'); 
    		return false;
    	}

    	vm.data = {
    		towerId: vm.selectedTower,
    		month: parseInt(vm.selectedMonth, 10),
    		year: parseInt(vm.selectedYear, 10)
    	};
    	vm.getConsumptions(vm.data);
    };

    vm.getConsumptions = function(data) {
    	Consumption.getAquaConsumptionsByTower(data, {
    		success: function(response) {
    			console.log(response.data);
    			vm.consumptions = response.data;
    		},
    		error: function(err) {
    			console.log(err);
    		}
    	});
    };

    vm.deleteAquaRecord = function(id) {
        Messages.confirmAction('Estás seguro que deseas eliminar este consumo?')
        .then(function() {
            Consumption.deleteMassiveConsumptions(id, {
                success: function(response) {
                    if(response.data.success) {
                        Messages.successMessage('Se eliminó el consumo registrado, se eliminaron también ' + response.data.deleted + ' registros en las boletas.');
                        for(var i = 0; i<vm.consumptions.length; i++) {
                            if(vm.consumptions[i].consumption._id == id) {
                                vm.consumptions.splice(i, 1);
                            }
                        }
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            });
        });        
    }

    vm.months = Helpers.getMonths();
  }
}());
