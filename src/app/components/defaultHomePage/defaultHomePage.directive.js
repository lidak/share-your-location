'use strict';

angular
  .module('giant')
  .directive('defaultHomePage', function () {
    function controller ($scope) {
      
    }
    return {
      templateUrl: 'app/components/defaultHomePage/defaultHomePage.tpl.html',
      controller: controller,
      replace: true
    };
  });