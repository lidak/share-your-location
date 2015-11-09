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

function notesFilterController ($scope, $http, $rootScope, ngDialog) {
  function loadWatchedNotes () {
    $http.get('/watchedNotes/' + $rootScope.user._id)
      .success(function() {

      })
      .error(function() {
        $scope.openDialog({
          headline: 'Fail',
          message: 'Can\'t load notes'
        });
      });
  }

  loadWatchedNotes();
}