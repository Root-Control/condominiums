(function () {
  'use strict';

  angular
    .module('services.services')
    .factory('CustomService', CustomService);

  CustomService.$inject = ['$http'];

  function CustomService($http) {
  	var me = this;
  	me.getUnregisteredServices = function(data, options) {
  		$http.post('/api/services/unregistered', data)
  			.then(options.success, options.error);
  	};

  	return {
  		unregisteredServices: me.getUnregisteredServices
  	}
  }
}());
