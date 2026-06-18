<?php
require_once 'db.php';

try {
    $sql = "SELECT * FROM characters ORDER BY id DESC";
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();
    
    header('Content-Type: application/json');
    echo json_encode($rows);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Błąd zapytania: ' . $e->getMessage()
    ]);
}
?>