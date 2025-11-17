<?php
/**
 * Bewertung erstellen (Ajax)
 * POST /api/ratings/create.php
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
    
    // Daten abrufen
    $data = json_decode(file_get_contents("php://input"));
    
    // Validierung
    if (empty($data->recipe_id) || empty($data->rating)) {
        sendError('Rezept-ID und Bewertung sind erforderlich');
    }
    
    $recipeId = (int)$data->recipe_id;
    $rating = (int)$data->rating;
    $comment = isset($data->comment) ? sanitizeInput($data->comment) : null;
    
    // Bewertung validieren (1-5 Sterne)
    if ($rating < 1 || $rating > 5) {
        sendError('Bewertung muss zwischen 1 und 5 liegen');
    }
    
    // Prüfen, ob Rezept existiert
    $checkRecipeQuery = "SELECT id FROM recipes WHERE id = :id";
    $checkRecipeStmt = $db->prepare($checkRecipeQuery);
    $checkRecipeStmt->bindParam(':id', $recipeId, PDO::PARAM_INT);
    $checkRecipeStmt->execute();
    
    if ($checkRecipeStmt->rowCount() === 0) {
        sendError('Rezept nicht gefunden', 404);
    }
    
    // Prüfen, ob Benutzer bereits bewertet hat
    $checkRatingQuery = "SELECT id FROM ratings WHERE recipe_id = :recipe_id AND user_id = :user_id";
    $checkRatingStmt = $db->prepare($checkRatingQuery);
    $checkRatingStmt->bindParam(':recipe_id', $recipeId, PDO::PARAM_INT);
    $checkRatingStmt->bindParam(':user_id', $currentUser['id'], PDO::PARAM_INT);
    $checkRatingStmt->execute();
    
    if ($checkRatingStmt->rowCount() > 0) {
        sendError('Du hast dieses Rezept bereits bewertet');
    }
    
    // Bewertung erstellen
    $query = "INSERT INTO ratings (recipe_id, user_id, rating, comment) 
              VALUES (:recipe_id, :user_id, :rating, :comment)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':recipe_id', $recipeId, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $currentUser['id'], PDO::PARAM_INT);
    $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
    $stmt->bindParam(':comment', $comment);
    
    if ($stmt->execute()) {
        $ratingId = $db->lastInsertId();
        
        // Neue Durchschnittsbewertung berechnen
        $avgQuery = "SELECT AVG(rating) as avg_rating, COUNT(*) as count 
                     FROM ratings WHERE recipe_id = :recipe_id";
        $avgStmt = $db->prepare($avgQuery);
        $avgStmt->bindParam(':recipe_id', $recipeId, PDO::PARAM_INT);
        $avgStmt->execute();
        $avgData = $avgStmt->fetch(PDO::FETCH_ASSOC);
        
        sendSuccess('Bewertung erfolgreich erstellt', [
            'rating' => [
                'id' => (int)$ratingId,
                'userId' => $currentUser['id'],
                'userName' => $currentUser['name'],
                'userAvatar' => $currentUser['avatar'],
                'rating' => $rating,
                'comment' => $comment,
                'createdAt' => date('Y-m-d H:i:s')
            ],
            'averageRating' => round((float)$avgData['avg_rating'], 1),
            'totalRatings' => (int)$avgData['count']
        ]);
    } else {
        sendError('Fehler beim Erstellen der Bewertung', 500);
    }
    
} catch (Exception $e) {
    sendError('Serverfehler: ' . $e->getMessage(), 500);
}
