(function () {
  'use strict';

  angular
    .module('service_consumptions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Service_consumptions',
      state: 'service_consumptions',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'service_consumptions', {
      title: 'List Service_consumptions',
      state: 'service_consumptions.list',
      roles: ['']
    });
  }
}());
