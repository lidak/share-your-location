'use strict';

angular
  .module('giant')
  .directive('notesFilter', notesFilter);

function notesFilter () {
  var templateLocation = 'app/components/notesFilter/notesFilter.html';
  return {
    controller: notesFilterController,
    templateUrl: templateLocation,
    restrict: 'E'
  };
}

function notesFilterController ($scope, $http, $rootScope, openDialog) {
  function loadWatchedNotes () {
    $http.get('/watchedNotes/' + $rootScope.user._id)
      .success(function(users) {
        debugger
        $scope.users = users;
      })
      .error(function() {
        openDialog({
          headline: 'Fail',
          message: 'Can\'t load notes'
        });
      });
  }

  loadWatchedNotes();
}