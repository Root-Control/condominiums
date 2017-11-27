(function () {
  'use strict';
  angular
    .module('groups.services')
    .factory('CustomGroupsService', CustomGroupsService);

  CustomGroupsService.$inject = ['$http'];

  function CustomGroupsService($http) {
    var me = this;
    me.getGroupsByCondominiumId = function (id, options) {
      $http.post('/api/groupforcondominium', { condominiumId: id })
        .then(options.success, options.error);
    };
    return {
      getGroupsByCondominium: me.getGroupsByCondominiumId
    };
  }

}());
