#!/usr/bin/env node

var proc = require('child_process')
var os = require('os')

var ARGS = process.argv.slice(2)
var RUN_PREINSTALL = true

if (os.platform() === 'win32' && ARGS[0] === '--no-windows-preinstall') {
  ARGS.shift()
  RUN_PREINSTALL = false
}

proc.exec('node-gyp-build-test', function (err) {
  if (err) preinstall(ARGS.join(' '))
})

function build () {
  proc.spawn('node-gyp', ['rebuild'], {stdio: 'inherit'}).on('exit', function (code) {
    process.exit(code)
  })
}

function preinstall (cmd) {
  if (!cmd || !RUN_PREINSTALL) return build()
  exec(cmd).on('exit', function (code) {
    if (code) process.exit(code)
    build()
  })
}

function exec (cmd) {
  if (process.platform !== 'win32') {
    return proc.spawn('/bin/sh', ['-c', cmd], {
      stdio: 'inherit'
    })
  }

  return proc.spawn(process.env.comspec || 'cmd.exe', ['/s', '/c', '"' + cmd + '"'], {
    windowsVerbatimArguments: true,
    stdio: 'inherit'
  })
}
