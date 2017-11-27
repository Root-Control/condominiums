(function (app) {
  'use strict';

  app.registerModule('group_services', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('group_services.admin', ['core.admin']);
  app.registerModule('group_services.admin.routes', ['core.admin.routes']);
  app.registerModule('group_services.services');
  app.registerModule('group_services.routes', ['ui.router', 'core.routes', 'group_services.services']);
}(ApplicationConfiguration));
