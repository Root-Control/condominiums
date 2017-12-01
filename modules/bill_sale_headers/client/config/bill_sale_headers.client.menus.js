(function () {
  'use strict';

  angular
    .module('bill_sale_headers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Bill_sale_headers',
      state: 'bill_sale_headers',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'bill_sale_headers', {
      title: 'List Bill_sale_headers',
      state: 'bill_sale_headers.list',
      roles: ['']
    });
  }
}());
