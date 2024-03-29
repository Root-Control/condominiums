'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core-default.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderDefaultServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderDefaultNotFound);

  // Define application route
  app.route('/dashboard').get(core.renderAdminIndex);
  app.route('/dashboard/*').get(core.renderAdminIndex);
  app.route('/*').get(core.renderDefaultIndex);
};
