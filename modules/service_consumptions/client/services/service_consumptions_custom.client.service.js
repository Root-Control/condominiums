(function () {
  'use strict';

  angular
    .module('service_consumptions.services')
    .factory('Consumption', Consumption);

  Consumption.$inject = ['$http'];

  function Consumption($http) {
    var me = this;
    me.bulkServiceConsumption = function(data, options) {
      $http.post('/api/bulk/service_consumptions', data)
      .then(options.success, options.error);
    };

    me.deleteMassiveConsumptions = function(id, options) {
      $http.delete('/api/service_consumptions/massivedelete/' + id)
      .then(options.success, options.error);
    };

    me.updateMassiveConsumptions = function(data, options) {
      $http.update('/api/service_consumptions/massiveupdate/' + data._id, data)
      .then(options.success, options.error);
    };

    me.getAquaConsumptionsByTower = function(data, options) {
      var query = 'towerId=' + data.towerId + '&month=' + data.month + '&year=' + data.year;
      $http.get('/api/service_consumptions/getwaterconsumption?' + query)
        .then(options.success, options.error);
    };
    return {
      bulkConsumption: me.bulkServiceConsumption,
      deleteMassiveConsumptions: me.deleteMassiveConsumptions,
      getAquaConsumptionsByTower: me.getAquaConsumptionsByTower
    }
  }
}());
