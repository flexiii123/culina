<?php
/**
 * Culina Backend API
 * Haupteinstiegspunkt
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'Culina Backend API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => [
            'register' => 'POST /api/auth/register.php',
            'login' => 'POST /api/auth/login.php'
        ],
        'recipes' => [
            'list' => 'GET /api/recipes/list.php',
            'detail' => 'GET /api/recipes/detail.php?id={id}',
            'create' => 'POST /api/recipes/create.php (requires auth)'
        ],
        'ratings' => [
            'create' => 'POST /api/ratings/create.php (requires auth)'
        ]
    ],
    'documentation' => 'See README.md for full documentation'
], JSON_PRETTY_PRINT);
