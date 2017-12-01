(function () {
  'use strict';

  angular
    .module('bill_sale_headers.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.bill_sale_headers', {
        abstract: true,
        url: '/bill_sale_headers',
        template: '<ui-view/>'
      })
      .state('admin.bill_sale_headers.list', {
        url: '',
        templateUrl: '/modules/bill_sale_headers/client/views/admin/list-bill_sale_headers.client.view.html',
        controller: 'Bill_sale_headersAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.bill_sale_headers.create', {
        url: '/create',
        templateUrl: '/modules/bill_sale_headers/client/views/admin/form-bill_sale_header.client.view.html',
        controller: 'Bill_sale_headersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          bill_sale_headerResolve: newBill_sale_header
        }
      })
      .state('admin.bill_sale_headers.edit', {
        url: '/:bill_sale_headerId/edit',
        templateUrl: '/modules/bill_sale_headers/client/views/admin/form-bill_sale_header.client.view.html',
        controller: 'Bill_sale_headersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ bill_sale_headerResolve.title }}'
        },
        resolve: {
          bill_sale_headerResolve: getBill_sale_header
        }
      });
  }

  getBill_sale_header.$inject = ['$stateParams', 'Bill_sale_headersService'];

  function getBill_sale_header($stateParams, Bill_sale_headersService) {
    return Bill_sale_headersService.get({
      bill_sale_headerId: $stateParams.bill_sale_headerId
    }).$promise;
  }

  newBill_sale_header.$inject = ['Bill_sale_headersService'];

  function newBill_sale_header(Bill_sale_headersService) {
    return new Bill_sale_headersService();
  }
}());
