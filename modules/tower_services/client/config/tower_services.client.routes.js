(function () {
  'use strict';

  angular
    .module('tower_services.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tower_services', {
        abstract: true,
        url: '/tower_services',
        template: '<ui-view/>'
      })
      .state('tower_services.list', {
        url: '',
        templateUrl: '/modules/tower_services/client/views/list-tower_services.client.view.html',
        controller: 'Tower_servicesListController',
        controllerAs: 'vm'
      })
      .state('tower_services.view', {
        url: '/:tower_serviceId',
        templateUrl: '/modules/tower_services/client/views/view-tower_service.client.view.html',
        controller: 'Tower_servicesController',
        controllerAs: 'vm',
        resolve: {
          tower_serviceResolve: getTower_service
        },
        data: {
          pageTitle: '{{ tower_serviceResolve.title }}'
        }
      });
  }

  getTower_service.$inject = ['$stateParams', 'Tower_servicesService'];

  function getTower_service($stateParams, Tower_servicesService) {
    return Tower_servicesService.get({
      tower_serviceId: $stateParams.tower_serviceId
    }).$promise;
  }
}());
