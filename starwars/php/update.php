<?php
require_once 'db.php';

if (!isset($_POST['id'], $_POST['name'], $_POST['height'], $_POST['gender'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Brak wymaganych danych']);
    exit;
}

$id = (int) $_POST['id'];
$name = $_POST['name'];
$height = $_POST['height'];
$gender = $_POST['gender'];
$image_url = isset($_POST['image_url']) ? $_POST['image_url'] : '';

try {
    $stmt = $pdo->prepare(
        "UPDATE characters SET name = ?, height = ?, gender = ?, image_url = ? WHERE id = ?"
    );
    $stmt->execute([$name, $height, $gender, $image_url, $id]);
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Błąd aktualizacji: ' . $e->getMessage()]);
}
?>