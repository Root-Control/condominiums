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
          mainstate = $state.get('admin.towers');
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
          liststate = $state.get('admin.towers.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/towers/client/views/admin/list-towers.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TowersAdminController,
          mockTower;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.towers.create');
          $templateCache.put('/modules/towers/client/views/admin/form-tower.client.view.html', '');

          // Create mock tower
          mockTower = new TowersService();

          // Initialize Controller
          TowersAdminController = $controller('TowersAdminController as vm', {
            $scope: $scope,
            towerResolve: mockTower
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.towerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/towers/create');
        }));

        it('should attach an tower to the controller scope', function () {
          expect($scope.vm.tower._id).toBe(mockTower._id);
          expect($scope.vm.tower._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/towers/client/views/admin/form-tower.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TowersAdminController,
          mockTower;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.towers.edit');
          $templateCache.put('/modules/towers/client/views/admin/form-tower.client.view.html', '');

          // Create mock tower
          mockTower = new TowersService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tower about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TowersAdminController = $controller('TowersAdminController as vm', {
            $scope: $scope,
            towerResolve: mockTower
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:towerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.towerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            towerId: 1
          })).toEqual('/admin/towers/1/edit');
        }));

        it('should attach an tower to the controller scope', function () {
          expect($scope.vm.tower._id).toBe(mockTower._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/towers/client/views/admin/form-tower.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
