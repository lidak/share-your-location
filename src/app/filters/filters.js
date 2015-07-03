'use strict';

angular
  .module('customFilters', [])
  .filter('trustedSrc', function ($sce) {
    return function (input) {
      return $sce.trustAsResourceUrl(input);
    };
  });