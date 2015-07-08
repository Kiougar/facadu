(function () {
    "use strict";

    var paths = {};
    paths.root = '/';
    paths.templates = paths.root + 'static/templates/';

    var menu = [
        {label: 'Family Calendar', url: '/fc', template: 'calendar.html', type: 'calendar'},
        {label: 'Personal Calendar', url: '/pc', template: 'calendarMonthView.html', type: 'calendar'},
        {label: 'ToDo list', url: '/tl', template: 'construction.html'},
        {label: 'Shopping list', url: '/sl', template: 'construction.html'},
        {label: 'Meal plan', url: '/mp', template: 'construction.html'},
        {label: 'Edit Profile', url: '/ep', template: 'construction.html'},
        {label: 'Edit Family', url: '/ef', template: 'construction.html'},
        {label: 'Chat', url: '/ct', template: 'construction.html'},
        {label: 'Help', url: '/hp', template: 'construction.html'}
    ];

    var more = [
        {label: 'Logout', ligature: 'exit_to_app'},
        //{label: 'About', ligature: ''},
        //{label: 'Export'},
        {label: 'Print', ligature: 'print'}
    ];

    angular.module('facadu')
        .constant('PATHS', paths)
        .constant('MENU', menu)
        .constant('MORE', more)

        .config(configFn)

    configFn.$inject = ['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', 'PATHS', 'MENU'];

    function configFn($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider, PATHS, MENU) {
        //$mdThemingProvider.theme('default')
        //    .primaryPalette('deep-purple')
        //    .accentPalette('amber');

        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);


        $locationProvider.html5Mode(true).hashPrefix('!');
        $routeProvider
            .when('/', {
                templateUrl: PATHS.templates + 'construction.html'
            })
            .when('/create', {
                templateUrl: PATHS.templates + 'edit.html',
                controller: 'editCtrl',
                controllerAs: 'vm'
            })
            .when('/edit/:id', {
                templateUrl: PATHS.templates + 'edit.html',
                controller: 'editCtrl',
                controllerAs: 'vm'
            })
            .when('/edit/:id/:data*', {
                templateUrl: PATHS.templates + 'edit.html',
                controller: 'editCtrl',
                controllerAs: 'vm'
            })
            .otherwise('/');

        configMenuRoutes();

        /////////////////////

        function configMenuRoutes() {
            angular.forEach(MENU, function (item) {
                var routeObj = {
                    templateUrl: PATHS.templates + item.template,
                    controller: menuTypeToCtrlName(item.type),
                    controllerAs: 'vm'
                };
                $routeProvider.when(item.url, routeObj);
            });

            function menuTypeToCtrlName(type) {
                if (!type) return null;
                return type.charAt(0).toUpperCase() + type.slice(1) + 'Ctrl';
            }
        }

    }
})();
