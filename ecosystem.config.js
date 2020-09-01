module.exports = {
  apps: [
    {
      name: 'true-cards-server',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
