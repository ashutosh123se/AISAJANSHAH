<?php
/**
 * Express Reverse Proxy in PHP for Cloudways
 * Forwards all incoming requests under /api/* to http://127.0.0.1:5000/api/*
 */

error_reporting(0);
ini_set('display_errors', 0);

$request_uri = $_SERVER['REQUEST_URI'];
$url = "http://127.0.0.1:5000" . $request_uri;

$ch = curl_init($url);

// Forward all incoming HTTP request headers
$incoming_headers = [];
if (function_exists('getallheaders')) {
    $headers = getallheaders();
    foreach ($headers as $name => $value) {
        if (strtolower($name) !== 'host' && strtolower($name) !== 'content-length') {
            $incoming_headers[] = "$name: $value";
        }
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $incoming_headers);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);

// Forward POST / PUT / PATCH / DELETE request body payload
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Forward response headers
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

// Stream response data directly to client (supports Server-Sent Events / SSE for AI chat)
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
    echo $data;
    if (ob_get_level() > 0) ob_flush();
    flush();
    return strlen($data);
});

$success = curl_exec($ch);

if (!$success) {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode === 0) {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Backend server is starting or offline on port 5000.',
            'details' => curl_error($ch)
        ]);
    }
} else {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode > 0) {
        http_response_code($httpCode);
    }
}

curl_close($ch);
