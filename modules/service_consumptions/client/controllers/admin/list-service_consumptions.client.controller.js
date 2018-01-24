(function () {
  'use strict';

  angular
    .module('service_consumptions.admin')
    .controller('Service_consumptionsAdminListController', Service_consumptionsAdminListController);

  Service_consumptionsAdminListController.$inject = ['Service_consumptionsService', 'Consumption', 'Messages'];

  function Service_consumptionsAdminListController(Service_consumptionsService, Consumption, Messages) {
    var vm = this;
    var today = new Date();

    vm.service_consumptions = Service_consumptionsService.query({ year: 2018, month: today.getMonth() + 1 });

    vm.years = [{ text: 2014, value: 2014 }, { text: 2015, value: 2015 }, { text: 2016, value: 2016 }, { text: 2017, value: 2017 }, { text: 2018, value: 2018 } ];
	vm.yearSelected = 2018;


    vm.deleteConsumption = function(id) {
    	Messages.confirmAction()
      	.then(function() {
	    	Consumption.deleteMassiveConsumptions(id, {
	    		success: function(response) {
	    			if(response.data.success) {
	    				Messages.successMessage('Se eliminó el consumo registrado, se eliminaron también ' + response.data.deleted + ' registros en las boletas.');
	    				for(var i = 0; i<vm.service_consumptions.length; i++) {
	    					if(vm.service_consumptions[i]._id == id) {
	    						vm.service_consumptions.splice(i, 1);
	    					}
	    				}
	    			}
	    		},
	    		error: function(response) {
	    			console.log(response);
	    		}
	    	});
      	});
    };
  }
}());
