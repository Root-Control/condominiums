(function () {
  'use strict';

  angular
    .module('condominiums.services')
    .factory('CondominiumsService', CondominiumsService);

  CondominiumsService.$inject = ['$resource', '$log'];

  function CondominiumsService($resource, $log) {
    var Condominium = $resource('/api/condominiums/:condominiumId', {
      condominiumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Condominium.prototype, {
      createOrUpdate: function () {
        var condominium = this;
        return createOrUpdate(condominium);
      }
    });

    return Condominium;

    function createOrUpdate(condominium) {
      if (condominium._id) {
        return condominium.$update(onSuccess, onError);
      } else {
        return condominium.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(condominium) {
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
