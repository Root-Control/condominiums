(function () {
  'use strict';

  angular
    .module('service_consumptions.services')
    .factory('Service_consumptionsService', Service_consumptionsService);

  Service_consumptionsService.$inject = ['$resource', '$log'];

  function Service_consumptionsService($resource, $log) {
    var Service_consumption = $resource('/api/service_consumptions/:service_consumptionId', {
      service_consumptionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Service_consumption.prototype, {
      createOrUpdate: function () {
        var service_consumption = this;
        return createOrUpdate(service_consumption);
      }
    });

    return Service_consumption;

    function createOrUpdate(service_consumption) {
      if (service_consumption._id) {
        return service_consumption.$update(onSuccess, onError);
      } else {
        return service_consumption.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(service_consumption) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
