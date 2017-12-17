(function () {
  'use strict';

  angular
    .module('agreements')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Contratos',
      state: 'agreements',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'agreements', {
      title: 'Listar contratos',
      state: 'agreements.list',
      roles: ['']
    });
  }
}());
