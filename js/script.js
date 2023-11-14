$(document).ready(function () {
    function cargarRespuestas() {
        $.ajax({
            url: 'php/obtener_respuestas.php',
            type: 'GET',
            success: function (data) {
                $('.chat-messages').html(data);
            },
            error: function () {
                console.log('Error al cargar respuestas.');
            }
        });
    }

    cargarRespuestas();
});
