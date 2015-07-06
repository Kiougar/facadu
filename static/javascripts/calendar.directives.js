(function () {
    "use strict";
    angular.module('facadu')
        .directive('quickEditBubble', QuickEditDirective);

    /////////////////

    QuickEditDirective.$inject = ['PATHS'];

    function QuickEditDirective(PATHS) {
        //noinspection UnnecessaryLocalVariableJS
        var directive = {
            replace: true,
            require: ['quickEditBubble', '?^prongBubble'],
            templateUrl: function () {
                return PATHS.templates + 'quickEditBubble.html';
            },
            scope: {
                newEvent: '=',
                onSave: '&'
            },
            controller: QuickEditController,
            controllerAs: 'vm',
            bindToController: true,
            link: QuickEditLinkFn
        };

        return directive;

        ///////////////////

        //noinspection JSUnusedLocalSymbols
        function QuickEditLinkFn(scope, element, attrs, controllers) {
            var quickCtrl = controllers[0],
                prongCtrl = controllers[1];

            quickCtrl.quickEditSubmitted = quickEditSubmitted;

            /////////////

            function quickEditSubmitted() {
                quickCtrl.onSave();
                if (prongCtrl && prongCtrl.closeFn) prongCtrl.closeFn();
            }
        }
    }

    QuickEditController.$inject = ['CalendarService'];

    function QuickEditController(CalendarService) {
        var vm = this;
        vm.saveEvent = CalendarService.createOrEditEvent;
    }

})();
