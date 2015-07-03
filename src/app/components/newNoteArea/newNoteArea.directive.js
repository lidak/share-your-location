(function() {
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
    function NewNoteController($scope) {
      var streamObj;

      function stopStream () {
        if (streamObj && streamObj.active) {
          streamObj.stop();
        }
      }

      $scope.newNote = {
        title: '',
        images: [],
        textContent: ''
      };

      $scope.isAddPhotosViewVisible = false;
      $scope.noteIsBeingCreated = false;

      $scope.videoStreamUrl = '';

      $scope.startNoteCreation = function () {
        navigator.geolocation.getCurrentPosition(function (location) {
          $scope.newNote.location = location;
          $scope.$apply(function () {
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
        $scope.notes.push($scope.newNote);
        $scope.stopNewNoteCreation();
      };
    }
  }

})();