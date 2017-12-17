(function () {
  'use strict';
  angular
    .module('groups.services')
    .factory('CondominiumCustomService', CondominiumCustomService);

  CondominiumCustomService.$inject = ['$http'];

  function CondominiumCustomService($http) {
    var me = this;
    me.registerCondominiumServices = function (data, options) {
      $http.post('/api/condominiums/registerservices', data)
        .then(options.success, options.error);
    };
    return {
      registerCondominiumServices: me.registerCondominiumServices
    };
  }

}());
