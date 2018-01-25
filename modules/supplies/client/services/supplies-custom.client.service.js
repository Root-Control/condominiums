(function () {
  'use strict';

  angular
    .module('service_consumptions.services')
    .factory('CustomSupply', CustomSupply);

  CustomSupply.$inject = ['$http'];

  function CustomSupply($http) {
  	var me = this;
  	me.changeStatus = function(data, options) {
  		$http.put('/api/supplies/' + data._id, data)
  			.then(options.success, options.error);
  	};

  	me.deleteSupply = function(data, options) {
  		$http.delete('/api/supplies/' + data._id, data)
  			.then(options.success, options.error);
  	};
  	return {
  		changeStatus: me.changeStatus,
  		deleteSupply: me.deleteSupply
  	};
  }
}());
