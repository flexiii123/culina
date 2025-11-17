<?php
/**
 * Rezept-Details abrufen
 * GET /api/recipes/detail.php?id=1
 */

require_once '../../config/database.php';
require_once '../../utils/helpers.php';

setCorsHeaders();

// OPTIONS-Request für CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Nur GET-Requests erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Methode nicht erlaubt', 405);
}

try {
    // ID validieren
    if (empty($_GET['id'])) {
        sendError('Rezept-ID ist erforderlich');
    }
    
    $recipeId = (int)$_GET['id'];
    
    // Datenbankverbindung
    $database = new Database();
    $db = $database->getConnection();
    
    // Rezept mit Benutzerinformationen abrufen
    $query = "SELECT 
                r.id,
                r.title,
                r.description,
                r.image,
                r.cook_time,
                r.difficulty,
                r.ingredients,
                r.instructions,
                r.created_at,
                u.id as author_id,
                u.name as author_name,
                u.avatar as author_avatar
              FROM recipes r
              INNER JOIN users u ON r.user_id = u.id
              WHERE r.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $recipeId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        sendError('Rezept nicht gefunden', 404);
    }
    
    $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Bewertungen abrufen
    $ratingsQuery = "SELECT 
                        rat.id,
                        rat.rating,
                        rat.comment,
                        rat.created_at,
                        u.id as user_id,
                        u.name as user_name,
                        u.avatar as user_avatar
                     FROM ratings rat
                     INNER JOIN users u ON rat.user_id = u.id
                     WHERE rat.recipe_id = :recipe_id
                     ORDER BY rat.created_at DESC";
    
    $ratingsStmt = $db->prepare($ratingsQuery);
    $ratingsStmt->bindParam(':recipe_id', $recipeId, PDO::PARAM_INT);
    $ratingsStmt->execute();
    
    $ratings = [];
    $ratingSum = 0;
    
    while ($row = $ratingsStmt->fetch(PDO::FETCH_ASSOC)) {
        $ratings[] = [
            'id' => (int)$row['id'],
            'userId' => (int)$row['user_id'],
            'userName' => $row['user_name'],
            'userAvatar' => $row['user_avatar'],
            'rating' => (int)$row['rating'],
            'comment' => $row['comment'],
            'createdAt' => $row['created_at']
        ];
        $ratingSum += (int)$row['rating'];
    }
    
    $averageRating = count($ratings) > 0 ? round($ratingSum / count($ratings), 1) : 0;
    
    // Rezeptdaten zusammenstellen
    $recipeData = [
        'id' => (int)$recipe['id'],
        'title' => $recipe['title'],
        'description' => $recipe['description'],
        'image' => $recipe['image'],
        'cookTime' => $recipe['cook_time'],
        'difficulty' => $recipe['difficulty'],
        'ingredients' => json_decode($recipe['ingredients']),
        'instructions' => json_decode($recipe['instructions']),
        'author' => $recipe['author_name'],
        'authorId' => (int)$recipe['author_id'],
        'authorAvatar' => $recipe['author_avatar'],
        'ratings' => $ratings,
        'averageRating' => $averageRating,
        'createdAt' => $recipe['created_at']
    ];
    
    sendSuccess('Rezept erfolgreich abgerufen', $recipeData);
    
} catch (Exception $e) {
    sendError('Serverfehler: ' . $e->getMessage(), 500);
}
