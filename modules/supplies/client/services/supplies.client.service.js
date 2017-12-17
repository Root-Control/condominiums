(function () {
  'use strict';

  angular
    .module('supplies.services')
    .factory('SuppliesService', SuppliesService);

  SuppliesService.$inject = ['$resource', '$log'];

  function SuppliesService($resource, $log) {
    var Supplie = $resource('/api/supplies/:supplieId', {
      supplieId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Supplie.prototype, {
      createOrUpdate: function () {
        var supplie = this;
        return createOrUpdate(supplie);
      }
    });

    return Supplie;

    function createOrUpdate(supplie) {
      if (supplie._id) {
        return supplie.$update(onSuccess, onError);
      } else {
        return supplie.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(supplie) {
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
