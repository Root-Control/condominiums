(function () {
  'use strict';

  angular
    .module('agreements.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.agreements', {
        abstract: true,
        url: '/agreements',
        template: '<ui-view/>'
      })
      .state('admin.agreements.list', {
        url: '',
        templateUrl: '/modules/agreements/client/views/admin/list-agreements.client.view.html',
        controller: 'AgreementsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        }
      })
      .state('admin.agreements.create', {
        url: '/create',
        templateUrl: '/modules/agreements/client/views/admin/form-agreement.client.view.html',
        controller: 'AgreementsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        },
        resolve: {
          agreementResolve: newAgreement
        }
      })
      .state('admin.agreements.edit', {
        url: '/:agreementId/edit',
        templateUrl: '/modules/agreements/client/views/admin/form-agreement.client.view.html',
        controller: 'AgreementsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin'],
          pageTitle: '{{ agreementResolve.title }}'
        },
        resolve: {
          agreementResolve: getAgreement
        }
      });
  }

  getAgreement.$inject = ['$stateParams', 'AgreementsService'];

  function getAgreement($stateParams, AgreementsService) {
    return AgreementsService.get({
      agreementId: $stateParams.agreementId
    }).$promise;
  }

  newAgreement.$inject = ['AgreementsService'];

  function newAgreement(AgreementsService) {
    return new AgreementsService();
  }
}());
