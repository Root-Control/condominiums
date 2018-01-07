(function () {
  'use strict';

  // Configuring the Configurations Admin module
  angular
    .module('configurations.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Configuración de pago',
      state: 'admin.configurations.list'
    });
  }
}());
