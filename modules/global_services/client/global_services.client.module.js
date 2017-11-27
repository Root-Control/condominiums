(function (app) {
  'use strict';

  app.registerModule('global_services', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('global_services.admin', ['core.admin']);
  app.registerModule('global_services.admin.routes', ['core.admin.routes']);
  app.registerModule('global_services.services');
  app.registerModule('global_services.routes', ['ui.router', 'core.routes', 'global_services.services']);
}(ApplicationConfiguration));
