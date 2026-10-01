<?php
// Called by common.js on every protected page: returns the logged-in user or 401
require_once __DIR__ . '/../../includes/helpers.php';
$id = require_login();
$stmt = db()->prepare('SELECT id, first_name, middle_name, last_name, age, email, phone, avatar FROM users WHERE id = ?');
$stmt->execute([$id]);
$user = $stmt->fetch();
if (!$user) { $_SESSION = []; fail('Not logged in', 401); }
json_out(['success' => true, 'user' => $user]);
