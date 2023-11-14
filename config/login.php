<?php
// Conexión a la base de datos (reemplaza con tus propias credenciales)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "navarro";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$usuario = $_POST['username'];
$contrasena = $_POST['password'];


$sql = "SELECT * FROM usuario WHERE nombre = '$usuario' AND contrasena = '$contrasena'";
$result = $conn->query($sql);


if ($result->num_rows > 0) {

    echo "Credenciales correctas";

} else {
    echo "Credenciales incorrectas";
}

$conn->close();
?>
