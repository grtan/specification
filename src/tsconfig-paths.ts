import { register } from 'tsconfig-paths'

// 让node支持ts的baseUrl，paths路径转换
register({
  baseUrl: __dirname,
  paths: {
    '@/*': ['*']
  }
})
