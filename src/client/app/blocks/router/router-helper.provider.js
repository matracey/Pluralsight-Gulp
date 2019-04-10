/* Help configure the state-base ui.router */
(function() {
    "use strict";

    angular
        .module("blocks.router")
        .provider("routerHelper", routerHelperProvider);

    routerHelperProvider.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        $locationProvider.html5Mode(true);

        this.configure = function(cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ["$location", "$rootScope", "$state", "logger"];
        /* @ngInject */
        function RouterHelper($location, $rootScope, $state, logger) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function(state) {
                    state.config.resolve =
                        angular.extend(state.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on("$stateChangeError",
                    function(event, toState, toParams, fromState, fromParams, error) {
                        if (toState == null) { toState = {}; }
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var msg = formatErrorMessage(error);
                        logger.warning(msg, [ toState ]);
                        $location.path("/");

                        function formatErrorMessage(e) {
                            var dest = toState.loadedTemplateUrl != null ? toState.loadedTemplateUrl : "unknown target";
                            dest = toState.name != null ? toState.name : dest;
                            dest = toState.title != null ? toState.title : dest;

                            var eStatusText = (e.statusText || "");
                            var eStatus = (e.status || "")
                            var eDetail = ". <br/>" + eStatusText + ": " + eStatus;
                            eDetail = e.data != null ? e.data : eDetail;
                            eDetail = e.message != null ? e.message : eDetail;

                            return "Error routing to " + dest + ". " + eDetail;
                        }
                    }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStates() { return $state.get(); }

            function updateDocTitle() {
                $rootScope.$on("$stateChangeSuccess",
                    function(event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + " " + (toState.title || "");
                        $rootScope.title = title; // data bind to <title>
                    }
                );
            }
        }
    }
}());
