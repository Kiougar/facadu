(function() {
    'use strict';

    angular.module('facadu.core')
        .directive('prongBubble', ProngBubbleDirective);

    //////////////

    ProngBubbleDirective.$inject = ['$mdUtil', 'PATHS'];

    function ProngBubbleDirective($mdUtil, PATHS) {
        //noinspection UnnecessaryLocalVariableJS
        var directive = {
            replace: true, // replace the element the directive is applied to
            //scope: true, // same scope for all prongBubble directives
            transclude: true,
            templateUrl: function () {
                return PATHS.templates + 'prongBubble.html';
            },
            scope: {
                pageX: '=',
                pageY: '='
            },
            controller: ProngController,
            controllerAs: 'vm',
            bindToController: true,
            link: ProngLinkFn
        };

        return directive;

        ////////////////

        //noinspection JSUnusedLocalSymbols
        function ProngLinkFn(scope, element, attrs, ctrl) {
            var prong = angular.element(element[0].querySelector('.prong'));
            var domBody = angular.element(document.body);

            // watch for pageX, pageY changes to move the bubble accordingly
            scope.$watchGroup(['vm.pageX','vm.pageY'], function() {
                setBubblePosition(ctrl.pageX, ctrl.pageY);
            });
            // always cleanup on destroy
            element.on('$destroy', unbindHandlers);
            setBubblePosition(ctrl.pageX, ctrl.pageY);
            bindHandlers();


            /////////////////////


            function setBubblePosition(pageX, pageY) {
                var bubbleRect = $mdUtil.clientRect(element[0]), prongRect = $mdUtil.clientRect(prong[0]);
                var bubbleTop = pageY - bubbleRect.height - prongRect.height;
                var bubbleLeft = pageX - bubbleRect.width / 2;
                // check if bubble fits top
                if (bubbleTop < 0) {
                    //  won't fit in the viewport, must appear below the mouse click
                    bubbleTop = pageY + prongRect.height;
                    prong.addClass('top-prong').removeClass('bottom-prong');
                } else {
                    prong.addClass('bottom-prong').removeClass('top-prong');
                }
                // check if bubble fits left and right
                var maxLeft = document.body.clientWidth - bubbleRect.width;
                bubbleLeft = Math.max(0, Math.min(maxLeft, bubbleLeft));
                // prong style
                var prongLeft = (pageX - bubbleLeft - prongRect.width / 2) + 'px';
                prong.css('left', prongLeft);
                // bubble style
                var bubbleStyle = {'top': bubbleTop + 'px', 'left': bubbleLeft + 'px'};
                element.css(bubbleStyle);
                element.focus();
            }

            function bindHandlers() {
                domBody.on('click', onClickOutsideFunction);
                element.on('keyup', onEscapeFunction);
            }

            function unbindHandlers() {
                domBody.off('click', onClickOutsideFunction);
                element.off('keyup', onEscapeFunction);
                // see bindHandlers function for why this is commented
                //element.off('blur', closeFunction);
            }

            function onClickOutsideFunction($event) {
                // if target is contained in the element do nothing
                if (element[0].contains($event.target)) return;
                var bRect = $mdUtil.clientRect(element[0]), pRect = $mdUtil.clientRect(prong[0]);
                var left = bRect.left, right = bRect.left + bRect.width;
                var top = prong.hasClass('bottom-prong') ? bRect.top : bRect.top - pRect.height;
                var bottom = top + bRect.height + pRect.height;
                //console.log(bRect, $event.pageX, left, right, $event.pageY, top, bottom);
                // check if we clicked outside of the bubble
                if ($event.pageX > right || $event.pageX < left ||
                    $event.pageY > bottom || $event.pageY < top) {
                    console.log('clicked outside!');
                    ctrl.closeFn();
                }
            }

            function onEscapeFunction($event) {
                if ($event.keyCode == '27') {
                    ctrl.closeFn();
                }
            }
        }
    }

    ProngController.$inject = ['$element'];

    function ProngController($element) {
        console.log('prong ctrl');
        this.closeFn = function() {
            console.log('prong closefn');
            $element.remove();
        }
    }
})();