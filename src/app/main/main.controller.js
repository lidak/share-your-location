(function() {
  'use strict';

  angular
    .module('giant')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope) {
    $scope.notes = [];
  }
})();