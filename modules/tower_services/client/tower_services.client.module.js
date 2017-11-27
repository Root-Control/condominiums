(function (app) {
  'use strict';

  app.registerModule('tower_services', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tower_services.admin', ['core.admin']);
  app.registerModule('tower_services.admin.routes', ['core.admin.routes']);
  app.registerModule('tower_services.services');
  app.registerModule('tower_services.routes', ['ui.router', 'core.routes', 'tower_services.services']);
}(ApplicationConfiguration));
