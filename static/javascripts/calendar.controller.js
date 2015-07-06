(function() {
    "use strict";

    angular
        .module('facadu')
        .controller('CalendarCtrl', CalendarCtrl);

    CalendarCtrl.$inject = ['$scope', '$compile'];

    /* @ngInject */
    function CalendarCtrl($scope, $compile) {
        console.log('CalendarCtrl');
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'CalendarCtrl';
        vm.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        vm.displaMode = 'create';
        vm.monthWeeks = [];
        vm.clickedDay = clickedDay;
        vm.clickedEventBadge = clickedEventBadge;
        vm.createOrEditEvent = createOrEditEvent;

        // clicked scope
        var clickedDayScope = $scope.$new(true);

        activate();

        ////////////////

        function setFirstDayOfWeek(day) {
            if (angular.isNumber(day) && day > 0 && day < 7) {
                var x = vm.weekDays.splice(day, 7 - day);
                vm.weekDays = x.concat(vm.weekDays);
            }
        }


        function activate() {
            // create monthWeeks
            var eventsList = [{title: 'Event title!'}, {title: 'Event2 title!'}, {title: 'Event3 has a pretty long title!'}];
            var randomStartingDay = Math.floor(Math.random() * (4 + 1)) + 25; // random integer in [25, 29]
            for (var i = 0; i < 5; i++) {
                vm.monthWeeks[i] = {days: []};
                for (var j = 0; j < 7; j++) {
                    vm.monthWeeks[i].days.push({
                        label: (i * 7 + j + randomStartingDay) % 30 + 1,
                        events: eventsList.slice(0, Math.floor(Math.random() * (eventsList.length + 1)))
                    });
                }
            }
        }

        function createOrEditEvent(newEvent) {
            console.log('calendar ctrl: createOrEditEvent', newEvent);
        }

        function clickedDay($event, day) {
            if (day.events.length === 0) {
                // This is an empty date, update clickedDayScope to move the bubble if it exists. Else, compile it.
                clickedDayScope.pageX = $event.pageX;
                clickedDayScope.pageY = $event.pageY;
                clickedDayScope.newEvent = {
                    from: new Date(2015, 6, day.label),
                    title: 'Test Title'
                };
                clickedDayScope.onSave = createOrEditEvent;
                var bub = document.getElementById('cal-bubble');
                //if (bub) bub.remove();
                if (!bub) {
                    bub = angular.element('<prong-bubble page-x="pageX" page-y="pageY"><quick-edit-bubble new-event="newEvent" on-save="onSave(newEvent)"></quick-edit-bubble></prong-bubble>');
                    $compile(bub)(clickedDayScope);
                    document.body.appendChild(bub[0]);
                }
            } else {
                // Handle event clicks here
                console.log('Event target:', $event.target);
            }
        }

        function clickedEventBadge($event, day) {
            console.log('clicked badge');
        }
    }
})();