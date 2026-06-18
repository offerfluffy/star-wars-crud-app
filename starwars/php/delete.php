<?php
require_once 'db.php';

if (!isset($_GET['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Brak identyfikatora rekordu']);
    exit;
}

$id = (int) $_GET['id'];

try {
    $stmt = $pdo->prepare("DELETE FROM characters WHERE id = ?");
    $stmt->execute([$id]);
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Błąd usuwania: ' . $e->getMessage()]);
}
?>