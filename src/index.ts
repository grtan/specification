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
import { readJson, gitNotIgnoreFile } from '@/utils'

program.version(readJson(path.resolve(__dirname, '../package.json')).version, '-v, --version', '查看当前版本')
program.option('-p, --path [value]', '要应用统一规范的项目的路径', process.cwd())
program.parse(process.argv)

async function main() {
  if (!fse.pathExistsSync(program.path)) {
    throw new Error(`路径${program.path}不存在`)
  }

  console.log('请设置需要统一规范项目的特性')
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
      choices: ['none', 'css', 'scss', 'less']
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

  // 如果为git仓库,设置git检出代码时不自动将LF转成CRLF，检入代码时自动将CRLF转换成LF
  const gitDirectory = path.resolve(pt, '.git')

  if (fse.pathExistsSync(gitDirectory) && fse.lstatSync(gitDirectory).isDirectory()) {
    spawnSync('git', ['config', '--local', 'core.autocrlf', 'input'], {
      cwd: pt,
      stdio: 'inherit',
      shell: true
    })
  }

  // git不忽略相关的文件
  ;[
    '.browserslistrc',
    '.eslint-config.js',
    '.eslintrc.js',
    '.prettierrc.js',
    '.stylelintrc.js',
    'commitlint.config.js',
    '.vscode/settings.json',
    '.vscode/extensions.json',
    '.gitignore',
    'package.json'
  ].forEach(file => {
    gitNotIgnoreFile(pt, file)
  })

  setConfig(config)
  setVscode(config)
  setPackage(config)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
