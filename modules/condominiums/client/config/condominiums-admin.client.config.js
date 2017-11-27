(function () {
  'use strict';

  // Configuring the Condominiums Admin module
  angular
    .module('condominiums.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar condominios',
      state: 'admin.condominiums.list'
    });
  }
}());
