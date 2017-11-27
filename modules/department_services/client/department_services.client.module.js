(function (app) {
  'use strict';

  app.registerModule('department_services', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('department_services.admin', ['core.admin']);
  app.registerModule('department_services.admin.routes', ['core.admin.routes']);
  app.registerModule('department_services.services');
  app.registerModule('department_services.routes', ['ui.router', 'core.routes', 'department_services.services']);
}(ApplicationConfiguration));
