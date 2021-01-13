import path from 'path'
import fse from 'fs-extra'
import artTemplate from 'art-template'

export default function (options: {
  path: string
  jsLang: 'js' | 'ts'
  cssLang: 'css' | 'scss' | 'less' | 'none'
  vue: boolean
  html: boolean
}) {
  // 生成.browserslistrc
  fse.outputFileSync(
    path.resolve(options.path, '.browserslistrc'),
    artTemplate(path.resolve(__dirname, '../template/.browserslistrc.art'), options)
  )

  // 生成.eslint-config.js
  fse.outputFileSync(
    path.resolve(options.path, '.eslint-config.js'),
    artTemplate(path.resolve(__dirname, '../template/.eslint-config.art'), options)
  )

  // 生成.eslintrc.js
  fse.outputFileSync(
    path.resolve(options.path, '.eslintrc.js'),
    artTemplate(path.resolve(__dirname, '../template/.eslintrc.art'), options)
  )

  // 生成.prettierrc.js
  fse.outputFileSync(
    path.resolve(options.path, '.prettierrc.js'),
    artTemplate(path.resolve(__dirname, '../template/.prettierrc.art'), options)
  )

  // 生成、删除.stylelintrc.js
  if (options.cssLang !== 'none') {
    fse.outputFileSync(
      path.resolve(options.path, '.stylelintrc.js'),
      artTemplate(path.resolve(__dirname, '../template/.stylelintrc.art'), options)
    )
  } else {
    fse.removeSync(path.resolve(options.path, '.stylelintrc.js'))
  }

  // 生成commitlint.config.js
  fse.outputFileSync(
    path.resolve(options.path, 'commitlint.config.js'),
    artTemplate(path.resolve(__dirname, '../template/commitlint.config.art'), options)
  )
}
