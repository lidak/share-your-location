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
      $scope.newNote = {
        title: '',
        images: [],
        textContent: ''
      };

      $scope.isAddPhotosViewVisible = false;
      $scope.noteIsBeingCreated = false;

      $scope.addNote = function (note) {
        note.date = Date.now();
        $scope.notes.push(note);
      };

      $scope.startNoteCreation = function () {
        navigator.geolocation.getCurrentPosition(function (data) {
          $scope.noteIsBeingCreated = true;
        }, function(err) {
          $scope.noteIsBeingCreated = true;
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
      };  

      $scope.startVideo = function() {
        var video = document.getElementById('video');

        navigator.webkitGetUserMedia({
          video: true
        }, function (stream) {
          $scope.$apply(function() {
            $scope.isAddPhotosViewVisible = true;
            $scope.videoStreamUrl = URL.createObjectURL(stream);
          });
          video.setAttribute('src', $scope.videoStreamUrl);
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

      $scope.removeImage = function (img) {
        var images = $scope.newNote.images;
        images.splice(images.indexOf(img), 1);
      };

      $scope.createNewNote = function () {
        $scope.notes.push($scope.newNote);
        $scope.stopNewNoteCreation();
      };
    }
  }

})();