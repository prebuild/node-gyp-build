#!/usr/bin/env node

var bindings = require('./')
var proc = require('child_process')

try {
  bindings()
  process.exit(0) // can already load a build
} catch (err) {
  // do nothing
}

preinstall(process.argv.slice(2).join(' '))

function build () {
  proc.spawn('node-gyp', ['rebuild'], {stdio: 'inherit'}).on('exit', function (code) {
    process.exit(code)
  })
}

function preinstall (cmd) {
  if (!cmd) return build()
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
