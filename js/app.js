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
        template: '<ul class="nav nav-pills nav-stacked {{ isCollapsible ? \'collapse\' : \'\' }}"><li ng-repeat="t in tree" ng-if="t.label"><a href="#" data-toggle="collapse" data-target="#drilldown-{{t.id}}" data-source-id="{{t.id}}" ng-click="go($event)">{{t.label}}</a><div style="padding-left: 20px;"><mtm-menu id="drilldown-{{t.id}}" is-collapsible="true" tree="t.children"></mtm-menu></div></li></ul>',
        scope: {
            tree: "=",
            isCollapsible: "=",
        },
        controller: function($rootScope, $scope) {
            $scope.go = function($evt) {
                // $evt.preventDefault();
                // $evt.stopPropagation();
                var elem = $($evt.target);
                if (elem.hasClass("active")) {
                    console.warn("same link clicked.");
                    return;
                }
                $("#menuWrapper").find("li a.active").removeClass("active");
                elem.addClass("active");

                var menuId = elem.data("sourceId");
                var filteredDocs = [];
                $rootScope.docs.forEach(function(doc, idx) {
                    if (doc.brands[0].id === menuId) {
                        filteredDocs.push(doc);
                    }
                });

                if(filteredDocs.length) {
                    $rootScope.currentDocs = filteredDocs;
                    $("html, body").animate({
                        scrollTop: 0,
                    }, "fast");
                }

                $evt.preventDefault();
                return false;
            };
        },
    };
});
