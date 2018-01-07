(function () {
  'use strict';

  angular
    .module('configurations.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.configurations', {
        abstract: true,
        url: '/configurations',
        template: '<ui-view/>'
      })
      .state('admin.configurations.list', {
        url: '',
        templateUrl: '/modules/configurations/client/views/admin/list-configurations.client.view.html',
        controller: 'ConfigurationsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        }
      })
      .state('admin.configurations.create', {
        url: '/create',
        templateUrl: '/modules/configurations/client/views/admin/form-configuration.client.view.html',
        controller: 'ConfigurationsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        },
        resolve: {
          configurationResolve: newConfiguration
        }
      })
      .state('admin.configurations.edit', {
        url: '/:configurationId/edit',
        templateUrl: '/modules/configurations/client/views/admin/form-configuration.client.view.html',
        controller: 'ConfigurationsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin'],
          pageTitle: '{{ configurationResolve.title }}'
        },
        resolve: {
          configurationResolve: getConfiguration
        }
      });
  }

  getConfiguration.$inject = ['$stateParams', 'ConfigurationsService'];

  function getConfiguration($stateParams, ConfigurationsService) {
    return ConfigurationsService.get({
      configurationId: $stateParams.configurationId
    }).$promise;
  }

  newConfiguration.$inject = ['ConfigurationsService'];

  function newConfiguration(ConfigurationsService) {
    return new ConfigurationsService();
  }
}());
