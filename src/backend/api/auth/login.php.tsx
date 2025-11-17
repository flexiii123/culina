<?php
/**
 * Benutzer-Login
 * POST /api/auth/login.php
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
    // Daten abrufen
    $data = json_decode(file_get_contents("php://input"));
    
    // Validierung
    if (empty($data->email) || empty($data->password)) {
        sendError('E-Mail und Passwort sind erforderlich');
    }
    
    $email = sanitizeInput($data->email);
    $password = $data->password;
    
    // Datenbankverbindung
    $database = new Database();
    $db = $database->getConnection();
    
    // Benutzer suchen
    $query = "SELECT id, name, email, password, avatar FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        sendError('Ungültige Anmeldedaten', 401);
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Passwort prüfen
    if (!verifyPassword($password, $user['password'])) {
        sendError('Ungültige Anmeldedaten', 401);
    }
    
    // Token generieren
    $token = generateToken($user['id']);
    
    // Benutzerdaten zurückgeben (ohne Passwort)
    sendSuccess('Login erfolgreich', [
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'avatar' => $user['avatar']
        ],
        'token' => $token
    ]);
    
} catch (Exception $e) {
    sendError('Serverfehler: ' . $e->getMessage(), 500);
}
