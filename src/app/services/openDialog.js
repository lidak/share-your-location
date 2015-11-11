'use strict';

angular
  .module('giant')
  .factory('openDialog', function (ngDialog) {
      function openDialog(dialogOptions) {
        ngDialog.open({
          template: 'app/views/dialogTemplate.html',
          className: 'ngdialog-theme-default',
          overlay: true,
          closeByEscape: true,
          data: {
            headline: dialogOptions.headline,
            message: dialogOptions.message
          }
        });
      }

      return openDialog;
  });
