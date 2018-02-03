(function () {
  'use strict';

  angular
    .module('aditionals.services')
    .factory('AditionalsService', AditionalsService);

  AditionalsService.$inject = ['$http'];

  function AditionalsService($http) {
    var me = this;
    me.addAditional = function(data, options) {
      $http.post('/api/aditionals', data)
        .then(options.success, options.error);
    };

    me.listAditionals = function(data, options) {
      var query = '?month=' + data.month + '&year=' + data.year + '&department=' + data.department;
      $http.get('/api/aditionals' + query)
        .then(options.success, options.error);
    };

    me.deleteAditional = function(id, options) {
      $http.delete('/api/aditionals/' + id)
        .then(options.success, options.error);
    };

    return {
      listAditionals: me.listAditionals,
      addAditional: me.addAditional,
      deleteAditional: me.deleteAditional
    };
  }
}());
