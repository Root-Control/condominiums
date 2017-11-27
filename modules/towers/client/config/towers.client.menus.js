(function () {
  'use strict';

  angular
    .module('towers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Torres',
      state: 'towers',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'towers', {
      title: 'Listar torres',
      state: 'towers.list',
      roles: ['admin']
    });
  }
}());
