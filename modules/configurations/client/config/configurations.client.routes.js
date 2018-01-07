(function () {
  'use strict';

  angular
    .module('configurations.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('configurations', {
        abstract: true,
        url: '/configurations',
        template: '<ui-view/>'
      })
      .state('configurations.list', {
        url: '',
        templateUrl: '/modules/configurations/client/views/list-configurations.client.view.html',
        controller: 'ConfigurationsListController',
        controllerAs: 'vm'
      })
      .state('configurations.view', {
        url: '/:configurationId',
        templateUrl: '/modules/configurations/client/views/view-configuration.client.view.html',
        controller: 'ConfigurationsController',
        controllerAs: 'vm',
        resolve: {
          configurationResolve: getConfiguration
        },
        data: {
          pageTitle: '{{ configurationResolve.title }}'
        }
      });
  }

  getConfiguration.$inject = ['$stateParams', 'ConfigurationsService'];

  function getConfiguration($stateParams, ConfigurationsService) {
    return ConfigurationsService.get({
      configurationId: $stateParams.configurationId
    }).$promise;
  }
}());
