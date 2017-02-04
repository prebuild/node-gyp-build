#!/usr/bin/env node

var proc = require('child_process')
var os = require('os')

var preinstall = process.argv[2]
var postinstall = process.argv[3]

function build () {
  proc.spawn(os.platform() === 'win32' ? 'node-gyp.cmd' : 'node-gyp', ['rebuild'], {stdio: 'inherit'}).on('exit', function (code) {
    if (code || !postinstall) process.exit(code)
    exec(postinstall).on('exit', function (code) {
      process.exit(code)
    })
  })
}

function preinstall (cmd) {
  if (!preinstall) return build()
  exec(preinstall).on('exit', function (code) {
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
