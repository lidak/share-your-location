'use strict';

var giant = angular.module('giant', []);

giant.controller('FirstController', ['$scope', function ($scope) {
  $scope.test = 5;
}]);