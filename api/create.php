<?php
require_once __DIR__ . '/../../includes/helpers.php';
require_method('POST');
$me = require_login();

function coords($c): array {
    if (!is_array($c) || count($c) !== 2 || !is_numeric($c[0]) || !is_numeric($c[1])) return [null, null];
    $lat = (float) $c[0]; $lng = (float) $c[1];
    if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) return [null, null];
    return [$lat, $lng];
}

$in = input();
$pickup = trim($in['pickupAddress'] ?? '');
$dropoff = trim($in['deliveryAddress'] ?? '');
$time = $in['pickupTime'] ?? '';
$item = $in['itemType'] ?? '';
$notes = trim($in['notes'] ?? '');

if ($pickup === '' || mb_strlen($pickup) > 500) fail('Pickup address is required');
if ($dropoff === '' || mb_strlen($dropoff) > 500) fail('Delivery address is required');
if (!in_array($item, ['tuxedo', 'gown', 'suit', 'dress', 'costume', 'other'], true)) fail('Please select a clothing type');

$dt = DateTime::createFromFormat('Y-m-d\TH:i', $time);
if (!$dt) fail('Invalid pickup time');
if ($dt < new DateTime('-5 minutes')) fail('Pickup time is in the past');

[$pLat, $pLng] = coords($in['pickupCoords'] ?? null);
[$dLat, $dLng] = coords($in['deliveryCoords'] ?? null);

$stmt = db()->prepare('INSERT INTO deliveries
    (user_id, pickup_address, delivery_address, pickup_time, item_type, notes, pickup_lat, pickup_lng, delivery_lat, delivery_lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->execute([$me, $pickup, $dropoff, $dt->format('Y-m-d H:i:s'), $item, $notes ?: null, $pLat, $pLng, $dLat, $dLng]);

json_out(['success' => true, 'id' => (int) db()->lastInsertId()], 201);
