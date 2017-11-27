(function () {
  'use strict';

  angular
    .module('condominiums')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Condominios',
      state: 'condominiums',
      type: 'dropdown',
      roles: []
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'condominiums', {
      title: 'Listar condominios',
      state: 'condominiums.list',
      roles: []
    });
  }
}());
