(function () {
  'use strict';

  angular
    .module('configurations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Configurations',
      state: 'configurations',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'configurations', {
      title: 'List Configurations',
      state: 'configurations.list',
      roles: ['']
    });
  }
}());
