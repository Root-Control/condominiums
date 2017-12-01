(function (app) {
  'use strict';

  app.registerModule('service_consumptions', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('service_consumptions.admin', ['core.admin']);
  app.registerModule('service_consumptions.admin.routes', ['core.admin.routes']);
  app.registerModule('service_consumptions.services');
  app.registerModule('service_consumptions.routes', ['ui.router', 'core.routes', 'service_consumptions.services']);
}(ApplicationConfiguration));
