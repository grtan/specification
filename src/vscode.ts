import path from 'path'
import fse from 'fs-extra'
import { readJson } from './utils'

export default function (options: {
  path: string
  jsLang: 'js' | 'ts'
  cssLang: 'css' | 'scss' | 'none'
  vue: boolean
  html: boolean
}) {
  const settingsPath = path.resolve(options.path, '.vscode/settings.json')
  const extensionsPath = path.resolve(options.path, '.vscode/extensions.json')

  if (!fse.pathExistsSync(settingsPath)) {
    fse.outputFileSync(settingsPath, JSON.stringify({}))
  }

  if (!fse.pathExistsSync(extensionsPath)) {
    fse.outputFileSync(extensionsPath, JSON.stringify({}))
  }

  // 设置settings.json
  const settings = readJson(settingsPath)

  fse.outputFileSync(
    settingsPath,
    JSON.stringify(
      Object.assign(settings, {
        // 行尾字符
        'files.eol': '\n',
        // 文件末尾插入空行
        'files.insertFinalNewline': true,
        // 文件保存时自动格式化
        'editor.formatOnSave': true,
        // 开启lint自动修复
        'editor.codeActionsOnSave': {
          'source.fixAll': true
        },
        // 设置prettier为所有文件的默认格式化器
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
        // 禁止prettier格式化js、ts、css、vue文件，统一使用eslint/stylelint
        'prettier.disableLanguages': [
          'javascript',
          'javascriptreact',
          ...(options.jsLang === 'ts' ? ['typescript', 'typescriptreact'] : []),
          ...(options.cssLang === 'css' ? ['css'] : []),
          ...(options.cssLang === 'scss' ? ['css', 'scss'] : []),
          ...(options.vue ? ['vue'] : [])
        ],
        /**
         * 因为prettier禁用了对js/ts/css的校验，导致会使用内置格式器来格式化这些文件，从而跟eslint/stylelint冲突
         * 所以要禁用内置js/ts的格式化，统一使用eslint
         */
        'javascript.format.enable': false,
        ...(options.jsLang === 'ts' && {
          'typescript.format.enable': false,
          'typescript.tsdk': 'node_modules/typescript/lib'
        }),
        // 禁用内置css校验，统一使用stylelint
        ...(options.cssLang === 'css' && { 'css.validate': false }),
        ...(options.cssLang === 'scss' && { 'css.validate': false, 'scss.validate': false }),
        // 禁用vetur自动格式化，防止与lint自动修复冲突
        ...(options.vue && { 'vetur.format.enable': false }),
        // 使用项目中的eslint包和配置
        'eslint.nodePath': '',
        'eslint.options': {
          // 每一项都要赋值
          resolvePluginsRelativeTo: '',
          configFile: ''
        }
      }),
      null,
      '  '
    )
  )

  // 设置extensions.json
  const extensions = readJson(extensionsPath)

  fse.outputFileSync(
    extensionsPath,
    JSON.stringify(
      Object.assign(extensions, {
        recommendations: [
          'esbenp.prettier-vscode',
          'dbaeumer.vscode-eslint',
          ...(options.cssLang !== 'none' ? ['stylelint.vscode-stylelint'] : []),
          ...(options.vue ? ['octref.vetur'] : [])
        ]
      }),
      null,
      '  '
    )
  )
}
