module.exports = {
  apps: [
    {
      name: "vitalink-backend",
      script: "npm",
      args: "run DevAWS",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};