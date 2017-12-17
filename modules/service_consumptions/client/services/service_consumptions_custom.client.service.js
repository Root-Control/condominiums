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

    return {
      bulkConsumption: me.bulkServiceConsumption
    }
  }
}());
