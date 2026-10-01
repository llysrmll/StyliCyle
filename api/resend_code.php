<?php
require_once __DIR__ . '/../../includes/helpers.php';
require_method('POST');

$p = $_SESSION['pending_signup'] ?? null;
if (!$p) fail('No pending registration. Please sign up again.');
if (time() - $p['sent_at'] < 30) fail('Please wait a few seconds before requesting a new code', 429);

$code = (string) random_int(100000, 999999);
$_SESSION['pending_signup']['code'] = $code;
$_SESSION['pending_signup']['expires'] = time() + 600;
$_SESSION['pending_signup']['sent_at'] = time();
$_SESSION['pending_signup']['attempts'] = 0;

$res = ['success' => true];
if (DEV_MODE) $res['dev_code'] = $code;
json_out($res);
