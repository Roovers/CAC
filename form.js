//BORRAR CAMPOS

document.addEventListener('DOMContentLoaded', function () {
    var botonBorrar = document.getElementById('borrar');
  
    botonBorrar.addEventListener('click', function () {
      document.getElementById('nombre').value = '';
      document.getElementById('apellido').value = '';
      document.getElementById('dni').value = '';
      document.getElementById('correo').value = '';
      document.getElementById('categoria').value = 'general';
      document.getElementById('cantidad').value = '';
    });
  });
  
  // BOTON AGREGAR

  document.addEventListener('DOMContentLoaded', function () {
    var botonBorrar = document.getElementById('borrar');
    var botonAgregar = document.getElementById('agregar');
    var dniInput = document.getElementById('dni');
    var cantidadInput = document.getElementById('cantidad');
    var categoriaInput = document.getElementById('categoria');
    var numSocioInput = document.getElementById('num-socio');
    var ticketTable = document.getElementById('ticket-table');
    var ticketListBody = document.getElementById('ticket-list-body');
    var totalAPagar = document.getElementById('total');
    var inputs = document.querySelectorAll('input, select');
  
    var maxTicketsPorPersona = 4;
  
    function bloquearBotones() {
      botonBorrar.disabled = true;
      botonAgregar.disabled = true;
      botonBorrar.style.backgroundColor = 'red';
      botonAgregar.style.backgroundColor = 'red';
    }
  
    function desbloquearBotones() {
      botonBorrar.disabled = false;
      botonAgregar.disabled = false;
      botonBorrar.style.backgroundColor = '';
      botonAgregar.style.backgroundColor = '';
    }
  
    function validarCampos() {
      var camposCompletos = Array.from(inputs).every(function (input) {
        return input.validity.valid;
      });
  
      var categoriaSeleccionada = categoriaInput.value;
      if (categoriaSeleccionada === 'palco') {
        return camposCompletos && (numSocioInput.value !== '');
      } else {
        return camposCompletos;
      }
    }
  
    botonBorrar.addEventListener('click', function () {
      document.querySelectorAll('input').forEach(function (input) {
        input.value = '';
      });
      categoriaInput.value = 'general';
      cantidadInput.value = '';
      numSocioInput.value = '';
      desbloquearBotones();
      totalAPagar.textContent = 'Total a pagar: $0';
    });
  
    botonAgregar.addEventListener('click', function () {
      if (validarCampos()) {
        var dni = dniInput.value;
        var cantidad = cantidadInput.value;
        var categoria = categoriaInput.value;
        var valor = calcularValorEntradas(categoria, cantidad);
  
        var totalTickets = Array.from(ticketListBody.rows).reduce(function (total, row) {
          return total + parseInt(row.cells[1].textContent);
        }, 0);
  
        if (categoria === 'palco') {
          if (numSocioInput.validity.valid) {
            if (totalTickets + parseInt(cantidad) <= maxTicketsPorPersona) {
              var newRow = ticketListBody.insertRow();
              var cell1 = newRow.insertCell(0);
              var cell2 = newRow.insertCell(1);
              var cell3 = newRow.insertCell(2);
              var cell4 = newRow.insertCell(3);
              cell1.textContent = dni;
              cell2.textContent = cantidad;
              cell3.textContent = categoria;
              cell4.textContent = '$' + valor;
  
              calcularTotalAPagar(); // Actualiza el total a pagar
  
              // Limpiar los campos del formulario después de agregar
              inputs.forEach(function (input) {
                input.value = '';
              });
            } else {
              alert('No puedes comprar más de ' + maxTicketsPorPersona + ' entradas por persona.');
              bloquearBotones();
            }
          } else {
            alert('Por favor, complete el campo "Número de Socio" correctamente antes de agregar.');
          }
        } else {
          if (totalTickets + parseInt(cantidad) <= maxTicketsPorPersona) {
            var newRow = ticketListBody.insertRow();
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            var cell4 = newRow.insertCell(3);
            cell1.textContent = dni;
            cell2.textContent = cantidad;
            cell3.textContent = categoria;
            cell4.textContent = '$' + valor;
  
            calcularTotalAPagar(); // Actualiza el total a pagar
  
            // Limpiar los campos del formulario después de agregar
            inputs.forEach(function (input) {
              input.value = '';
            });
          } else {
            alert('No puedes comprar más de ' + maxTicketsPorPersona + ' entradas por persona.');
            bloquearBotones();
          }
        }
      } else {
        alert('Por favor, complete todos los campos correctamente antes de agregar.');
      }
    });
  
    categoriaInput.addEventListener('change', function () {
      var categoriaSeleccionada = categoriaInput.value;
      if (categoriaSeleccionada === 'palco') {
        numSocioInput.disabled = false;
      } else {
        numSocioInput.disabled = true;
        numSocioInput.value = '';
      }
    });
  
    function calcularValorEntradas(categoria, cantidad) {
      var precioUnitario = categoria === 'general' ? 2500 : (categoria === 'platea' ? 4500 : 10000);
      return precioUnitario * cantidad;
    }
  
    function calcularTotalAPagar() {
      var filas = Array.from(ticketListBody.rows);
      var total = 0;
  
      filas.forEach(function (fila) {
        var valorCelda = fila.cells[3].textContent;
        var valorNumerico = parseFloat(valorCelda.slice(1)); // Excluye el signo de dólar y convierte a número
        total += valorNumerico;
      });
  
      totalAPagar.textContent = 'Total a pagar: $' + total.toFixed(2); // Formatea el total con dos decimales
    }
  });
  

  // BOTON ENVIAR AL CORREO
  
  document.addEventListener('DOMContentLoaded', function () {
    var botonEnviarCorreo = document.getElementById('enviar-resumen');
    var mensajeModal = document.getElementById('mensaje-modal');
    var cerrarModal = document.getElementById('cerrar-modal');
    var modalCompraVacia = document.getElementById('modal-compra-vacia');
    var cerrarModalCompraVacia = document.getElementById('cerrar-modal-compra-vacia');
    var tablaDatos = document.getElementById('ticket-list-body'); // Cambia 'tablaDatos' al ID correcto de tu tabla
  
    // Función para mostrar el modal
    function mostrarModal(modal) {
      modal.style.display = 'block';
    }
  
    // Función para cerrar el modal
    function cerrarModalFuncion(modal) {
      modal.style.display = 'none';
      location.reload(); // Recargar la página
    }
  
    // Evento para mostrar el modal cuando se hace clic en el botón "Enviar resumen a correo"
    botonEnviarCorreo.addEventListener('click', function () {
      if (tablaDatos.rows.length > 0) {
        mostrarModal(mensajeModal);
      } else {
        mostrarModal(modalCompraVacia);
      }
    });
  
    // Evento para cerrar el modal cuando se hace clic en la "x" del primer modal
    cerrarModal.addEventListener('click', function () {
      cerrarModalFuncion(mensajeModal);
    });
  
    // Evento para cerrar el modal cuando se hace clic en la "x" del modal de compra vacía
    cerrarModalCompraVacia.addEventListener('click', function () {
      cerrarModalFuncion(modalCompraVacia);
    });
  
    // Evento para cerrar el modal cuando se hace clic fuera del modal (primer modal)
    window.addEventListener('click', function (evento) {
      if (evento.target === mensajeModal) {
        cerrarModalFuncion(mensajeModal);
      }
    });
  
    // Evento para cerrar el modal cuando se hace clic fuera del modal (modal de compra vacía)
    window.addEventListener('click', function (evento) {
      if (evento.target === modalCompraVacia) {
        cerrarModalFuncion(modalCompraVacia);
      }
    });
  });
  