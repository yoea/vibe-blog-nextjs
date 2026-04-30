// PM2 进程配置
// 定义主应用 (vibe_blog_next) 和 webhook 接收器两个进程
module.exports = {
  apps: [
    {
      name: 'vibe_blog_next',
      script: '.next/standalone/server.js',
      max_memory_restart: '512M',
      env: {
        PORT: 8083,
      },
    },
    {
      name: 'webhook',
      script: 'scripts/webhook-server.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        WEBHOOK_PORT: 8084,
        TZ: 'Asia/Shanghai',
      },
    },
  ],
};
