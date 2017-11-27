(function () {
  'use strict';

  angular
    .module('tower_services.services')
    .factory('Tower_servicesService', Tower_servicesService);

  Tower_servicesService.$inject = ['$resource', '$log'];

  function Tower_servicesService($resource, $log) {
    var Tower_service = $resource('/api/tower_services/:tower_serviceId', {
      tower_serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Tower_service.prototype, {
      createOrUpdate: function () {
        var tower_service = this;
        return createOrUpdate(tower_service);
      }
    });

    return Tower_service;

    function createOrUpdate(tower_service) {
      if (tower_service._id) {
        return tower_service.$update(onSuccess, onError);
      } else {
        return tower_service.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(tower_service) {
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
