// ecosystem.config.js
module.exports = {
    apps : [{
      name: '它念api正式环境', // 给你的应用起一个名字，方便管理
      script: 'pnpm api:prod', // <-- 这里设置为你的 package.json 中的启动脚本命令 (例如 'pnpm start' 或 'pnpm serve')
  
      // 以下是一些常用的可选配置：
      instances: 1, // 应用实例数量，如果是 Node.js 应用，通常可以设置为 'max' 来利用多核
      autorestart: true, // 应用崩溃时自动重启
      watch: false, // 是否监听文件变化并重启 (生产环境通常设置为 false)
      max_memory_restart: '3G', // 内存占用超过 1GB 时重启
      env: {
        NODE_ENV: 'development' // 开发环境环境变量
      },
      env_production: {
        NODE_ENV: 'production', // 生产环境环境变量
        // ... 其他生产环境特定的环境变量
      }
    }]
  };