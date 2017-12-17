(function () {
  'use strict';

  // Configuring the Agreements Admin module
  angular
    .module('agreements.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar contratos',
      state: 'admin.agreements.list'
    });
  }
}());
