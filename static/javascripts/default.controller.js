(function() {
    'use strict';

    angular
        .module('facadu')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['PATHS', 'MENU', 'MORE', '$scope', '$window', '$timeout', '$mdMedia', '$mdSidenav', '$rootScope','$location'];

    /* @ngInject */
    function AppCtrl(PATHS, MENU, MORE, $scope, $window, $timeout, $mdMedia, $mdSidenav, $rootScope, $location) {
        /* jshint validthis: true */
        var vm = this;
        var time = new Date();

        // time specific
        vm.time = time;
        vm.date  = time.getDate();
        vm.month = time.getMonth();
        vm.year  = time.getYear();
        vm.hour = time.getHours();
        vm.mins  = time.getMinutes();

        vm.activate = activate;
        vm.title = 'AppCtrl';
        vm.paths = PATHS;
        vm.menuItems = MENU;
        vm.moreItems = MORE;
        vm.shouldLockOpen = true;
        vm.toggleSidenav = toggleSidenav;
        vm.isArrowToggled = isArrowToggled;
        vm.doPrint = doPrint;

        activate();

        ////////////////

        function activate() {
            $rootScope.$on('$routeChangeSuccess', rootChangeHandler);
        }

        function rootChangeHandler() {
            var path = $location.path();
            if (path == '/') {
                vm.currentMenu = null;
            } else {
                MENU.forEach(function (item) {
                    if (item.url === path) {
                        vm.currentMenu = item;
                    }
                });
            }
        }

        function toggleSidenav(menuId) {
            if (!$mdMedia('gt-lg')) {
                $mdSidenav(menuId).toggle();
            } else {
                vm.shouldLockOpen = !vm.shouldLockOpen;
            }
        }

        function isArrowToggled() {
            return vm.shouldLockOpen && $mdMedia('gt-lg');
        }

        function doPrint() {
            $timeout(function() {$window.print()});
        }


    }
})();