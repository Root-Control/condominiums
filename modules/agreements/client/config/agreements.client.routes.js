(function () {
  'use strict';

  angular
    .module('agreements.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('agreements', {
        abstract: true,
        url: '/agreements',
        template: '<ui-view/>'
      })
      .state('agreements.list', {
        url: '',
        templateUrl: '/modules/agreements/client/views/list-agreements.client.view.html',
        controller: 'AgreementsListController',
        controllerAs: 'vm'
      })
      .state('agreements.view', {
        url: '/:agreementId',
        templateUrl: '/modules/agreements/client/views/view-agreement.client.view.html',
        controller: 'AgreementsController',
        controllerAs: 'vm',
        resolve: {
          agreementResolve: getAgreement
        },
        data: {
          pageTitle: '{{ agreementResolve.title }}'
        }
      });
  }

  getAgreement.$inject = ['$stateParams', 'AgreementsService'];

  function getAgreement($stateParams, AgreementsService) {
    return AgreementsService.get({
      agreementId: $stateParams.agreementId
    }).$promise;
  }
}());
