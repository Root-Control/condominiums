(function () {
  'use strict';

  angular
    .module('service_consumptions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('service_consumptions', {
        abstract: true,
        url: '/service_consumptions',
        template: '<ui-view/>'
      })
      .state('service_consumptions.list', {
        url: '',
        templateUrl: '/modules/service_consumptions/client/views/list-service_consumptions.client.view.html',
        controller: 'Service_consumptionsListController',
        controllerAs: 'vm'
      })
      .state('service_consumptions.view', {
        url: '/:service_consumptionId',
        templateUrl: '/modules/service_consumptions/client/views/view-service_consumption.client.view.html',
        controller: 'Service_consumptionsController',
        controllerAs: 'vm',
        resolve: {
          service_consumptionResolve: getService_consumption
        },
        data: {
          pageTitle: '{{ service_consumptionResolve.title }}'
        }
      });
  }

  getService_consumption.$inject = ['$stateParams', 'Service_consumptionsService'];

  function getService_consumption($stateParams, Service_consumptionsService) {
    return Service_consumptionsService.get({
      service_consumptionId: $stateParams.service_consumptionId
    }).$promise;
  }
}());
