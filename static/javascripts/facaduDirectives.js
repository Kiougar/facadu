(function () {
    "use strict";
    var app = angular.module('FacaduApp');
    app.directive('quickEditBubble', function () {
        return {
            replace: true,
            templateUrl: function () {
                return app.paths.templates + 'quickEditBubble.html';
            }
        }
    });
    app.directive('prongBubble', function ($mdUtil) {
        return {
            replace: true, // replace the element the directive is applied to
            scope: true, // same scope for all prongBubble directives
            transclude: true,
            templateUrl: function () {
                return app.paths.templates + 'prongBubble.html';
            },
            compile: function () {
                return {
                    post: function(scope, element, attrs) {
                        var prong = angular.element(element[0].querySelector('.prong'));
                        var setBubblePosition = function (pageX, pageY) {
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
                        };
                        var closeFunction = function () {
                            element.remove();
                        };
                        // save closeFn on scope to use it on the close button
                        scope.closeFn = closeFunction;
                        var domBody = angular.element(document.body);
                        var onClickOutsideFunction = function ($event) {
                            var bRect = $mdUtil.clientRect(element[0]), pRect = $mdUtil.clientRect(prong[0]);
                            var left = bRect.left, right = bRect.left + bRect.width;
                            var top = prong.hasClass('bottom-prong') ? bRect.top : bRect.top - pRect.height;
                            var bottom = top + bRect.height + pRect.height;
                            //console.log(bRect, $event.pageX, left, right, $event.pageY, top, bottom);
                            // check if we clicked outside of the bubble
                            if ($event.pageX > right || $event.pageX < left ||
                                $event.pageY > bottom || $event.pageY < top) {
                                closeFunction();
                            }
                        };
                        var onEscapeFunction = function ($event) {
                            if ($event.keyCode == '27') {
                                closeFunction();
                            }
                        };
                        var bindHandlers = function() {
                            domBody.on('click', onClickOutsideFunction);
                            element.on('keyup', onEscapeFunction);
                            // We don't use the `blur` event for performance reasons. If the bubble is open and we
                            // click on an empty date (we lose focus from the bubble -> blur will trigger), the bubble
                            // will be destroyed and recreated. We don't want that.
                            // We only want update its position since it already exists in the DOM.
                            //element.on('blur', closeFunction);
                        };
                        var unbindHandlers = function () {
                            domBody.off('click', onClickOutsideFunction);
                            element.off('keyup', onEscapeFunction);
                            // see bindHandlers function for why this is commented
                            //element.off('blur', closeFunction);
                        };
                        // watch for pageX, pageY changes to move the bubble accordingly
                        scope.$watchGroup(['pageX','pageY'], function(){
                            setBubblePosition(scope.pageX, scope.pageY);
                        });
                        // always cleanup on destroy
                        element.on('$destroy', function () {
                            unbindHandlers();
                        });
                        setBubblePosition(scope.pageX, scope.pageY);
                        bindHandlers();
                    }
                };
            }
        }
    });
})();
