(function () {
  'use strict';

  angular
    .module('global_services.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('global_services', {
        abstract: true,
        url: '/global_services',
        template: '<ui-view/>'
      })
      .state('global_services.list', {
        url: '',
        templateUrl: '/modules/global_services/client/views/list-global_services.client.view.html',
        controller: 'Global_servicesListController',
        controllerAs: 'vm'
      })
      .state('global_services.view', {
        url: '/:global_serviceId',
        templateUrl: '/modules/global_services/client/views/view-global_service.client.view.html',
        controller: 'Global_servicesController',
        controllerAs: 'vm',
        resolve: {
          global_serviceResolve: getGlobal_service
        },
        data: {
          pageTitle: '{{ global_serviceResolve.title }}'
        }
      });
  }

  getGlobal_service.$inject = ['$stateParams', 'Global_servicesService'];

  function getGlobal_service($stateParams, Global_servicesService) {
    return Global_servicesService.get({
      global_serviceId: $stateParams.global_serviceId
    }).$promise;
  }
}());
