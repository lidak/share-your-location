'use strict';

angular
  .module('giant')
  .directive('loadSpinner', function () {
    function controller ($scope) {

    }
    return {
      templateUrl: 'app/components/loadSpinner/loadSpinner.tpl.html',
      controller: controller,
      replace: true
    };
  });