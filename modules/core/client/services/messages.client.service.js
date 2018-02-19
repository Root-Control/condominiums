(function () {
  'use strict';

  angular
    .module('core')
    .factory('Messages', Messages);

  Messages.$inject = ['$http'];

  function Messages($http) {
    var me = this;
    me.confirmAction = function(message) {
      if (!message) message = 'Estás seguro de realizar esta acción?'
      return new Promise(function(resolve, reject) {
        swal({
          title: message,
          text: "No podrás revertir estos cambios!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'No, cancelar!',
          confirmButtonText: 'Si, continuar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger'
        }).then(function (result) {
          if (result.value)  resolve();
          else if (result.dismiss === 'cancel') swal('Acción cancelada', 'No se realizaron cambios!', 'error');
        });
      });
    };

    me.successMessage = function(successMessage) {
      swal('Enhorabuena!', successMessage, 'success');
    };

    me.errorMessage = function(message) {
      swal('Error...', message + '!', 'error');
    };

    return {
      confirmAction: me.confirmAction,
      successMessage: me.successMessage,
      errorMessage: me.errorMessage
    };
  }
}());
