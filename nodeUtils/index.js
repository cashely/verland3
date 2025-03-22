#!/usr/bin/env node
// const { execSync } = require('child_process')
// const { readFileSync } = require('fs')
// const { join } = require('path')
const { join } = require('node:path')
const { readFileSync, writeFileSync } = require('node:fs')
const process = require('node:process')
console.log(process.cwd())
const fscon = readFileSync(process.cwd() + '/package.json')
const fsconStr = fscon.toString()
const obj = JSON.parse(fsconStr)
obj.anthor = 'chenhaihu'
const pkgPath = join(process.cwd(), './package.json')

// writeFileSync(pkgPath, JSON.stringify(obj, null, 2), (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

// stdout.on('SIGHUP', chunk => {
//   console.log(chunk, 'chunk', env, pid)
//   // stdout.write(chunk)
// })

console.log('---', process.argv)
console.log('---', process.argv0)