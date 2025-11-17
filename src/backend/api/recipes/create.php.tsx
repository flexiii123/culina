<?php
/**
 * Rezept erstellen (mit Datei-Upload)
 * POST /api/recipes/create.php
 */

require_once '../../config/database.php';
require_once '../../utils/helpers.php';

setCorsHeaders();

// OPTIONS-Request für CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Nur POST-Requests erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Methode nicht erlaubt', 405);
}

try {
    // Datenbankverbindung
    $database = new Database();
    $db = $database->getConnection();
    
    // Authentifizierung prüfen
    $currentUser = getCurrentUser($db);
    
    if (!$currentUser) {
        sendError('Nicht authentifiziert', 401);
    }
    
    // Validierung
    if (empty($_POST['title']) || empty($_POST['description']) || 
        empty($_POST['cookTime']) || empty($_POST['difficulty'])) {
        sendError('Alle Pflichtfelder müssen ausgefüllt sein');
    }
    
    if (empty($_FILES['image'])) {
        sendError('Bild ist erforderlich');
    }
    
    // Daten sanitizen
    $title = sanitizeInput($_POST['title']);
    $description = sanitizeInput($_POST['description']);
    $cookTime = sanitizeInput($_POST['cookTime']);
    $difficulty = sanitizeInput($_POST['difficulty']);
    
    // Schwierigkeitsgrad validieren
    $allowedDifficulties = ['Einfach', 'Mittel', 'Schwer'];
    if (!in_array($difficulty, $allowedDifficulties)) {
        sendError('Ungültiger Schwierigkeitsgrad');
    }
    
    // JSON-Arrays dekodieren
    $ingredients = json_decode($_POST['ingredients'], true);
    $instructions = json_decode($_POST['instructions'], true);
    
    if (!is_array($ingredients) || !is_array($instructions)) {
        sendError('Ungültiges Format für Zutaten oder Anweisungen');
    }
    
    if (count($ingredients) === 0 || count($instructions) === 0) {
        sendError('Mindestens eine Zutat und eine Anweisung sind erforderlich');
    }
    
    // Bild hochladen
    $imagePath = handleFileUpload($_FILES['image']);
    
    // Rezept in Datenbank speichern
    $query = "INSERT INTO recipes 
              (user_id, title, description, image, cook_time, difficulty, ingredients, instructions) 
              VALUES 
              (:user_id, :title, :description, :image, :cook_time, :difficulty, :ingredients, :instructions)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':user_id', $currentUser['id']);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':image', $imagePath);
    $stmt->bindParam(':cook_time', $cookTime);
    $stmt->bindParam(':difficulty', $difficulty);
    
    $ingredientsJson = json_encode($ingredients);
    $instructionsJson = json_encode($instructions);
    
    $stmt->bindParam(':ingredients', $ingredientsJson);
    $stmt->bindParam(':instructions', $instructionsJson);
    
    if ($stmt->execute()) {
        $recipeId = $db->lastInsertId();
        
        sendSuccess('Rezept erfolgreich erstellt', [
            'recipe_id' => $recipeId,
            'title' => $title,
            'image' => $imagePath
        ]);
    } else {
        sendError('Fehler beim Erstellen des Rezepts', 500);
    }
    
} catch (Exception $e) {
    sendError('Serverfehler: ' . $e->getMessage(), 500);
}
