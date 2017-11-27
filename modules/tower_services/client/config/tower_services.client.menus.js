(function () {
  'use strict';

  angular
    .module('tower_services')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tower_services',
      state: 'tower_services',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tower_services', {
      title: 'List Tower_services',
      state: 'tower_services.list',
      roles: ['']
    });
  }
}());
