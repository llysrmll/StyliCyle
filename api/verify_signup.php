<?php
// Step 2 of registration: check the code, then create the account and log the user in.
require_once __DIR__ . '/../../includes/helpers.php';
require_method('POST');

$p = $_SESSION['pending_signup'] ?? null;
if (!$p) fail('No pending registration. Please sign up again.');
if (time() > $p['expires']) { unset($_SESSION['pending_signup']); fail('Code expired. Please sign up again.'); }
if ($p['attempts'] >= 5)    { unset($_SESSION['pending_signup']); fail('Too many wrong attempts. Please sign up again.', 429); }

$code = trim((string) (input()['code'] ?? ''));
if (!hash_equals($p['code'], $code)) {
    $_SESSION['pending_signup']['attempts']++;
    fail('Invalid code. Please try again.');
}

try {
    $stmt = db()->prepare('INSERT INTO users (first_name, middle_name, last_name, age, email, password_hash)
                           VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$p['first'], $p['middle'] ?: null, $p['last'], $p['age'], $p['email'], $p['password_hash']]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') fail('This email is already registered', 409);
    throw $e;
}

$id = (int) db()->lastInsertId();
unset($_SESSION['pending_signup']);
session_regenerate_id(true);
$_SESSION['user_id'] = $id;

json_out(['success' => true, 'user' => ['id' => $id, 'firstName' => $p['first'], 'email' => $p['email']]], 201);
