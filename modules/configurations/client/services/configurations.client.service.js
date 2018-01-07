(function () {
  'use strict';

  angular
    .module('configurations.services')
    .factory('ConfigurationsService', ConfigurationsService);

  ConfigurationsService.$inject = ['$resource', '$log'];

  function ConfigurationsService($resource, $log) {
    var Configuration = $resource('/api/configurations/:configurationId', {
      configurationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Configuration.prototype, {
      createOrUpdate: function () {
        var configuration = this;
        return createOrUpdate(configuration);
      }
    });

    return Configuration;

    function createOrUpdate(configuration) {
      if (configuration._id) {
        return configuration.$update(onSuccess, onError);
      } else {
        return configuration.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(configuration) {
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
