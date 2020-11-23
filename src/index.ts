#!/usr/bin/env node

import 'core-js/es'
import './tsconfig-paths'
import path from 'path'
import { spawnSync } from 'child_process'
import { program } from 'commander'
import inquirer from 'inquirer'
import fse from 'fs-extra'
import setVscode from '@/vscode'
import setPackage from '@/package'
import setConfig from '@/config'

program.option('-p, --path [value]', '工作目录路径', process.cwd())
program.parse(process.argv)

if (!fse.pathExistsSync(program.path)) {
  throw new Error(`路径${program.path}不存在`)
}

async function main() {
  console.log('设置需要统一规范项目的特性')
  const { jsLang, cssLang, vue, html } = await inquirer.prompt([
    {
      name: 'jsLang',
      type: 'list',
      message: 'js代码语言',
      choices: ['js', 'ts']
    },
    {
      name: 'cssLang',
      type: 'list',
      message: 'css代码语言',
      choices: ['none', 'css', 'scss']
    },
    {
      name: 'vue',
      type: 'confirm',
      message: '是否为vue项目？'
    },
    {
      name: 'html',
      type: 'confirm',
      message: '是否存在html文件？'
    }
  ])

  const pt = path.resolve(process.cwd(), program.path)
  const config = {
    path: pt,
    jsLang,
    cssLang,
    vue,
    html
  }

  // 设置git检出代码时不自动将LF转成CRLF，检入代码时自动将CRLF转换成LF
  spawnSync('git', ['config', '--local', 'core.autocrlf', 'input'], {
    cwd: pt,
    stdio: 'inherit',
    shell: true
  })
  setConfig(config)
  setVscode(config)
  setPackage(config)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
