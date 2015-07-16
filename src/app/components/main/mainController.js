'use strict';

angular.module('giant').controller('MainController', ['$rootScope', '$scope', '$http', 'ngDialog', function($rootScope, $scope, $http, ngDialog) {
  $scope.notes = [];
  $scope.userAuthData = {};

  $scope.logIn = function () {
    $http.post('/auth', $scope.userAuthData).then(
      function (user) {
        $rootScope.user = user;

        ngDialog.open({
          template: 'app/views/dialogTemplate.html',
          className: 'ngdialog-theme-default',
          overlay: true,
          closeByEscape: true,
          data: {
            headline: 'Success',
            message: 'You has been successfully logged in'
          }
        });
      },
      function (err) {
        ngDialog.open({
          template: 'app/views/dialogTemplate.html',
          className: 'ngdialog-theme-default',
          overlay: true,
          closeByEscape: true,
          data: {
            headline: 'Login failed',
            message: err.data
          }
        });
      }
    );
  };

  $scope.signUp = function () {
    $http.post('/register', $scope.userAuthData).then(
      function (user) {
        $rootScope.user = user;

        ngDialog.open({
          template: 'app/views/dialogTemplate.html',
          className: 'ngdialog-theme-default',
          overlay: true,
          closeByEscape: true,
          data: {
            headline: 'Success',
            message: 'Registration succeed'
          }
        });
      },
      function (err) {
        ngDialog.open({
          template: 'app/views/dialogTemplate.html',
          className: 'ngdialog-theme-default',
          overlay: true,
          closeByEscape: true,
          data: {
            headline: 'Registration failed',
            message: err.data
          }
        });
      }
    );
  };
}]);