<?php
// Step 1 of registration: validate, then create a 6-digit code and keep the pending signup in the session.
require_once __DIR__ . '/../../includes/helpers.php';
require_method('POST');

$in = input();
$first  = trim($in['firstName'] ?? '');
$middle = trim($in['middleName'] ?? '');
$last   = trim($in['lastName'] ?? '');
$age    = $in['age'] ?? '';
$email  = strtolower(trim($in['email'] ?? ''));
$password = $in['password'] ?? '';

if ($first === '' || mb_strlen($first) > 60) fail('First name is required');
if ($last === ''  || mb_strlen($last) > 60)  fail('Last name is required');
if (mb_strlen($middle) > 60) fail('Middle name is too long');
if (!is_numeric($age) || (int) $age < 1 || (int) $age > 120) fail('Please enter a valid age');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Invalid email address');
if (strlen($password) < 8) fail('Password must be at least 8 characters');

$stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) fail('This email is already registered', 409);

$code = (string) random_int(100000, 999999);
$_SESSION['pending_signup'] = [
    'first' => $first, 'middle' => $middle, 'last' => $last, 'age' => (int) $age,
    'email' => $email, 'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    'code' => $code, 'expires' => time() + 600, 'sent_at' => time(), 'attempts' => 0,
];

// TODO (production): email $code to $email (e.g. with PHPMailer) and set DEV_MODE = false
$res = ['success' => true, 'email' => $email];
if (DEV_MODE) $res['dev_code'] = $code;
json_out($res);
