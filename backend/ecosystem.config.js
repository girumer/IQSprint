// pm2 config: keeps the backend running and restarts it if it crashes.
// Start with:  pm2 start ecosystem.config.js   then: pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: "iqsprint-api",
      script: "app.js",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "300M",
    },
  ],
};
