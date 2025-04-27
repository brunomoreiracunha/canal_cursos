<?php
// Detecta ambiente (exemplo simples)
$env = getenv('APP_ENV') ?: 'development';

if ($env === 'production') {
    $db_host = 'PROD_DB_HOST';
    $db_user = 'PROD_DB_USER';
    $db_pass = 'PROD_DB_PASS';
    $db_name = 'PROD_DB_NAME';
    $db_port = 'PROD_DB_PORT';
} else {
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'canal_cursos';
    $db_port = '3306';
}

// Conexão PDO ou mysqli
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>