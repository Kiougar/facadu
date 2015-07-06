(function() {
    'use strict';

    angular
        .module('facadu')
        .factory('CalendarService', CalendarService);

    CalendarService.$inject = ['$log'];

    /* @ngInject */
    function CalendarService($log) {
        var service = {
            createOrEditEvent: createOrEditEvent,
            deleteEvent: deleteEvent
        };

        return service;

        ////////////////

        function createOrEditEvent(event) {
            $log.info('create/edit event: ', event);
        }

        function deleteEvent(event) {
            $log.info('delete event: ', event);
        }


    }

})();