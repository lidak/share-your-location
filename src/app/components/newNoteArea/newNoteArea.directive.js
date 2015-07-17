'use strict';

angular
  .module('giant')
  .directive('newNoteArea', newNoteArea);

/** @ngInject */
function newNoteArea() {
  var directive = {
    restrict: 'E',
    templateUrl: 'app/components/newNoteArea/newNoteArea.html',
    controller: NewNoteController,
    bindToController: true
  };

  return directive;

  /** @ngInject */
  function NewNoteController($scope, $http, $rootScope) {
    var streamObj;

    function stopStream () {
      if (streamObj && streamObj.active) {
        streamObj.stop();
      }
    }

    $scope.map = null;

    $scope.newNote = {
      title: '',
      images: [],
      textContent: '',
      coords: {
        latitude: 50,
        longitude: 20
      },
      date: ''
    };

    $scope.isAddPhotosViewVisible = false;
    $scope.noteIsBeingCreated = false;

    $scope.videoStreamUrl = '';
    $rootScope.$watch('user', function () {
      if ($rootScope.user._id) {
        $http
          .get('/getNotes/' + ($rootScope.user._id))
          .then(function (response) {
            $rootScope.notes = response.data;
            $scope.map = {
              center: $scope.newNote.coords,
              zoom: 12,
              markers: $scope.notes,
              markersEvents: {
                click: function() {}
              },
              window: {
                marker: {id:4},
                show: true,
                closeClick: function() {
                  this.show = false;
                },
                options: {}
            }
          };
        });
      } else {
        $rootScope.notes = [];
        $scope.map = null;
      }
    });

    $scope.startNoteCreation = function () {
      navigator.geolocation.getCurrentPosition(function (location) {
        $scope.$apply(function () {
          $scope.newNote.coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };
          $scope.newNote.bid = 4;
          $scope.noteIsBeingCreated = true;
        });
      }, function(err) {
        $scope.noteIsBeingCreated = false;
      });
    };

    $scope.stopNewNoteCreation = function () {
      $scope.newNote = {
        title: '',
        images: [],
        textContent: ''
      };

      $scope.isAddPhotosViewVisible = false;
      $scope.noteIsBeingCreated = false;

      stopStream();
    };

    $scope.startVideo = function() {
      navigator.webkitGetUserMedia({
        video: true
      }, function (stream) {
        streamObj = stream;
        $scope.$apply(function() {
          $scope.isAddPhotosViewVisible = true;
          $scope.videoStreamUrl = URL.createObjectURL(stream);
        });
      }, function () {

      });
    };

    $scope.makePhoto = function () {
      var video = document.getElementById('video');
      var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')
              .drawImage(video, 0, 0, canvas.width, canvas.height);

        $scope.newNote.images.push({src: canvas.toDataURL()});
    };

    $scope.cancelPhotosMake = function () {
      $scope.newNote.images = [];
      $scope.isAddPhotosViewVisible = false;

      stopStream();
    };

    $scope.removeImage = function (img) {
      var images = $scope.newNote.images;
      images.splice(images.indexOf(img), 1);
    };

    $scope.createNewNote = function () {
      $scope.newNote.date = Date.now();
      $scope.newNote.show = true;
      $scope.notes.push($scope.newNote);

      $http
        .post('/createNote/' + $scope.user._id, $scope.newNote)
        .then($scope.stopNewNoteCreation);
    };

    $scope.redirectToNotePage = function () {
      debugger
    };
  }
}