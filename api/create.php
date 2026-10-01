<?php
// Receives the rental form as FormData (so the photo can be uploaded)
require_once __DIR__ . '/../../includes/helpers.php';
require_method('POST');
$me = require_login();

function measure($v, string $label): ?float {
    if ($v === null || $v === '') return null;
    if (!is_numeric($v) || $v < 0 || $v > 500) fail("Invalid $label");
    return (float) $v;
}

$in = input();
$title = trim($in['title'] ?? '');
$category = trim($in['category'] ?? '');
$size = $in['size'] ?? '';
$desc = trim($in['description'] ?? '');
$price = $in['price_per_day'] ?? '';

if ($title === '' || mb_strlen($title) > 150) fail('Item name is required');
if ($category === '' || mb_strlen($category) > 100) fail('Category is required');
if (!in_array($size, ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'], true)) fail('Please select a size');
if ($desc === '') fail('Description is required');
if (!is_numeric($price) || $price <= 0 || $price > 1000000) fail('Enter a valid price per day');
if (empty($in['agree_terms']) || empty($in['verify_condition'])) fail('You must agree to the terms and verify the item condition');

$chest  = measure($in['chest_cm'] ?? null, 'chest/bust');
$waist  = measure($in['waist_cm'] ?? null, 'waist');
$length = measure($in['length_cm'] ?? null, 'length');

$image = isset($_FILES['image']) ? save_image($_FILES['image'], 'rentals') : null;

$stmt = db()->prepare('INSERT INTO rentals (owner_id, title, category, size, chest_cm, waist_cm, length_cm, price_per_day, description, image)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->execute([$me, $title, $category, $size, $chest, $waist, $length, $price, $desc, $image]);

json_out(['success' => true, 'id' => (int) db()->lastInsertId()], 201);
