(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/core/client/views/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: '/modules/core/client/views/dashboard/dashboard.client.view.html',
        controller: 'DashBoardController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin', 'admin', 'c-admin']
        }       
      })
      .state('condominium-service', {
        url: '/dashboard/condominium-service',
        templateUrl: '/modules/core/client/views/dashboard/condominium-service.client.view.html',
        controller: 'CondominiumServiceController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin', 'admin', 'c-admin']
        }       
      })
      .state('condominium-config', {
        url: '/dashboard/condominium-config',
        templateUrl: '/modules/core/client/views/dashboard/condominium-config.client.view.html',
        controller: 'CondominiumConfigController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin', 'admin', 'c-admin']
        }       
      })      
      .state('aqua-service', {
        url: '/dashboard/aqua-service',
        templateUrl: '/modules/core/client/views/dashboard/aqua-service.client.view.html',
        controller: 'AquaController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin', 'admin', 'c-admin']
        }       
      })
      .state('payment-register', {
        url: '/dashboard/payment-register',
        templateUrl: '/modules/core/client/views/dashboard/payment-register.client.view.html',
        controller: 'PaymentRegisterController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin', 'admin', 'c-admin']
        }       
      })
      .state('payment-monthly', {
        url: '/dashboard/payment-monthly',
        templateUrl: '/modules/core/client/views/dashboard/payment-monthly.client.view.html',
        controller: 'MonthlyPaymentRegisterController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin', 'admin', 'c-admin']
        }       
      })            
      .state('not-found', {
        url: '/not-found',
        templateUrl: '/modules/core/client/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function ($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: '/modules/core/client/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function ($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: '/modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }
}());
