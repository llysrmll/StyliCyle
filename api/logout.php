<?php
require_once __DIR__ . '/../../includes/helpers.php';
$_SESSION = [];
session_destroy();
json_out(['success' => true]);
