<?php
require_once __DIR__ . '/../../includes/helpers.php';
require_method('POST');

$in = input();
$email = strtolower(trim($in['email'] ?? ''));
$password = $in['password'] ?? '';

$stmt = db()->prepare('SELECT id, first_name, email, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    fail('Invalid email or password', 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];

json_out(['success' => true, 'user' => ['id' => (int) $user['id'], 'firstName' => $user['first_name'], 'email' => $user['email']]]);
