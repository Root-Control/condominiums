(function () {
  'use strict';

  angular
    .module('agreements.services')
    .factory('AgreementsService', AgreementsService);

  AgreementsService.$inject = ['$resource', '$log'];

  function AgreementsService($resource, $log) {
    var Agreement = $resource('/api/agreements/:agreementId', {
      agreementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Agreement.prototype, {
      createOrUpdate: function () {
        var agreement = this;
        return createOrUpdate(agreement);
      }
    });

    return Agreement;

    function createOrUpdate(agreement) {
      if (agreement._id) {
        return agreement.$update(onSuccess, onError);
      } else {
        return agreement.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(agreement) {
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
