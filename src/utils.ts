import fse from 'fs-extra'

// 读取json，支持携带js风格注释
export function readJson(pt: string) {
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
