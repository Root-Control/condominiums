(function () {
  'use strict';

  angular
    .module('condominiums.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.condominiums', {
        abstract: true,
        url: '/condominiums',
        template: '<ui-view/>'
      })
      .state('admin.condominiums.list', {
        url: '',
        templateUrl: '/modules/condominiums/client/views/admin/list-condominiums.client.view.html',
        controller: 'CondominiumsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin']
        }
      })
      .state('admin.condominiums.create', {
        url: '/create',
        templateUrl: '/modules/condominiums/client/views/admin/form-condominium.client.view.html',
        controller: 'CondominiumsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin']
        },
        resolve: {
          condominiumResolve: newCondominium
        }
      })
      .state('admin.condominiums.edit', {
        url: '/:condominiumId/edit',
        templateUrl: '/modules/condominiums/client/views/admin/form-condominium.client.view.html',
        controller: 'CondominiumsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin'],
          pageTitle: '{{ condominiumResolve.name }}'
        },
        resolve: {
          condominiumResolve: getCondominium
        }
      });
  }

  getCondominium.$inject = ['$stateParams', 'CondominiumsService'];

  function getCondominium($stateParams, CondominiumsService) {
    return CondominiumsService.get({
      condominiumId: $stateParams.condominiumId
    }).$promise;
  }

  newCondominium.$inject = ['CondominiumsService'];

  function newCondominium(CondominiumsService) {
    return new CondominiumsService();
  }
}());
