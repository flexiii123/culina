<?php
/**
 * Alle Rezepte abrufen
 * GET /api/recipes/list.php
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
    // Datenbankverbindung
    $database = new Database();
    $db = $database->getConnection();
    
    // Pagination-Parameter
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;
    
    // Rezepte mit Benutzerinformationen und durchschnittlicher Bewertung abrufen
    $query = "SELECT 
                r.id,
                r.title,
                r.description,
                r.image,
                r.cook_time,
                r.difficulty,
                r.created_at,
                u.id as author_id,
                u.name as author_name,
                u.avatar as author_avatar,
                COALESCE(AVG(rat.rating), 0) as average_rating,
                COUNT(DISTINCT rat.id) as rating_count
              FROM recipes r
              INNER JOIN users u ON r.user_id = u.id
              LEFT JOIN ratings rat ON r.id = rat.recipe_id
              GROUP BY r.id
              ORDER BY r.created_at DESC
              LIMIT :limit OFFSET :offset";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $recipes = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $recipes[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'image' => $row['image'],
            'cookTime' => $row['cook_time'],
            'difficulty' => $row['difficulty'],
            'author' => $row['author_name'],
            'authorId' => (int)$row['author_id'],
            'authorAvatar' => $row['author_avatar'],
            'averageRating' => round((float)$row['average_rating'], 1),
            'ratingCount' => (int)$row['rating_count'],
            'createdAt' => $row['created_at']
        ];
    }
    
    // Gesamtanzahl für Pagination
    $countQuery = "SELECT COUNT(*) as total FROM recipes";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute();
    $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    sendSuccess('Rezepte erfolgreich abgerufen', [
        'recipes' => $recipes,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => (int)$total,
            'totalPages' => ceil($total / $limit)
        ]
    ]);
    
} catch (Exception $e) {
    sendError('Serverfehler: ' . $e->getMessage(), 500);
}
