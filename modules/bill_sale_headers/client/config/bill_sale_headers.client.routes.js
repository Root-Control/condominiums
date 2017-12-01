(function () {
  'use strict';

  angular
    .module('bill_sale_headers.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bill_sale_headers', {
        abstract: true,
        url: '/bill_sale_headers',
        template: '<ui-view/>'
      })
      .state('bill_sale_headers.list', {
        url: '',
        templateUrl: '/modules/bill_sale_headers/client/views/list-bill_sale_headers.client.view.html',
        controller: 'Bill_sale_headersListController',
        controllerAs: 'vm'
      })
      .state('bill_sale_headers.view', {
        url: '/:bill_sale_headerId',
        templateUrl: '/modules/bill_sale_headers/client/views/view-bill_sale_header.client.view.html',
        controller: 'Bill_sale_headersController',
        controllerAs: 'vm',
        resolve: {
          bill_sale_headerResolve: getBill_sale_header
        },
        data: {
          pageTitle: '{{ bill_sale_headerResolve.title }}'
        }
      });
  }

  getBill_sale_header.$inject = ['$stateParams', 'Bill_sale_headersService'];

  function getBill_sale_header($stateParams, Bill_sale_headersService) {
    return Bill_sale_headersService.get({
      bill_sale_headerId: $stateParams.bill_sale_headerId
    }).$promise;
  }
}());
