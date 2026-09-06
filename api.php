<?php
/**
 * Transparent proxy script to forward all /api/* HTTP requests
 * to the Node.js Express server running locally on port 5000.
 */

error_reporting(0);
ini_set('display_errors', 0);

$node_backend = 'http://127.0.0.1:5000';
$request_uri = $_SERVER['REQUEST_URI'];

$url = $node_backend . $request_uri;

$ch = curl_init($url);

// Forward request headers
$incoming_headers = [];
if (function_exists('getallheaders')) {
    $headers = getallheaders();
    foreach ($headers as $name => $value) {
        if (strtolower($name) !== 'host' && strtolower($name) !== 'content-length') {
            $incoming_headers[] = "$name: $value";
        }
    }
}

function execute_proxy_curl_api($url, $incoming_headers) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $incoming_headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
        $body = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }

    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) {
        $len = strlen($header);
        $parts = explode(':', $header, 2);
        if (count($parts) === 2) {
            $name = strtolower(trim($parts[0]));
            if (!in_array($name, ['transfer-encoding', 'content-length', 'connection'])) {
                header(trim($header));
            }
        }
        return $len;
    });

    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
        echo $data;
        if (ob_get_level() > 0) ob_flush();
        flush();
        return strlen($data);
    });

    $success = curl_exec($ch);
    $err = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['success' => $success, 'error' => $err, 'code' => $code];
}

$res = execute_proxy_curl_api($url, $incoming_headers);

// If port 5000 is down, auto-start Node backend and retry once!
if (!$res['success']) {
    $server_file = __DIR__ . '/backend/server.js';
    if (file_exists($server_file)) {
        @exec("nohup node " . escapeshellarg($server_file) . " > /tmp/server.log 2>&1 &");
        usleep(1500000); // Wait 1.5 seconds for Node server to start
        $res = execute_proxy_curl_api($url, $incoming_headers);
    }
}

if (!$res['success']) {
    http_response_code(503);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Backend server is starting or offline.',
        'details' => $res['error']
    ]);
}
