module.exports = {
  apps: [
    {
      name: 'aisajanshah-backend',
      script: 'backend/server.js',
      cwd: '/home/master/applications/jpkbjeavpe/public_html',
      env: {
        PORT: 5000,
        NODE_ENV: 'production',
      },
      // Auto-restart if it crashes
      autorestart: true,
      // Restart if memory exceeds 300MB
      max_memory_restart: '300M',
      // Wait 1s before restarting
      restart_delay: 1000,
      // Max 10 restarts in 15 minutes window before stopping
      max_restarts: 10,
      min_uptime: '10s',
      // Log files
      error_file: '/tmp/aisajan-error.log',
      out_file: '/tmp/aisajan-out.log',
      merge_logs: true,
      // Watch for crashes but don't watch files (deploy handles restarts)
      watch: false,
    },
  ],
};
