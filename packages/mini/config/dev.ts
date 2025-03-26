import type { UserConfigExport } from "@tarojs/cli"

export default {
  cache: {
    enable: true,
  }, // 是否开启缓存
  mini: {},
  h5: {}
} satisfies UserConfigExport<'vite'>
