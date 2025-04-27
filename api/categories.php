<?php
// Adicione estas linhas ANTES de qualquer saída
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Se for uma requisição OPTIONS (preflight), encerre aqui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

// Função para obter dados do corpo da requisição (para POST e PUT)
function getRequestData() {
    return json_decode(file_get_contents('php://input'), true);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Buscar categoria por ID
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM categories WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $category = $result->fetch_assoc();
            echo json_encode($category ?: []);
            $stmt->close();
        } else {
            // Buscar todas as categorias
            $sql = "SELECT * FROM categories";
            $result = $conn->query($sql);
            $categories = [];
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $categories[] = $row;
                }
            }
            echo json_encode($categories);
        }
        break;

    case 'POST':
        // Criar nova categoria
        $data = getRequestData();
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nome da categoria é obrigatório']);
            break;
        }
        $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
        $stmt->bind_param("s", $data['name']);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar categoria']);
        }
        $stmt->close();
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        // Debug temporário para ver o que chega:
        error_log("PUT DATA: " . print_r($data, true));

        $id = intval($data['id'] ?? 0);
        $title = $conn->real_escape_string($data['title'] ?? '');
        $icon = $conn->real_escape_string($data['icon'] ?? '');
        $name = $conn->real_escape_string($data['name'] ?? '');

        if (!$id || !$title) {
            http_response_code(400);
            echo json_encode(['error' => 'Dados inválidos']);
            exit;
        }

        $sql = "UPDATE categories SET title='$title', name='$name', icon='$icon' WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar categoria']);
        }
        break;
    case 'DELETE':
        // Deletar categoria
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID da categoria é obrigatório']);
            break;
        }
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao deletar categoria']);
        }
        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}

$conn->close();