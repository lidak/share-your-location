(function() {
  'use strict';

  angular
    .module('giant')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
