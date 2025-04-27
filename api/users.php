<?php
error_reporting(E_ERROR | E_PARSE);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/config.php';

function getRequestData() {
    return json_decode(file_get_contents('php://input'), true);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Buscar todos ou por ID
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT id, nome, email, tipo FROM users WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            echo json_encode($user ?: []);
        } else {
            $result = $conn->query("SELECT id, nome, email, tipo FROM users");
            $users = [];
            while ($user = $result->fetch_assoc()) {
                $users[] = $user;
            }
            echo json_encode($users);
        }
        break;

    case 'POST':
        $data = getRequestData();
        if (isset($data['action']) && $data['action'] === 'login') {
            // LOGIN
            $email = $data['email'] ?? '';
            $senha = $data['senha'] ?? '';
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            if ($user && password_verify($senha, $user['senha'])) {
                unset($user['senha']); // Nunca envie a senha!
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
            }
        } else {
            // CRIAÇÃO DE USUÁRIO
            $nome = $data['nome'] ?? '';
            $email = $data['email'] ?? '';
            $senha = $data['senha'] ?? '';
            $tipo = $data['tipo'] ?? 'aluno';
            if (!$nome || !$email || !$senha) {
                http_response_code(400);
                echo json_encode(['error' => 'Campos obrigatórios ausentes']);
                exit;
            }
            $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $nome, $email, $senhaHash, $tipo);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $conn->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao criar usuário']);
            }
        }
        break;

    case 'PUT':
        // ATUALIZAÇÃO DE USUÁRIO
        $data = getRequestData();
        $id = $data['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID obrigatório']);
            exit;
        }
        $campos = [];
        $params = [];
        $types = '';
        if (isset($data['nome'])) {
            $campos[] = 'nome = ?';
            $params[] = $data['nome'];
            $types .= 's';
        }
        if (isset($data['email'])) {
            $campos[] = 'email = ?';
            $params[] = $data['email'];
            $types .= 's';
        }
        if (isset($data['senha'])) {
            $campos[] = 'senha = ?';
            $params[] = password_hash($data['senha'], PASSWORD_DEFAULT);
            $types .= 's';
        }
        if (isset($data['tipo'])) {
            $campos[] = 'tipo = ?';
            $params[] = $data['tipo'];
            $types .= 's';
        }
        if (count($campos) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhum campo para atualizar']);
            exit;
        }
        $params[] = $id;
        $types .= 'i';
        $sql = "UPDATE users SET " . implode(', ', $campos) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar usuário']);
        }
        break;

    case 'DELETE':
        // EXCLUSÃO DE USUÁRIO
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'] ?? ($_GET['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID obrigatório']);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao excluir usuário']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não suportado']);
        break;
}

$conn->close();