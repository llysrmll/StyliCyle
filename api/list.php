<?php
require_once __DIR__ . '/../../includes/helpers.php';
$me = require_login();

$stmt = db()->prepare('SELECT * FROM deliveries WHERE user_id = ? ORDER BY pickup_time DESC LIMIT 100');
$stmt->execute([$me]);

$out = array_map(fn($r) => [
    'id' => (int) $r['id'],
    'pickupAddress' => $r['pickup_address'],
    'deliveryAddress' => $r['delivery_address'],
    'pickupTime' => str_replace(' ', 'T', $r['pickup_time']),
    'itemType' => $r['item_type'],
    'notes' => $r['notes'],
    'status' => $r['status'],
    'pickupCoords' => $r['pickup_lat'] !== null ? [(float) $r['pickup_lat'], (float) $r['pickup_lng']] : null,
    'deliveryCoords' => $r['delivery_lat'] !== null ? [(float) $r['delivery_lat'], (float) $r['delivery_lng']] : null,
], $stmt->fetchAll());

json_out(['success' => true, 'deliveries' => $out]);
