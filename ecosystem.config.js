module.exports = {
  apps: [
    {
      name: "protiva502",
      script: "npm",
      args: "start",
      instances: "max",
      exec_mode: "cluster",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
