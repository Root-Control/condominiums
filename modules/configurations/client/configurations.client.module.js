(function (app) {
  'use strict';

  app.registerModule('configurations', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('configurations.admin', ['core.admin']);
  app.registerModule('configurations.admin.routes', ['core.admin.routes']);
  app.registerModule('configurations.services');
  app.registerModule('configurations.routes', ['ui.router', 'core.routes', 'configurations.services']);
}(ApplicationConfiguration));
