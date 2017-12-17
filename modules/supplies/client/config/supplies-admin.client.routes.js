(function () {
  'use strict';

  angular
    .module('supplies.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.supplies', {
        abstract: true,
        url: '/supplies',
        template: '<ui-view/>'
      })
      .state('admin.supplies.list', {
        url: '',
        templateUrl: '/modules/supplies/client/views/admin/list-supplies.client.view.html',
        controller: 'SuppliesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        }
      })
      .state('admin.supplies.create', {
        url: '/create',
        templateUrl: '/modules/supplies/client/views/admin/form-supplie.client.view.html',
        controller: 'SuppliesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        },
        resolve: {
          supplieResolve: newSupplie
        }
      })
      .state('admin.supplies.edit', {
        url: '/:supplieId/edit',
        templateUrl: '/modules/supplies/client/views/admin/form-supplie.client.view.html',
        controller: 'SuppliesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin'],
          pageTitle: '{{ supplieResolve.title }}'
        },
        resolve: {
          supplieResolve: getSupplie
        }
      });
  }

  getSupplie.$inject = ['$stateParams', 'SuppliesService'];

  function getSupplie($stateParams, SuppliesService) {
    return SuppliesService.get({
      supplieId: $stateParams.supplieId
    }).$promise;
  }

  newSupplie.$inject = ['SuppliesService'];

  function newSupplie(SuppliesService) {
    return new SuppliesService();
  }
}());
