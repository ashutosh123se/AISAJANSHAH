<?php
/**
 * Auto-Deployment Script for AI Sajan Shah
 * Accessible via https://ai01.sajanshah.com/deploy.php
 */

header('Content-Type: text/plain; charset=UTF-8');

echo "=========================================\n";
echo "    AI SAJAN SHAH AUTO-DEPLOYMENT\n";
echo "=========================================\n\n";

$cwd = __DIR__;
chdir($cwd);

echo "[1/4] Running Git Pull...\n";
$gitOutput = shell_exec('git pull origin main 2>&1');
echo $gitOutput ? $gitOutput : "No git output (or shell_exec disabled)\n";

echo "\n[2/4] Verifying backend/.env...\n";
$envPath = __DIR__ . '/backend/.env';
if (!file_exists($envPath)) {
    // Read from env or reconstruct if missing
    $envContent = "PORT=5000\nDEV_AUTH=true\n";
    file_put_contents($envPath, $envContent);
    echo "Created baseline backend/.env file.\n";
} else {
    echo "backend/.env exists.\n";
}

echo "\n[3/4] Restarting Node Backend process...\n";
shell_exec('pkill -9 -f node 2>&1');
sleep(1);

$cmd = 'PORT=5000 nohup node ' . escapeshellarg(__DIR__ . '/backend/bundle.js') . ' > /tmp/server.log 2>&1 &';
shell_exec($cmd);
echo "Backend process launched on port 5000.\n";

echo "\n[4/4] Verifying Git Status...\n";
$status = shell_exec('git status 2>&1');
echo $status;

echo "\n=========================================\n";
echo "      DEPLOYMENT COMPLETE!\n";
echo "=========================================\n";
