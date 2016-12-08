var mtmApp = angular.module("mtmApp", []);

mtmApp.controller("NewsListController", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
    $rootScope.currentDocs = [];
    $rootScope.menuRelations = {};

    $http({
        method: "GET",
        url: "/js/quiz.json",
    }).then(function successCallback(response) {
        $rootScope.docs = response.data.result.docs;
        $scope.menus = response.data.result.menus;
    }, function errorCallback(response) {
        console.error("Error occurred:", response);
    });
}]);

mtmApp.directive("mtmMenu", function() {
    return {
        replace: true,
        template: '<ul class="nav nav-pills nav-stacked"><li ng-repeat="t in tree" ng-if="t.label"><a href="#" data-source-id="{{t.id}}" ng-click="go($event)">{{t.label}}</a><div style="padding-left: 20px;"><mtm-menu tree="t.children"></mtm-menu></div></li></ul>',
        scope: {
            tree: "=",
        },
        controller: function($rootScope, $scope) {
            $scope.go = function($evt) {
                $evt.preventDefault();
                $evt.stopPropagation();
                var elem = $($evt.target);
                if ($("#menuWrapper").find("li.active").is(elem)) {
                    console.warn("same link clicked.");
                    return;
                }
                $("#menuWrapper").find("li.active").removeClass("active");
                elem.addClass("active");
                var menuId = elem.data("sourceId");
                $rootScope.currentDocs = [];
                $rootScope.docs.forEach(function(doc, idx) {
                    if (doc.brands[0].id === menuId) {
                        $rootScope.currentDocs.push(doc);
                    }
                });
                $("html, body").animate({
                    scrollTop: 0,
                }, "fast");
            };
        },
    };
});
