'use strict';

angular
  .module('giant')
  .directive('appHeader', appHeader);

function appHeader () {
  return {
    templateUrl: 'app/components/header/appHeader.tpl.html',
    replace: true
  };
}