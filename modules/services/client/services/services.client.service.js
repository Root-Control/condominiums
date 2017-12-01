(function () {
  'use strict';

  angular
    .module('services.services')
    .factory('ServicesService', ServicesService);

  ServicesService.$inject = ['$resource', '$log'];

  function ServicesService($resource, $log) {
    var Service = $resource('/api/services/:serviceId', {
      serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Service.prototype, {
      createOrUpdate: function () {
        var service = this;
        return createOrUpdate(service);
      }
    });

    return Service;

    function createOrUpdate(service) {
      if (service._id) {
        return service.$update(onSuccess, onError);
      } else {
        return service.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(service) {
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
