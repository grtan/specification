import os from 'os'
import path from 'path'
import fse from 'fs-extra'

// 读取json，支持携带js风格注释
export function readJson(pt: string) {
  if (!fse.pathExistsSync(pt)) {
    return {}
  }

  /**
   * 这里不方便用new Function，因为json文件可能首行就是注释
   * 导致return返回值为undefined
   */
  // eslint-disable-next-line no-eval
  return eval(
    `(${fse.readFileSync(pt, {
      encoding: 'utf8'
    })})`
  )
}

// 操作系统名称
export const osName = (function () {
  switch (os.platform()) {
    case 'darwin':
      return 'MacOS'
    case 'linux':
      return 'Linux'
    case 'win32':
      return 'Windows'
    case 'android':
      return 'Android'
    default:
      return 'other'
  }
})()

// 移除npm包名中的版本信息
export function removeVersion(pkg: string) {
  return pkg.replace(/(?!^)@.*$/, '')
}

/**
 * git不忽略某个文件
 * @param projectPath 项目路径
 * @param fileRelativePath 不忽略的文件的相对路径，如.eslintrc.js，不能写成./.eslintrc.js
 */
export function gitNotIgnoreFile(projectPath: string, fileRelativePath: string) {
  const gitIgnorePath = path.resolve(projectPath, '.gitignore')
  const parsedPath = '/' + fileRelativePath

  if (!fse.pathExistsSync(gitIgnorePath)) {
    fse.outputFileSync(gitIgnorePath, '')
  }

  const gitIgnore = fse.readFileSync(gitIgnorePath, {
    encoding: 'utf8'
  })

  if (!new RegExp(`^\\s*!${parsedPath.replace(/\./g, '\\.')}\\s*$`, 'm').test(gitIgnore)) {
    fse.outputFileSync(gitIgnorePath, `${gitIgnore}\n!${parsedPath}\n`)
  }
}
