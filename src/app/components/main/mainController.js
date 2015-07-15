'use strict';

angular.module('giant').controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.notes = [];
  $scope.user = {};

  $scope.login = function () {
    $http.post('/auth', $scope.user);
  };
}]);