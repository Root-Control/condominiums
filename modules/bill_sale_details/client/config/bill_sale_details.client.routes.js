(function () {
  'use strict';

  angular
    .module('bill_sale_details.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bill_sale_details', {
        abstract: true,
        url: '/bill_sale_details',
        template: '<ui-view/>'
      })
      .state('bill_sale_details.list', {
        url: '',
        templateUrl: '/modules/bill_sale_details/client/views/list-bill_sale_details.client.view.html',
        controller: 'Bill_sale_detailsListController',
        controllerAs: 'vm'
      })
      .state('bill_sale_details.view', {
        url: '/:bill_sale_detailId',
        templateUrl: '/modules/bill_sale_details/client/views/view-bill_sale_detail.client.view.html',
        controller: 'Bill_sale_detailsController',
        controllerAs: 'vm',
        resolve: {
          bill_sale_detailResolve: getBill_sale_detail
        },
        data: {
          pageTitle: '{{ bill_sale_detailResolve.title }}'
        }
      });
  }

  getBill_sale_detail.$inject = ['$stateParams', 'Bill_sale_detailsService'];

  function getBill_sale_detail($stateParams, Bill_sale_detailsService) {
    return Bill_sale_detailsService.get({
      bill_sale_detailId: $stateParams.bill_sale_detailId
    }).$promise;
  }
}());
