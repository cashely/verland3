import { defineConfig, type UserConfigExport } from '@tarojs/cli';
const path = require('path');
import devConfig from './dev';
import prodConfig from './prod';
import WindiCSS from 'vite-plugin-windicss';
import MiniProgramTailwind from '@dcasia/mini-program-tailwind-webpack-plugin/rollup';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'miniapp',
    date: '2025-2-7',
    designWidth(input) {
      // 配置 NutUI 375 尺寸
      if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
        return 375;
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750;
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    prefixer: false,
    compiler: {
      type: 'vite',
      vitePlugins: [
        WindiCSS({
          config: {
            extract: {
              // 忽略部分文件夹
              exclude: ['node_modules', '.git', 'dist'],
            },
            corePlugins: {
              // 禁用掉在小程序环境中不可能用到的 plugins
              container: false,
            },
          },
          scan: {
            dirs: ['.'], // 扫描项目根目录
            fileExtensions: ['vue', 'tsx', 'jsx'], // 支持的文件类型
          },
        }),
        MiniProgramTailwind({
          enableRpx: true,
        }),
      ],
    },
    plugins: ['@tarojs/plugin-html'],
    alias: {
      '@/apis': path.resolve(__dirname, '..', 'src/apis'),
      '@/components': path.resolve(__dirname, '..', 'src/components'),
      '@/constants': path.resolve(__dirname, '..', 'src/constants'),
      '@/utils': path.resolve(__dirname, '..', 'src/utils'),
      '@/hooks': path.resolve(__dirname, '..', 'src/hooks'),
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
        url: {
          enable: true,
          config: {
            limit: 10240, // 设定转换尺寸上限
          },
        },
        htmltransform: {
          enable: false,
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      esnextModules: ['taro-ui'],
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            propList: ['*'],
          },
        },
        tailwind: {
          //没用上
          enable: false,
          config: {
            content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
            extract: {
              include: ['src/**/*.{vue,html,jsx,tsx}'],
              exclude: ['node_modules', '.git'],
            },
          },
        },
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };

  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
