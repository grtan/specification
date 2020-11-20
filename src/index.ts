#!/usr/bin/env node

// 让node支持ts的baseUrl，paths路径转换
import 'tsconfig-paths/register'
import 'core-js/es'
import path from 'path'
import { spawnSync } from 'child_process'
import { program } from 'commander'
import inquirer from 'inquirer'
import fse from 'fs-extra'
import setVscode from './vscode'
import setPackage from './package'
import setConfig from './config'

program.option('-p, --path [value]', '工作目录路径', process.cwd())
program.parse(process.argv)

if (!fse.pathExistsSync(program.path)) {
  throw new Error(`路径${program.path}不存在`)
}

async function main() {
  const result = await inquirer.prompt([
    {
      name: 'all',
      type: 'confirm',
      message: '设置完整规范还是自定义？'
    },
    {
      name: 'jsLang',
      type: 'list',
      message: '请选择js代码语言',
      choices: ['js', 'ts'],
      when(answer) {
        return !answer.all
      }
    },
    {
      name: 'cssLang',
      type: 'list',
      message: '请选择css代码语言',
      choices: ['none', 'css', 'scss'],
      when(answer) {
        return !answer.all
      }
    },
    {
      name: 'vue',
      type: 'confirm',
      message: '是否为vue项目？',
      when(answer) {
        return !answer.all
      }
    },
    {
      name: 'html',
      type: 'confirm',
      message: '是否存在html文件？',
      when(answer) {
        return !answer.all
      }
    }
  ])

  const pt = path.resolve(process.cwd(), program.path)
  const config = result.all
    ? {
        path: pt,
        jsLang: 'ts',
        cssLang: 'scss',
        vue: true,
        html: true
      }
    : {
        path: pt,
        jsLang: result.jsLang,
        cssLang: result.cssLang,
        vue: result.vue,
        html: result.html
      }

  // 设置git检出代码时不自动将LF转成CRLF，检入代码时自动将CRLF转换成LF
  spawnSync('git', ['config', '--local', 'core.autocrlf', 'input'], {
    cwd: pt,
    stdio: 'inherit',
    shell: true
  })
  setVscode(config)
  setPackage(config)
  setConfig(config)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
