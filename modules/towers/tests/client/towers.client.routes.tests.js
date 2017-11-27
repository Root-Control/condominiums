(function () {
  'use strict';

  describe('Towers Route Tests', function () {
    // Initialize global variables
    var $scope,
      TowersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TowersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TowersService = _TowersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('towers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/towers');
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
          liststate = $state.get('towers.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/towers/client/views/list-towers.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TowersController,
          mockTower;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('towers.view');
          $templateCache.put('/modules/towers/client/views/view-tower.client.view.html', '');

          // create mock tower
          mockTower = new TowersService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tower about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TowersController = $controller('TowersController as vm', {
            $scope: $scope,
            towerResolve: mockTower
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:towerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.towerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            towerId: 1
          })).toEqual('/towers/1');
        }));

        it('should attach an tower to the controller scope', function () {
          expect($scope.vm.tower._id).toBe(mockTower._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/towers/client/views/view-tower.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/towers/client/views/list-towers.client.view.html', '');

          $state.go('towers.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('towers/');
          $rootScope.$digest();

          expect($location.path()).toBe('/towers');
          expect($state.current.templateUrl).toBe('/modules/towers/client/views/list-towers.client.view.html');
        }));
      });
    });
  });
}());
