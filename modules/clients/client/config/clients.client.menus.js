(function () {
  'use strict';

  angular
    .module('clients')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Clientes',
      state: 'clients',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'clients', {
      title: 'Listar Clientes',
      state: 'clients.list',
      roles: ['admin']
    });
  }
}());
