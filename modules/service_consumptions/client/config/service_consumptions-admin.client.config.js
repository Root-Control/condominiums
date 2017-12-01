(function () {
  'use strict';

  // Configuring the Service_consumptions Admin module
  angular
    .module('service_consumptions.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Service_consumptions',
      state: 'admin.service_consumptions.list'
    });
  }
}());
