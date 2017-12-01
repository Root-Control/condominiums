(function () {
  'use strict';

  angular
    .module('services.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('services', {
        abstract: true,
        url: '/services',
        template: '<ui-view/>'
      })
      .state('services.list', {
        url: '',
        templateUrl: '/modules/services/client/views/list-services.client.view.html',
        controller: 'ServicesListController',
        controllerAs: 'vm'
      })
      .state('services.view', {
        url: '/:serviceId',
        templateUrl: '/modules/services/client/views/view-service.client.view.html',
        controller: 'ServicesController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: getService
        },
        data: {
          pageTitle: '{{ serviceResolve.title }}'
        }
      });
  }

  getService.$inject = ['$stateParams', 'ServicesService'];

  function getService($stateParams, ServicesService) {
    return ServicesService.get({
      serviceId: $stateParams.serviceId
    }).$promise;
  }
}());
