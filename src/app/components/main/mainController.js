'use strict';

angular.module('giant').controller('MainController', ['$rootScope', '$scope', '$http', 'ngDialog', function($rootScope, $scope, $http, ngDialog) {
  $scope.userAuthData = {};
  $rootScope.user = JSON.parse(sessionStorage.giantAppUser || '{}');

  $scope.logIn = function () {
    $http.post('/auth', $scope.userAuthData).then(
      function (user) {
        setUserObject(user.data);

        openDialog({
            headline: 'Success',
            message: 'You have been successfully logged in'
        });
      },
      function (err) {
        openDialog({
            headline: 'Login failed',
            message: err.data
        });
      }
    );
  };

  $scope.logOut = function () {
    setUserObject({});
  };

  $scope.signUp = function () {
    $http.post('/register', $scope.userAuthData).then(
      function (user) {
        setUserObject(user.data);

        openDialog({
            headline: 'Success',
            message: 'Registration succeed'
        });
      },
      function (err) {
        openDialog({
            headline: 'Registration failed',
            message: err.data
        });
      }
    );
  };

  function openDialog (dialogOptions) {
    ngDialog.open({
      template: 'app/views/dialogTemplate.html',
      className: 'ngdialog-theme-default',
      overlay: true,
      closeByEscape: true,
      data: {
        headline: dialogOptions.headline,
        message: dialogOptions.message
      }
    });
  }

  function setUserObject (userData) {
    $rootScope.user = userData;

    if (sessionStorage) {
      sessionStorage.giantAppUser = JSON.stringify(userData);
    }
  }
}]);