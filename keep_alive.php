<?php
/**
 * Cron Job script for Cloudways.
 * Checks if Node.js backend on port 5000 is healthy; if not, starts it.
 */
$ch = curl_init('http://127.0.0.1:5000/api/health');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    $serverFile = __DIR__ . '/backend/server.js';
    @exec("nohup node " . escapeshellarg($serverFile) . " > /tmp/server.log 2>&1 &");
    echo "Node.js backend was offline. Triggered startup script.";
} else {
    echo "Node.js backend is healthy (HTTP 200).";
}
