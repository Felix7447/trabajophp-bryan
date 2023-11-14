<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/login.css">
    <link href="https://fonts.googleapis.com/css?family=Poppins:600&display=swap" rel="stylesheet">
    <title>Inicio de Sesión</title>
</head>

<body>
    <div class="login-container">
        <?php 
            include_once "./config/login.php";
            $login = new Login();
            $login->connect();

            if (isset($_POST['username']) AND isset($_POST['password'])) {
                $login->validateUser();
            }
        ?>
        <h2>Iniciar Sesión</h2>
        <form id="loginForm" action="" method="POST">
            <input type="text" name="username" placeholder="Usuario" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</body>

</html>
