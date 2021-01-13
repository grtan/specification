# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://gitlab.vmic.xyz///compare/v1.2.0-beta.1...v1.2.0) (2021-01-13)

## [1.2.0-beta.1](https://gitlab.vmic.xyz///compare/v1.2.0-beta.0...v1.2.0-beta.1) (2021-01-13)


### Features

* 新增less支持，同时对eslint、stylelint规则进行优化 ([ead0af0](https://gitlab.vmic.xyz///commit/ead0af0475ee5c89b18f6595f4ef7375fdf53f03))


### Bug Fixes

* 优化自动安装npm包的版本范围 ([e7b0cb9](https://gitlab.vmic.xyz///commit/e7b0cb9d3c511576218cd49c3a9680b15a43fcf0))

## [1.2.0-beta.0](https://gitlab.vmic.xyz///compare/v1.1.3-beta.2...v1.2.0-beta.0) (2020-12-16)


### Features

* 设置git不忽略相关的文件 ([e2b3d84](https://gitlab.vmic.xyz///commit/e2b3d84d5bdf50464b2f25622e83e5e2221ed492))


### Bug Fixes

* 新增取消全局prettier配置文件的设置；完善文档 ([3d68bc2](https://gitlab.vmic.xyz///commit/3d68bc27155876ac8f61896145be39393ab9e15a))

### [1.1.3](https://gitlab.vmic.xyz///compare/v1.1.3-beta.2...v1.1.3) (2020-12-02)

### [1.1.3-beta.2](https://gitlab.vmic.xyz///compare/v1.1.3-beta.1...v1.1.3-beta.2) (2020-12-02)


### Bug Fixes

* 添加查看版本的命令 ([5287fd2](https://gitlab.vmic.xyz///commit/5287fd267f69c1eb81971a1cd6dff0cd5adac85e))

### [1.1.3-beta.1](https://gitlab.vmic.xyz///compare/v1.1.3-beta.0...v1.1.3-beta.1) (2020-12-02)


### Bug Fixes

* 不校验某些类型文件时，清理对应的配置文件、npm包等；.vscode/settings.json采用覆盖的方式 ([ea30a6d](https://gitlab.vmic.xyz///commit/ea30a6db9ad3a93e880ba108153c7ccffbb4ab01))

### [1.1.3-beta.0](https://gitlab.vmic.xyz///compare/v1.1.2-beta.0...v1.1.3-beta.0) (2020-11-23)


### Bug Fixes

* 优化命令使用体验 ([0852d12](https://gitlab.vmic.xyz///commit/0852d12c799891c2dee3781914f7d293dcd2e44c))
* 修复code命令设置无效的问题 ([4c39fce](https://gitlab.vmic.xyz///commit/4c39fce329f48c791243333efcaaab6998a38d0b))
* 修复没有自动安装vscode插件的问题 ([64076eb](https://gitlab.vmic.xyz///commit/64076eb53aeb7138e82ebfeecc5d1d3fddbb7b4a))

### [1.1.2](https://gitlab.vmic.xyz///compare/v1.1.2-beta.0...v1.1.2) (2020-11-21)

### [1.1.2-beta.0](https://gitlab.vmic.xyz///compare/v1.1.1-beta.2...v1.1.2-beta.0) (2020-11-21)


### Bug Fixes

* 修复npm-cli-login登录时使用默认npm仓库的问题 ([c4ef91f](https://gitlab.vmic.xyz///commit/c4ef91f229485fb28207537296658dd5caa310b9))

### [1.1.1](https://gitlab.vmic.xyz///compare/v1.1.1-beta.2...v1.1.1) (2020-11-20)

### [1.1.1-beta.2](https://gitlab.vmic.xyz///compare/v1.1.1-beta.1...v1.1.1-beta.2) (2020-11-20)


### Bug Fixes

* 修复构建后的包tsconfig-paths找不到tsconfig.json的问题 ([9304880](https://gitlab.vmic.xyz///commit/9304880390324c82609522c5e96b3eb862841221))

### [1.1.1-beta.1](https://gitlab.vmic.xyz///compare/v1.1.1-beta.0...v1.1.1-beta.1) (2020-11-20)

### [1.1.1-beta.0](https://gitlab.vmic.xyz///compare/v1.1.0-beta.0...v1.1.1-beta.0) (2020-11-20)


### Bug Fixes

* 修复跨平台行尾字符CRLF/LF的问题；将代码提交命令改成npm run commit；修复gitlab ci/cd标签判断错误的问题 ([bfa028a](https://gitlab.vmic.xyz///commit/bfa028ab8a0508a9d98dc21911ac089641b89210))

## [1.1.0](https://gitlab.vmic.xyz///compare/v1.1.0-beta.0...v1.1.0) (2020-11-19)

## [1.1.0-beta.0](https://gitlab.vmic.xyz///compare/v1.0.3-beta.0...v1.1.0-beta.0) (2020-11-19)


### Features

* 新增依赖包版本限制 ([39eacc7](https://gitlab.vmic.xyz///commit/39eacc7b1a86d4cc2090f899b6400066c45654e2))

### [1.0.3](https://gitlab.vmic.xyz///compare/v1.0.3-beta.0...v1.0.3) (2020-11-19)

### [1.0.3-beta.0](https://gitlab.vmic.xyz///compare/v1.0.2-rc.0...v1.0.3-beta.0) (2020-11-18)


### Bug Fixes

* 修复数组flat等方法没有进行polyfill的问题；修复json文件有注释时读取报错的问题 ([66ddb94](https://gitlab.vmic.xyz///commit/66ddb940c7e22d5cd7a4a9030d8c2ddbfcd50ebc))
* 修复生成的配置文件格式错误的问题；设置vscode文件末尾自动插入空行 ([1a9fbf9](https://gitlab.vmic.xyz///commit/1a9fbf9c896eaedcfad775933f4f7930263c784c))

## 1.0.2 (2020-11-16)


### Bug Fixes

* 修复vue文件使用js语法时eslint配置错误的问题 ([d53ec3e](https://gitlab.vmic.xyz///commit/d53ec3ef68039446ddf1c6c0bf9ea1849c96f397))

## 1.0.1 (2020-11-13)


### Bug Fixes

* 修复template没有上传到npm的问题 ([78d396d](https://gitlab.vmic.xyz///commit/78d396d4d74be558d0254bf2b44e110aa6af2006))

## 1.0.0 (2020-11-13)


### Features

* 完成功能 ([8096641](https://gitlab.vmic.xyz///commit/80966414fff6707abf48138d82ef6c2563eeaba6))


### Bug Fixes

* 修复import导入的数据无法修改的问题 ([d5e75e1](https://gitlab.vmic.xyz///commit/d5e75e1b723ca92737872cc8b06b282cd041b969))
