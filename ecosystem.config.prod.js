module.exports = {
  apps: [
    {
      name: "vitalink-backend",
      script: "npm",
      args: "run PRODAWS",
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