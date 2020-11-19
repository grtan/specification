import path from 'path'
import { spawnSync } from 'child_process'
import fse from 'fs-extra'
import { readJson } from './utils'

const base = [
  'eslint',
  'eslint-config-standard',
  'eslint-plugin-import',
  'eslint-plugin-node',
  'eslint-plugin-promise',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  'prettier',
  'husky',
  'lint-staged',
  'commitizen',
  'cz-conventional-changelog',
  '@commitlint/cli',
  '@commitlint/config-conventional'
]
const ts = [
  'typescript',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint-plugin-standard',
  'eslint-config-standard-with-typescript'
]
const css = [
  'stylelint',
  'stylelint-config-standard',
  'stylelint-config-css-modules',
  'stylelint-config-prettier',
  'stylelint-prettier'
]
const scss = ['stylelint-config-sass-guidelines']
const vue = ['eslint-plugin-vue']
const html = ['eslint-plugin-html']

export default function (options: {
  path: string
  jsLang: 'js' | 'ts'
  cssLang: 'css' | 'scss' | 'none'
  vue: boolean
  html: boolean
}) {
  const packageJsonPath = path.resolve(options.path, 'package.json')
  const packages = [...base]

  if (!fse.pathExistsSync(packageJsonPath)) {
    console.log('package.json不存在，自动生成')
    spawnSync('npm', ['init', '-y'], {
      cwd: options.path,
      stdio: 'inherit',
      shell: true
    })
  }

  /**
   * 读取package.json，import导入的数据是不能直接修改的
   * 所以这里要利用Object.assign分配给其他变量
   */
  const packageJson = readJson(packageJsonPath)

  // 配置husky
  packageJson.husky = packageJson.husky || {}
  packageJson.husky.hooks = packageJson.husky.hooks || {}
  packageJson.husky.hooks['pre-commit'] = 'lint-staged'
  packageJson.husky.hooks['prepare-commit-msg'] = 'exec < /dev/tty && git cz --hook || true'
  packageJson.husky.hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS'

  // 配置lint-staged
  packageJson['lint-staged'] = packageJson['lint-staged'] || {}
  packageJson['lint-staged'][
    `*.{${[
      options.jsLang === 'js' ? ['js', 'jsx'] : [],
      options.jsLang === 'ts' ? ['ts', 'tsx', 'js', 'jsx'] : [],
      options.vue ? ['vue'] : [],
      options.html ? ['html'] : []
    ]
      .flat()
      .join(',')}}`
  ] = 'eslint'

  if (options.cssLang !== 'none') {
    packageJson['lint-staged'][
      `*.{${[
        options.cssLang === 'css' ? ['css'] : [],
        options.cssLang === 'scss' ? ['css', 'scss'] : [],
        options.vue ? ['vue'] : [],
        options.html ? ['html'] : []
      ]
        .flat()
        .join(',')}}`
    ] = 'stylelint'
  }

  // 配置commitizen
  packageJson.config = packageJson.config || {}
  packageJson.config.commitizen = packageJson.config.commitizen || {}
  packageJson.config.commitizen.path = 'cz-conventional-changelog'

  // 重写package.json
  fse.outputFileSync(packageJsonPath, JSON.stringify(packageJson, null, '  '))

  // 安装依赖包
  console.log('安装依赖包...')

  if (options.jsLang === 'ts') {
    packages.push(...ts)
  }

  if (options.cssLang !== 'none') {
    packages.push(...css)
  }

  if (options.cssLang === 'scss') {
    packages.push(...scss)
  }

  if (options.vue) {
    packages.push(...vue)
  }

  if (options.html) {
    packages.push(...html)
  }

  switch (true) {
    case fse.pathExistsSync(path.resolve(options.path, 'yarn.lock')):
      spawnSync('yarn', ['add', '-D', ...packages], {
        cwd: options.path,
        stdio: 'inherit',
        shell: true
      })
      break
    case fse.pathExistsSync(path.resolve(options.path, 'pnpm-lock.yaml')):
      spawnSync('pnpm', ['add', '-D', ...packages], {
        cwd: options.path,
        stdio: 'inherit',
        shell: true
      })
      break
    default:
      spawnSync('npm', ['i', '-D', ...packages], {
        cwd: options.path,
        stdio: 'inherit',
        shell: true
      })
  }
}
