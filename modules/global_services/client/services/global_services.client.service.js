(function () {
  'use strict';

  angular
    .module('global_services.services')
    .factory('Global_servicesService', Global_servicesService);

  Global_servicesService.$inject = ['$resource', '$log'];

  function Global_servicesService($resource, $log) {
    var Global_service = $resource('/api/global_services/:global_serviceId', {
      global_serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Global_service.prototype, {
      createOrUpdate: function () {
        var global_service = this;
        return createOrUpdate(global_service);
      }
    });

    return Global_service;

    function createOrUpdate(global_service) {
      if (global_service._id) {
        return global_service.$update(onSuccess, onError);
      } else {
        return global_service.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(global_service) {
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
