<?php
    class Login {
        private $servername;
        private $username;
        private $password;
        private $dbname;

        public function __construct() {
        // reemplaza con tus propias credenciales
            $this->servername = "localhost";
            $this->username = "root";
            $this->password = "root";
            $this->dbname = "trabajophp";
        }

        public function connect() {
        // Conexión a la base de datos
            $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
            
            // Verifica la conexión
            if ($this->conn->connect_error) {
                die("Conexión fallida: " . $this->conn->connect_error);
            }
        }

        public function validateUser() {
            $usuario = $_POST['username'];
            $contrasena = $_POST['password'];


            $sql = "SELECT * FROM usuario WHERE nombre = '$usuario' AND contrasena = '$contrasena'";
            $result = $this->conn->query($sql);


            if ($result->num_rows > 0) {

                echo "Credenciales correctas";

            } else {
                echo "Credenciales incorrectas";
            }

            $this->conn->close();
        }
    }
?>
