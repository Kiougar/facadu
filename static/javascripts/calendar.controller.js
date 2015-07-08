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

        vm.picker = new Date();

        vm.activate = activate;
        vm.title = 'CalendarCtrl';
        vm.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        vm.monthWeeks = [];
        vm.prevMonth = prevMonth;
        vm.nextMonth = nextMonth;
        vm.clickedDay = clickedDay;
        vm.clickedEventBadge = clickedEventBadge;
        vm.createOrEditEvent = createOrEditEvent;
        vm.refreshEvents = refreshEvents;

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
            // will run at least once because of ng-model
            $scope.$watch('vm.picker', refreshEvents);
        }

        function refreshEvents() {
            console.log('refresh events:', vm.picker);
            vm.calDays = parseEvents(vm.picker.getFullYear(), vm.picker.getMonth());
        }

        function prevMonth() {
            var res = new Date(vm.picker);
            var curr = vm.picker.getMonth();
            if (curr == 0) {
                res.setFullYear(vm.picker.getFullYear() - 1);
                res.setMonth(11);
            } else {
                res.setMonth(curr - 1);
            }
            vm.picker = res;
        }

        function nextMonth() {
            var res = new Date(vm.picker);
            var curr = vm.picker.getMonth();
            if (curr == 11) {
                res.setFullYear(vm.picker.getFullYear() + 1);
                res.setMonth(0);
            } else {
                res.setMonth(curr + 1);
            }
            vm.picker = res;
        }

        function parseEvents(year, month, date) {
            // start day is Monday
            var startDay = 1;
            var events = [
                {title: 'Event title!', start: new Date(2015, 6, 2), end: new Date(2015, 6, 3)},
                {title: 'Event2 title!', start: new Date(2015, 6, 6), end: new Date(2015, 6, 6)},
                {title: 'Event3 has a pretty long title!', start: new Date(2015, 6, 20), end: new Date(2015, 6, 26)}
            ];

            var i, fDay, prevDays = 0, currentDays = 1, nextDays = 0;
            if (date === undefined) {
                // find first day of month
                fDay = new Date(year, month, 1).getDay();
                // calculate number of days of previous/current/next month to retrieve
                prevDays = (fDay - startDay + 7) % 7;
                currentDays = new Date(year, month + 1, 0).getDate();
                //nextDays = 6 - (lDay - startDay + 7) % 7;
                nextDays = 35 - currentDays - prevDays;
                console.log(fDay, prevDays, currentDays, nextDays);
            }

            // initialize result
            var res = [];
            for (i = 0; i < prevDays + currentDays + nextDays; i++) {
                // create day
                var day = {
                    date: new Date(year, month, i - prevDays + 1),
                    events: []
                };
                // append day to result
                res.push(day);
            }

            // attach events to result
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var idx = startDateIndex(event);
                console.log(event, idx);
                if (idx != -1) {
                    while (res[idx].date >= event.start && res[idx].date <= event.end) {
                        res[idx].events.push(event);
                        idx++;
                    }
                }
            }

            return res;

            function startDateIndex(e) {
                // do nothing if start date is larger than last day of calendar
                if (e.start > res[res.length - 1].date || e.end < res[0].date) return -1;

                var d = e.start;
                if (d.getMonth() == month) {
                    return d.getDate() - 1 + prevDays;
                } else if (d.getMonth() > month) {
                    return d.getDate() - 1 + prevDays + currentDays;
                } else {
                    return d.getDate() - new Date(year, month - 2, 0).getDate() + prevDays;
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
                    from: new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate()),
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