(function () {
  'use strict';

  // Configuring the Clients Admin module
  angular
    .module('clients.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar clientes',
      state: 'admin.clients.list'
    });
  }
}());
