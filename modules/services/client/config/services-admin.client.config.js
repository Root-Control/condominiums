(function () {
  'use strict';

  // Configuring the Services Admin module
  angular
    .module('services.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Servicios',
      state: 'admin.services.list'
    });
  }
}());
