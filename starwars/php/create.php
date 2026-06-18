<?php
require_once 'db.php';

if (!isset($_POST['name'], $_POST['height'], $_POST['gender'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Brak wymaganych danych']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO characters (name, height, gender) VALUES (?, ?, ?)"
    );
    $stmt->execute([$_POST['name'], $_POST['height'], $_POST['gender']]);
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Błąd zapisu: ' . $e->getMessage()]);
}
?>