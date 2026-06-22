<?php
require_once 'db.php';

if (!isset($_POST['name'], $_POST['height'], $_POST['gender'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Brak wymaganych danych']);
    exit;
}

try {
    $image_url = isset($_POST['image_url']) ? $_POST['image_url'] : '';
    $stmt = $pdo->prepare(
        "INSERT INTO characters (name, height, gender, image_url) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$_POST['name'], $_POST['height'], $_POST['gender'], $image_url]);
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Błąd zapisu: ' . $e->getMessage()]);
}
?>