(function () {
  'use strict';

  angular
    .module('supplies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Supplies',
      state: 'supplies',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'supplies', {
      title: 'List Supplies',
      state: 'supplies.list',
      roles: ['']
    });
  }
}());
