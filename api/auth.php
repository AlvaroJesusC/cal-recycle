<?php
// ruta = api/auth.php
header("Content-Type: application/json");
require_once '../config/db.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $email = $data['email'];
    $pass = $data['contrasena'];
    
    $conn = getConnection();
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($pass, $user['contrasena'])) {
        $_SESSION['usuario_id'] = $user['id_usuario'];
        $_SESSION['usuario_nombre'] = $user['nombre'];
        echo json_encode(['success' => true, 'mensaje' => 'Login exitoso', 'usuario' => $user]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'mensaje' => 'Credenciales incorrectas']);
    }
}

if ($action === 'register') {
    $nombre = $data['nombre'];
    $apellidos = $data['apellidos'];
    $email = $data['email'];
    $pass = password_hash($data['contrasena'], PASSWORD_BCRYPT);
    
    $conn = getConnection();
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellidos, email, contrasena) VALUES (?, ?, ?, ?)");
    
    if ($stmt->execute([$nombre, $apellidos, $email, $pass])) {
        echo json_encode(['success' => true, 'mensaje' => 'Registro exitoso']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'mensaje' => 'Error al registrar']);
    }
}

if ($action === 'check') {
    if (isset($_SESSION['usuario_id'])) {
        echo json_encode(['autenticado' => true]);
    } else {
        echo json_encode(['autenticado' => false]);
    }
}
?>