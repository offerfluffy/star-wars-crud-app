<?php
require_once __DIR__ . '/db.php';

try {
    // Add image_url column if it doesn't already exist
    $pdo->exec("ALTER TABLE characters ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)");
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Tabela characters została pomyślnie zaktualizowana (dodano kolumnę image_url).'
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Błąd migracji bazy danych: ' . $e->getMessage()
    ]);
}
?>
