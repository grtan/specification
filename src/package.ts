import path from 'path'
import { spawnSync } from 'child_process'
import fse from 'fs-extra'
import { sync as commandExistsSync } from 'command-exists'
import { readJson, removeVersion } from '@/utils'

const base = [
  'eslint@^7.12.1',
  'eslint-config-standard@^16.0.2',
  'eslint-plugin-import@^2.22.1',
  'eslint-plugin-node@^11.1.0',
  'eslint-plugin-promise@^4.2.1',
  'eslint-config-prettier@^6.15.0',
  'eslint-plugin-prettier@^3.1.4',
  'prettier@^2.1.2',
  'husky@^4.3.0',
  'lint-staged@^10.5.1',
  'commitizen@^4.2.2',
  'cz-conventional-changelog@^3.3.0',
  '@commitlint/cli@^11.0.0',
  '@commitlint/config-conventional@^11.0.0'
]
const ts = [
  'typescript',
  '@typescript-eslint/eslint-plugin@^4.6.1',
  '@typescript-eslint/parser@^4.6.1',
  'eslint-plugin-standard@^4.0.2',
  'eslint-config-standard-with-typescript@^19.0.1'
]
const css = [
  'stylelint@^13.7.2',
  'stylelint-config-standard@^20.0.0',
  'stylelint-config-css-modules@^2.2.0',
  'stylelint-order@^4.1.0',
  'stylelint-config-prettier@^8.0.2',
  'stylelint-prettier@^1.1.2'
]
const scss = ['stylelint-config-sass-guidelines@^7.1.0']
const vue = ['eslint-plugin-vue@^7.1.0']
const html = ['eslint-plugin-html@^6.1.0']

export default function (options: {
  path: string
  jsLang: 'js' | 'ts'
  cssLang: 'css' | 'scss' | 'less' | 'none'
  vue: boolean
  html: boolean
}) {
  const packageJsonPath = path.resolve(options.path, 'package.json')
  // 需要安装的npm包
  const packages = [...base]
  // 需要卸载的npm包
  let unusedPackages = []

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

  // 配置scripts
  packageJson.scripts = packageJson.scripts || {}
  packageJson.scripts.precompress =
    'npm i --no-save minimist imagemin imagemin-jpegtran imagemin-gifsicle imagemin-svgo imagemin-pngquant'
  packageJson.scripts.compress = 'node ./imagemin.js'
  packageJson.scripts.commit = 'cz'

  // 配置husky
  packageJson.husky = packageJson.husky || {}
  packageJson.husky.hooks = packageJson.husky.hooks || {}
  packageJson.husky.hooks['pre-commit'] = 'lint-staged'
  packageJson.husky.hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS'

  // 配置lint-staged
  packageJson['lint-staged'] = {
    '*.{png,gif,jpg,jpeg,svg}': 'npm run compress --'
  }
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
        options.cssLang === 'less' ? ['css', 'less'] : [],
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
  fse.outputFileSync(packageJsonPath, JSON.stringify(packageJson, null, '  ') + '\n')

  // 安装依赖包
  console.log('安装依赖包...')

  if (options.jsLang === 'ts') {
    packages.push(...ts)
  } else {
    unusedPackages.push(...ts)
  }

  if (options.cssLang !== 'none') {
    packages.push(...css)
  } else {
    unusedPackages.push(...css)
  }

  if (options.cssLang === 'scss') {
    packages.push(...scss)
  } else {
    unusedPackages.push(...scss)
  }

  if (options.vue) {
    packages.push(...vue)
  } else {
    unusedPackages.push(...vue)
  }

  if (options.html) {
    packages.push(...html)
  } else {
    unusedPackages.push(...html)
  }

  unusedPackages = unusedPackages.map(pkg => removeVersion(pkg))

  // 卸载无用的包，安装需要的包
  switch (true) {
    case fse.pathExistsSync(path.resolve(options.path, 'yarn.lock')) && commandExistsSync('yarn'):
      unusedPackages.length &&
        spawnSync('yarn', ['remove', ...unusedPackages], {
          cwd: options.path,
          stdio: 'inherit',
          shell: true
        })
      spawnSync('yarn', ['add', '-D', ...packages], {
        cwd: options.path,
        stdio: 'inherit',
        shell: true
      })
      break
    case fse.pathExistsSync(path.resolve(options.path, 'pnpm-lock.yaml')) && commandExistsSync('pnpm'):
      unusedPackages.length &&
        spawnSync('pnpm', ['remove', ...unusedPackages], {
          cwd: options.path,
          stdio: 'inherit',
          shell: true
        })
      spawnSync('pnpm', ['add', '-D', ...packages], {
        cwd: options.path,
        stdio: 'inherit',
        shell: true
      })
      break
    default:
      unusedPackages.length &&
        spawnSync('npm', ['un', ...unusedPackages], {
          cwd: options.path,
          stdio: 'inherit',
          shell: true
        })
      spawnSync('npm', ['i', '-D', ...packages], {
        cwd: options.path,
        stdio: 'inherit',
        shell: true
      })
  }
}
