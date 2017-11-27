(function () {
  'use strict';

  angular
    .module('groups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Grupos',
      state: 'groups',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'groups', {
      title: 'Listar Grupos',
      state: 'groups.list',
      roles: ['admin']
    });
  }
}());
