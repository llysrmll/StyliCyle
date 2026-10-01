<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/db.php';

date_default_timezone_set('Asia/Manila');
ini_set('display_errors', '0');   // PHP warnings must never break the JSON output

session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();
header('Content-Type: application/json; charset=utf-8');

set_exception_handler(function (Throwable $e) {
    error_log((string) $e);
    json_out(['success' => false, 'error' => DEV_MODE ? $e->getMessage() : 'Server error'], 500);
});

function json_out(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function fail(string $msg, int $code = 400): never {
    json_out(['success' => false, 'error' => $msg], $code);
}

// JSON body, or form fields when the page sends FormData (file uploads)
function input(): array {
    static $data = null;
    if ($data === null) {
        $json = json_decode(file_get_contents('php://input') ?: '', true);
        $data = is_array($json) ? $json : $_POST;
    }
    return $data;
}

function require_method(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== $method) fail('Method not allowed', 405);
}

function require_login(): int {
    if (empty($_SESSION['user_id'])) fail('Not logged in', 401);
    return (int) $_SESSION['user_id'];
}

// Validates + stores an uploaded image, returns path relative to the project root
function save_image(array $file, string $subdir): ?string {
    if ($file['error'] === UPLOAD_ERR_NO_FILE) return null;
    if ($file['error'] !== UPLOAD_ERR_OK) fail('Image upload failed');
    if ($file['size'] > 2 * 1024 * 1024) fail('Image must be under 2MB');

    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset($allowed[$mime])) fail('Only JPG, PNG or WEBP images are allowed');

    $name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
    $dir = __DIR__ . '/../uploads/' . $subdir;
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) fail('Could not save image', 500);
    return "uploads/$subdir/$name";
}
