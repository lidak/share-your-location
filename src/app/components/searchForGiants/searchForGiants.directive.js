'use strict';

angular
  .module('giant')
  .directive('searchForGiants', searchForGiants);

function searchForGiants () {
  var templateLocation = 'app/components/searchForGiants/searchTemplate.html';
  return {
    controller: searchController,
    templateUrl: templateLocation,
    restrict: 'E'
  };
}

function searchController ($scope, $http, $rootScope) {
  var urlToGetNames = '/getUsersByPartOfName',
    urlToSubscribe = '/subscribeForNotes';
  $scope.selectedUser = {};
  $scope.nameToSearch  ='';
  $scope.usersCollection = [];

  $scope.newUserSelected = newUserSelected;
  $scope.sendNamesRequest = sendNamesRequest;
  $scope.watchUsersNotes = watchUsersNotes;

  function newUserSelected() {
    console.log($scope.selectedUser);
  }

  function sendNamesRequest() {
    if(!$scope.nameToSearch.length) {
      return;
    }

    $http.get(urlToGetNames + '/' + $scope.nameToSearch)
      .success(function (data) {
        $scope.usersCollection = data;
      })
      .error(function (err) {
        console.log(err);
      });
  }

  function watchUsersNotes () {
    $http.put(urlToSubscribe, {
      currentUser: $rootScope.user._id,
      subscribeFor: $scope.selectedUser._id
    }).success(function() {
      $rootScope.openDialog({
        headline: 'Success',
        message: 'You succesfully subscribed.'
      });
    });
  }
}