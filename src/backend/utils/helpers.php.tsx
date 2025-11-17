<?php
/**
 * Hilfsfunktionen
 */

// CORS-Header setzen für Frontend-Zugriff
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}

// JSON-Antwort senden
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Fehlerantwort senden
function sendError($message, $statusCode = 400) {
    sendJsonResponse([
        'success' => false,
        'message' => $message
    ], $statusCode);
}

// Erfolgsantwort senden
function sendSuccess($message, $data = null) {
    $response = [
        'success' => true,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    sendJsonResponse($response);
}

// Input validieren und sanitizen
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// E-Mail validieren
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Passwort hashen
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Passwort verifizieren
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// JWT-Token generieren (vereinfachte Version)
function generateToken($userId) {
    $secret = "CULINA_SECRET_KEY_2024"; // In Produktion: Umgebungsvariable verwenden!
    $issuedAt = time();
    $expire = $issuedAt + 3600 * 24 * 7; // 7 Tage gültig
    
    $payload = base64_encode(json_encode([
        'user_id' => $userId,
        'iat' => $issuedAt,
        'exp' => $expire
    ]));
    
    $signature = hash_hmac('sha256', $payload, $secret);
    
    return $payload . '.' . $signature;
}

// JWT-Token validieren
function validateToken($token) {
    if (!$token) {
        return false;
    }
    
    $secret = "CULINA_SECRET_KEY_2024";
    $parts = explode('.', $token);
    
    if (count($parts) !== 2) {
        return false;
    }
    
    $payload = $parts[0];
    $signature = $parts[1];
    
    // Signatur prüfen
    $expectedSignature = hash_hmac('sha256', $payload, $secret);
    
    if ($signature !== $expectedSignature) {
        return false;
    }
    
    // Payload dekodieren
    $data = json_decode(base64_decode($payload), true);
    
    // Ablaufzeit prüfen
    if ($data['exp'] < time()) {
        return false;
    }
    
    return $data['user_id'];
}

// Datei-Upload verarbeiten
function handleFileUpload($file, $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'], $maxSize = 5242880) {
    // Fehlerprüfung
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Upload-Fehler: ' . $file['error']);
    }
    
    // Dateityp prüfen
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('Ungültiger Dateityp. Erlaubt sind: ' . implode(', ', $allowedTypes));
    }
    
    // Dateigröße prüfen
    if ($file['size'] > $maxSize) {
        throw new Exception('Datei zu groß. Maximum: ' . ($maxSize / 1024 / 1024) . 'MB');
    }
    
    // Eindeutigen Dateinamen generieren
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('recipe_', true) . '.' . $extension;
    
    // Upload-Verzeichnis erstellen, falls nicht vorhanden
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $destination = $uploadDir . $filename;
    
    // Datei verschieben
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('Fehler beim Speichern der Datei');
    }
    
    return 'uploads/' . $filename;
}

// Aktuellen Benutzer aus Token abrufen
function getCurrentUser($db) {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        return null;
    }
    
    $userId = validateToken($token);
    
    if (!$userId) {
        return null;
    }
    
    // Benutzer aus Datenbank laden
    $query = "SELECT id, name, email, avatar FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $userId);
    $stmt->execute();
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
