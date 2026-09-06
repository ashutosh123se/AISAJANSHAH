<?php
/**
 * Auto-Deployment Script for AI Sajan Shah
 * Accessible via https://ai01.sajanshah.com/deploy.php
 * Uses PM2 for persistent process management
 */

header('Content-Type: text/plain; charset=UTF-8');

echo "=========================================\n";
echo "    AI SAJAN SHAH AUTO-DEPLOYMENT\n";
echo "=========================================\n\n";

$cwd = __DIR__;
chdir($cwd);

echo "[1/5] Running Git Pull...\n";
$gitOutput = shell_exec('git pull origin main 2>&1');
echo $gitOutput ? $gitOutput : "No git output (or shell_exec disabled)\n";

echo "\n[2/5] Verifying backend/.env...\n";
$envPath = __DIR__ . '/backend/.env';
if (!file_exists($envPath)) {
    $envContent = "PORT=5000\nDEV_AUTH=true\n";
    file_put_contents($envPath, $envContent);
    echo "Created baseline backend/.env file.\n";
} else {
    echo "backend/.env exists.\n";
}

echo "\n[3/5] Checking PM2 installation...\n";
$pm2Check = trim(shell_exec('which pm2 2>/dev/null') ?? '');
if (empty($pm2Check)) {
    echo "Installing PM2...\n";
    shell_exec('npm install -g pm2 2>&1');
} else {
    echo "PM2 found at: $pm2Check\n";
}

echo "\n[4/5] Starting/Restarting Node Backend with PM2...\n";
$pm2Status = shell_exec('pm2 describe aisajanshah-backend 2>&1');
if (strpos($pm2Status, 'online') !== false || strpos($pm2Status, 'stopped') !== false) {
    // Process exists in PM2 — restart it
    $restartOut = shell_exec('pm2 restart ecosystem.config.js 2>&1');
    echo "Restarted: $restartOut\n";
} else {
    // First time or process not in PM2 — kill old nohup processes and start fresh
    shell_exec('pkill -9 -f "node backend/bundle.js" 2>&1');
    sleep(1);
    $startOut = shell_exec('pm2 start ecosystem.config.js 2>&1');
    echo "Started: $startOut\n";
}

// Save process list so PM2 remembers it after reboot
shell_exec('pm2 save 2>&1');
// Setup startup hook (auto-start PM2 on server reboot)
shell_exec('pm2 startup 2>/dev/null');

echo "\n[5/5] Verifying...\n";
sleep(2);
$health = shell_exec('curl -s http://127.0.0.1:5000/api/health 2>&1');
echo "Health check: $health\n";

$status = shell_exec('pm2 status 2>&1');
echo "\nPM2 Status:\n$status\n";

echo "\n=========================================\n";
echo "      DEPLOYMENT COMPLETE!\n";
echo "  Backend is managed by PM2 (auto-restart)\n";
echo "=========================================\n";
