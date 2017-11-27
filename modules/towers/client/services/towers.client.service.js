(function () {
  'use strict';

  angular
    .module('towers.services')
    .factory('TowersService', TowersService);

  TowersService.$inject = ['$resource', '$log'];

  function TowersService($resource, $log) {
    var Tower = $resource('/api/towers/:towerId', {
      towerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Tower.prototype, {
      createOrUpdate: function () {
        var tower = this;
        return createOrUpdate(tower);
      }
    });

    return Tower;

    function createOrUpdate(tower) {
      if (tower._id) {
        return tower.$update(onSuccess, onError);
      } else {
        return tower.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(tower) {
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
