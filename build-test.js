#!/usr/bin/env node

process.env.NODE_ENV = 'test'

var path = require('path')

// find the test command from package.json prebuild.test entry
var test = null

try {
  var pkg = require(path.join(process.cwd(), 'package.json'))
  if (pkg.name && process.env[pkg.name.toUpperCase().replace(/-/g, '_')]) {
    process.exit(0)
  }
  test = pkg.prebuild.test
} catch (err) {
  //  do nothing
}

if (test) {
  const testPath = path.join(process.cwd(), test)
  console.log(`Running require("${testPath}")`)
  require(testPath)
}
else {
  console.log(`Running require("./")() at ${process.cwd()}`)
  require('./')()
}
