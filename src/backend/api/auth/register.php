<?php
/**
 * Benutzer-Registrierung
 * POST /api/auth/register.php
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
    if (empty($data->name) || empty($data->email) || empty($data->password)) {
        sendError('Name, E-Mail und Passwort sind erforderlich');
    }
    
    $name = sanitizeInput($data->name);
    $email = sanitizeInput($data->email);
    $password = $data->password;
    
    // E-Mail validieren
    if (!validateEmail($email)) {
        sendError('Ungültige E-Mail-Adresse');
    }
    
    // Passwort validieren
    if (strlen($password) < 6) {
        sendError('Passwort muss mindestens 6 Zeichen lang sein');
    }
    
    // Datenbankverbindung
    $database = new Database();
    $db = $database->getConnection();
    
    // Prüfen, ob E-Mail bereits existiert
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        sendError('E-Mail-Adresse wird bereits verwendet');
    }
    
    // Avatar generieren (DiceBear API)
    $avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($name);
    
    // Passwort hashen
    $hashedPassword = hashPassword($password);
    
    // Benutzer erstellen
    $query = "INSERT INTO users (name, email, password, avatar) VALUES (:name, :email, :password, :avatar)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':avatar', $avatar);
    
    if ($stmt->execute()) {
        $userId = $db->lastInsertId();
        
        // Token generieren
        $token = generateToken($userId);
        
        // Benutzerdaten zurückgeben
        sendSuccess('Registrierung erfolgreich', [
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'avatar' => $avatar
            ],
            'token' => $token
        ]);
    } else {
        sendError('Registrierung fehlgeschlagen', 500);
    }
    
} catch (Exception $e) {
    sendError('Serverfehler: ' . $e->getMessage(), 500);
}
