(function () {
  'use strict';

  describe('Condominiums Route Tests', function () {
    // Initialize global variables
    var $scope,
      CondominiumsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CondominiumsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CondominiumsService = _CondominiumsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('condominiums');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/condominiums');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('condominiums.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/condominiums/client/views/list-condominiums.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CondominiumsController,
          mockCondominium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('condominiums.view');
          $templateCache.put('/modules/condominiums/client/views/view-condominium.client.view.html', '');

          // create mock condominium
          mockCondominium = new CondominiumsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Condominium about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CondominiumsController = $controller('CondominiumsController as vm', {
            $scope: $scope,
            condominiumResolve: mockCondominium
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:condominiumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.condominiumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            condominiumId: 1
          })).toEqual('/condominiums/1');
        }));

        it('should attach an condominium to the controller scope', function () {
          expect($scope.vm.condominium._id).toBe(mockCondominium._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/condominiums/client/views/view-condominium.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/condominiums/client/views/list-condominiums.client.view.html', '');

          $state.go('condominiums.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('condominiums/');
          $rootScope.$digest();

          expect($location.path()).toBe('/condominiums');
          expect($state.current.templateUrl).toBe('/modules/condominiums/client/views/list-condominiums.client.view.html');
        }));
      });
    });
  });
}());
