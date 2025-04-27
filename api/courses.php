<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/php_error.log');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Se for uma requisição OPTIONS (preflight), encerre aqui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/config.php';

// Função para obter dados do corpo da requisição (para POST e PUT)
function getRequestData() {
    return json_decode(file_get_contents('php://input'), true);
}

$method = $_SERVER['REQUEST_METHOD'];
switch (trim($method)) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'PUT':
        $data = getRequestData();
        handlePut($conn, $data);
        break;
    case 'DELETE':
        handleDelete($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}

$conn->close();


function handleGet($conn) {
    if (isset($_GET['id'])) {
        // Busca curso único
        $course_id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM courses WHERE id = ?");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $course = $result->fetch_assoc();

        if ($course) {
            // Categoria
            $catStmt = $conn->prepare("SELECT * FROM categories WHERE id = ?");
            $catStmt->bind_param("i", $course['category_id']);
            $catStmt->execute();
            $catResult = $catStmt->get_result();
            $course['category'] = $catResult->fetch_assoc();

            // Mídias
            $mediaStmt = $conn->prepare("SELECT * FROM course_media WHERE course_id = ?");
            $mediaStmt->bind_param("i", $course_id);
            $mediaStmt->execute();
            $mediaResult = $mediaStmt->get_result();
            $mediaArray = $mediaResult->fetch_all(MYSQLI_ASSOC);
            $course['course_media'] = $mediaArray;

            // Objetivos
            $objStmt = $conn->prepare("SELECT * FROM course_learning_objectives WHERE course_id = ?");
            $objStmt->bind_param("i", $course_id);
            $objStmt->execute();
            $objResult = $objStmt->get_result();
            $objectives = $objResult->fetch_all(MYSQLI_ASSOC);

            error_log('Objectives: ' . print_r($objectives, true));
            $objectivesWithItems = [];
            foreach ($objectives as $objective) {
                $objectiveId = $objective['id']; // ajuste se necessário!
                $itemsStmt = $conn->prepare("SELECT * FROM course_learning_objective_items WHERE course_learning_objective_id = ?");
                $itemsStmt->bind_param("i", $objectiveId);
                $itemsStmt->execute();
                $itemsResult = $itemsStmt->get_result();
                $items = $itemsResult->fetch_all(MYSQLI_ASSOC);
                $objective['items'] = array_column($items, 'item');
                $objectivesWithItems[] = $objective;
            }
            $course['learning_objectives'] = $objectivesWithItems;            
            
            echo json_encode($course);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Curso não encontrado']);
        }
    } elseif (isset($_GET['category_id']) && isset($_GET['search'])) {
        $categoryId = intval($_GET['category_id']);
        $searchTerm = $conn->real_escape_string($_GET['search']);
        $likeTerm = "%$searchTerm%";
        $stmt = $conn->prepare("SELECT * FROM courses WHERE category_id = ? AND title LIKE ?");
        $stmt->bind_param("is", $categoryId, $likeTerm);
        $stmt->execute();
        $result = $stmt->get_result();
        $courses = [];
        while ($course = $result->fetch_assoc()) {
            $courses[] = $course;
        }
        echo json_encode($courses);
    } elseif (isset($_GET['category'])) {
        $categoryId = intval($_GET['category']); // sempre sanitize!
        $stmt = $conn->prepare("SELECT * FROM courses WHERE category_id = ?");
        $stmt->bind_param("i", $categoryId);
        $stmt->execute();
        $result = $stmt->get_result();
        $courses = [];
        while ($course = $result->fetch_assoc()) {
            $courses[] = $course;
        }
        echo json_encode($courses);
    } elseif (isset($_GET['featured'])) {
        $result = $conn->query("SELECT * FROM courses WHERE featured = 1");
        $courses = [];
        while ($course = $result->fetch_assoc()) {
            $courses[] = $course;
        }
        echo json_encode($courses);
    } elseif (isset($_GET['search'])) {
        $searchTerm = $conn->real_escape_string($_GET['search']);
        $likeTerm = "%$searchTerm%";
        $stmt = $conn->prepare("SELECT * FROM courses WHERE title LIKE ?");
        $stmt->bind_param("s", $likeTerm);
        $stmt->execute();
        $result = $stmt->get_result();
        $courses = [];
        while ($course = $result->fetch_assoc()) {
            $courses[] = $course;
        }
        echo json_encode($courses);
    } else {
        // Busca todos os cursos (resumido ou completo, conforme necessidade)
        $result = $conn->query("SELECT * FROM courses");
        $courses = [];
        while ($course = $result->fetch_assoc()) {
            $courses[] = $course;
        }
        echo json_encode($courses);
    }
}


function handlePost($conn) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);    
        // 1. Cria o curso
        $stmt = $conn->prepare("INSERT INTO courses (title, category_id, image, price, description, instructor, duration, level, rating, link_venda, formatted_course_info, featured, formatted_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sisdsdssdssis",
            $data['title'],
            $data['category_id'],
            $data['image'],
            $data['price'],
            $data['description'],
            $data['instructor'],
            $data['duration'],
            $data['level'],
            $data['rating'],
            $data['link_venda'],
            $data['formatted_course_info'],
            $data['featured'],
            $data['formatted_description']
        );
        $stmt->execute();
        $course_id = $stmt->insert_id;
        
        // 2. Cria mídias
        if (!empty($data['course_media'])) {
            foreach ($data['course_media'] as $media) {
                $mediaStmt = $conn->prepare("INSERT INTO course_media (course_id, url, type, title) VALUES (?, ?, ?, ?)");
                $mediaStmt->bind_param("isss", $course_id, $media['url'], $media['type'], $media['title']);
                $mediaStmt->execute();
            }
        }
        
        // 3. Cria objetivos e itens
        if (!empty($data['learning_objectives'])) {
            foreach ($data['learning_objectives'] as $objective) {
                $objStmt = $conn->prepare("INSERT INTO course_learning_objectives (course_id, title) VALUES (?, ?)");
                $objStmt->bind_param("is", $course_id, $objective['title']);
                $objStmt->execute();
                $objective_id = $objStmt->insert_id;
        
                if (!empty($objective['items'])) {
                    foreach ($objective['items'] as $item) {
                        $itemStmt = $conn->prepare("INSERT INTO course_learning_objective_items (course_learning_objective_id, item) VALUES (?, ?)");
                        $itemStmt->bind_param("is", $objective_id, $item['item']);
                        $itemStmt->execute();
                    }
                }
            }
        }
        echo json_encode(['success' => true, 'id' => $course_id]);
    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Erro ao criar curso: ' . $e->getMessage()]);
    }
}

function handlePut($conn, $data) {
    $uniq = uniqid();
    file_put_contents(__DIR__ . '/debug.txt', "[$uniq] Entrou no case PUT\n", FILE_APPEND);
    file_put_contents(__DIR__ . '/debug.txt', "[$uniq] Array data: " . print_r($data, true) . "\n", FILE_APPEND);
    
    $course_id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if (!$course_id) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'ID do curso é obrigatório']);
        exit;
    }

    $title = $data['title'] ?? '';
    $category_id = intval($data['category_id'] ?? 0);
    $description = $data['description'] ?? '';
    $level = $data['level'] ?? '';
    $featured = intval($data['featured'] ?? 0);
    $formatted_description = $data['formatted_description'] ?? '';
    $price = floatval($data['price'] ?? 0);
    $rating = floatval($data['rating'] ?? 0);
    $duration = $data['duration'] ?? '';
    $instructor = $data['instructor'] ?? '';
    $link_venda = $data['link_venda'] ?? '';
    $image = $data['image'] ?? '';
    $course_media = $data['course_media'] ?? [];
    $learning_objectives = $data['learning_objectives'] ?? [];

    $conn->begin_transaction();

    try {
        // Atualiza os dados principais do curso
        $stmt = $conn->prepare("UPDATE courses SET 
            title = ?, 
            category_id = ?, 
            description = ?, 
            level = ?, 
            featured = ?, 
            formatted_description = ?, 
            price = ?, 
            rating = ?, 
            duration = ?, 
            instructor = ?, 
            link_venda = ?,
            image = ?
            WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Erro na preparação da query: " . $conn->error);
        }
        $stmt->bind_param(
            "sissisddssssi",
            $title,                 // s
            $category_id,           // i
            $description,           // s
            $level,                 // s
            $featured,              // i
            $formatted_description, // s
            $price,                 // d
            $rating,                // d 
            $duration,              // s
            $instructor,            // s
            $link_venda,            // s
            $image,                 // s
            $course_id              // i
        );
        if (!$stmt->execute()) {
            throw new Exception("Erro ao executar UPDATE: " . $conn->error);
        }

        // Atualiza as mídias
        $stmt = $conn->prepare("DELETE FROM course_media WHERE course_id = ?");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();

        foreach ($course_media as $media) {
            $stmt = $conn->prepare("INSERT INTO course_media (course_id, type, url, title) VALUES (?, ?, ?, ?)");
            $type = $media['type'];
            $url = $media['url'];
            $media_title = $media['title'];
            $stmt->bind_param("isss", $course_id, $type, $url, $media_title);
            $stmt->execute();
        }

        // Atualiza os objetivos de aprendizagem
        $stmt = $conn->prepare("DELETE FROM course_learning_objective_items WHERE course_learning_objective_id IN (SELECT id FROM course_learning_objectives WHERE course_id = ?)");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();
        
        $stmt = $conn->prepare("DELETE FROM course_learning_objectives WHERE course_id = ?");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();

        foreach ($learning_objectives as $obj) {
            $stmt = $conn->prepare("INSERT INTO course_learning_objectives (course_id, title) VALUES (?, ?)");
            $objective_title = $obj['title'];
            $stmt->bind_param("is", $course_id, $objective_title);
            if (!$stmt->execute()) {
                error_log("[$uniq] Erro ao inserir objetivo: " . $stmt->error);
                file_put_contents(__DIR__ . '/debug.txt', "[$uniq] Erro ao inserir objetivo: " . $stmt->error . "\n", FILE_APPEND);
            }else {
                error_log("[$uniq] Objetivo inserido com sucesso: " . $objective_title . " | ID: " . $conn->insert_id);
                file_put_contents(__DIR__ . '/debug.txt', "[$uniq] Objetivo inserido com sucesso: " . $objective_title . " | ID: " . $conn->insert_id . "\n", FILE_APPEND);
            }
            $objective_id = $conn->insert_id;
        
            foreach ($obj['items'] as $item) {
                $item_text = is_array($item) ? $item['item'] : $item;
                $stmt = $conn->prepare("INSERT INTO course_learning_objective_items (course_learning_objective_id, item) VALUES (?, ?)");
                $stmt->bind_param("is", $objective_id, $item_text);
                if (!$stmt->execute()) {
                    error_log("[$uniq] Erro ao inserir item: " . $stmt->error);
                    file_put_contents(__DIR__ . '/debug.txt', "[$uniq] Erro ao inserir item: " . $stmt->error . "\n", FILE_APPEND);
                }else {
                    error_log("[$uniq] Item inserido com sucesso: " . $item_text);
                    file_put_contents(__DIR__ . '/debug.txt', "[$uniq] Item inserido com sucesso: " . $item_text . "\n", FILE_APPEND);
                }
            }
        }
        
        $conn->commit();

        header('Content-Type: application/json');
        header('Cache-Control: no-cache, must-revalidate');
        echo json_encode([
            'success' => true,
            'message' => 'Curso atualizado com sucesso',
            'data' => [
                'id' => $course_id,
                'title' => $title,
                'category_id' => $category_id,
                'description' => $description,
                'level' => $level,
                'featured' => $featured,
                'formatted_description' => $formatted_description,
                'price' => $price,
                'rating' => $rating,
                'duration' => $duration,
                'instructor' => $instructor,
                'link_venda' => $link_venda,
                'image' => $image,
                'course_media' => $course_media,
                'learning_objectives' => $learning_objectives
            ]
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        header('Content-Type: application/json');
        header('Cache-Control: no-cache, must-revalidate');
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar curso',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

function handleDelete($conn) {
    parse_str(file_get_contents("php://input"), $data);
    $course_id = intval($data['id'] ?? $_GET['id'] ?? 0);
    if (!$course_id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID do curso não informado']);
        exit;
    }
        
    // Remove todos os learning items associados aos learning objectives do curso
    $result = $conn->query("SELECT id FROM course_learning_objectives WHERE course_id = $course_id");
    while ($row = $result->fetch_assoc()) {
        $objective_id = $row['id'];
        $conn->query("DELETE FROM course_learning_objective_items WHERE course_learning_objective_id = $objective_id");
    }
        
    // Remove os learning objectives do curso
    $conn->query("DELETE FROM course_learning_objectives WHERE course_id = $course_id");
        
    // Remove as mídias do curso
    $conn->query("DELETE FROM course_media WHERE course_id = $course_id");
        
    // Remove o curso principal
    $conn->query("DELETE FROM courses WHERE id = $course_id");
        
    echo json_encode(['success' => true]);   
}