<?php
// Returns the logged-in user's own listings (the "Saved Listings" panel)
require_once __DIR__ . '/../../includes/helpers.php';
$me = require_login();

$stmt = db()->prepare('SELECT id, title, category, size, price_per_day, description, image, status
                       FROM rentals WHERE owner_id = ? ORDER BY id DESC LIMIT 100');
$stmt->execute([$me]);
json_out(['success' => true, 'rentals' => $stmt->fetchAll()]);
