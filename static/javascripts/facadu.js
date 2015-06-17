(function() {
    "use strict";

    var app = angular.module('FacaduApp', ['ngMaterial', 'ngRoute']);

    app.paths = {};
    app.paths.root = '/';
    app.paths.templates = app.paths.root + 'static/templates/';

    app.config(function ($mdThemingProvider, $routeProvider, $locationProvider, MENU) {
        //$mdThemingProvider.theme('default')
        //    .primaryPalette('deep-purple')
        //    .accentPalette('amber');

        $routeProvider
            .when('/', {
                templateUrl: app.paths.templates + 'construction.html'
            })
            .otherwise('/');
        var menuTypeToCtrlName = function (type) {
            if (!type) return null;
            return type.charAt(0).toUpperCase() + type.slice(1) + 'Ctrl';
        };
        angular.forEach(MENU, function (item) {
            var routeObj = {
                templateUrl: app.paths.templates + item.template,
                controller: menuTypeToCtrlName(item.type)
            };
            $routeProvider.when(item.url, routeObj);
        });
        $locationProvider.html5Mode(true).hashPrefix('!');
    });
    app.constant('MENU', [
        {label: 'Family Calendar', url: '/fc', template: 'calendarMonthView.html', type: 'calendar'},
        {label: 'Personal Calendar', url: '/pc', template: 'calendarMonthView.html', type: 'calendar'},
        {label: 'ToDo list', url: '/tl', template: 'construction.html'},
        {label: 'Shopping list', url: '/sl', template: 'construction.html'},
        {label: 'Meal plan', url: '/mp', template: 'construction.html'},
        {label: 'Edit Profile', url: '/ep', template: 'construction.html'},
        {label: 'Edit Family', url: '/ef', template: 'construction.html'},
        {label: 'Chat', url: '/ct', template: 'construction.html'},
        {label: 'Help', url: '/hp', template: 'construction.html'}
    ]);
    app.constant('MORE', [
        {label: 'Logout', ligature: 'exit_to_app'},
        //{label: 'About', ligature: ''},
        //{label: 'Export'},
        {label: 'Print', ligature: 'print'}
    ]);
    app.controller('AppCtrl', ['MENU', 'MORE', '$scope', '$timeout', '$mdMedia', '$mdSidenav', '$rootScope','$location',
        function (MENU, MORE, $scope, $timeout, $mdMedia, $mdSidenav, $rootScope, $location) {
            $scope.paths = app.paths;
            $scope.menuItems = MENU;
            $scope.moreItems = MORE;
            $rootScope.$on('$routeChangeSuccess', function ($event) {
                var path = $location.path();
                if (path == '/') {
                    $scope.currentMenu = null;
                } else {
                    MENU.forEach(function (item) {
                        if (item.url === path) {
                            $scope.currentMenu = item;
                        }
                    });
                }
            });
            $scope.$location = $location;
            $scope.shouldLockOpen = true;
            $scope.toggleSidenav = function (menuId) {
                if (!$mdMedia('gt-lg')) {
                    $mdSidenav(menuId).toggle();
                } else {
                    $scope.shouldLockOpen = !$scope.shouldLockOpen;
                }
            };
            $scope.isArrowToggled = function () {
                return $scope.shouldLockOpen && $mdMedia('gt-lg');
            };
            $scope.doPrint = function () {
                $timeout(function() {
                    window.print();
                });
            };
        }]);
    app.controller('CalendarCtrl', function ($scope, $compile) {
        $scope.clickedEventBadge = function ($event, day) {
            console.log('clicked badge');
        };
        var clickedDayScope = $scope.$new(true);
        $scope.clickedDay = function ($event, day) {
            if (day.events.length === 0) {
                // This is an empty date, update clickedDayScope to move the bubble if it exists. Else, compile it.
                clickedDayScope.pageX = $event.pageX;
                clickedDayScope.pageY = $event.pageY;
                var bub = document.getElementById('cal-bubble');
                if (!bub) {
                    bub = angular.element('<prong-bubble><quick-edit-bubble></quick-edit-bubble></prong-bubble>');
                    $compile(bub)(clickedDayScope);
                    document.body.appendChild(bub[0]);
                }
            } else {
                // Handle event clicks here
                console.log('Event target:', $event.target);
            }
        };
        $scope.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $scope.monthWeeks = [];
        var eventsList = [{title: 'Event title!'}, {title: 'Event2 title!'}, {title: 'Event3 has a pretty long title!'}];
        var randomStartingDay = Math.floor(Math.random() * (4 + 1)) + 25; // random integer in [25, 29]
        for (var i = 0; i < 5; i++) {
            $scope.monthWeeks[i] = {days: []};
            for (var j = 0; j < 7; j++) {
                $scope.monthWeeks[i].days.push({
                    label: (i * 7 + j + randomStartingDay) % 30 + 1,
                    events: eventsList.slice(0, Math.floor(Math.random() * (eventsList.length + 1)))
                });
            }
        }
    })
})();