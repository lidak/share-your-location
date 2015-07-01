'use strict';

angular.module('giant').controller('MainController', ['$scope', function($scope) {
  $scope.notes = [];
  navigator.geolocation.getCurrentPosition(function (location) {
    $scope.$apply(function () {
      $scope.map = { center: { latitude: location.coords.latitude, longitude: location.coords.longitude }, zoom: 12 };
  })
  }, function(err) {
  });
}]);