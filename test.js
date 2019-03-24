'use strict'

var test = require('tape')
var shuffle = require('array-shuffle')
var parseTags = require('.').parseTags
var matchTags = require('.').matchTags
var compareTags = require('.').compareTags

test('parse tags', function (t) {
  t.is(parseTags('ignored'), undefined)
  t.is(parseTags('node.ignored'), undefined)

  t.is(parseTags('node.node').runtime, 'node')
  t.is(parseTags('electron.node').runtime, 'electron')
  t.is(parseTags('node-webkit.node').runtime, 'node-webkit')

  t.same(parseTags('node.napi.node'), {
    file: 'node.napi.node',
    runtime: 'node',
    napi: true,
    specificity: 2
  })

  t.same(parseTags('node.abi64.uv1.armv7.musl.node'), {
    file: 'node.abi64.uv1.armv7.musl.node',
    runtime: 'node',
    abi: '64',
    uv: '1',
    armv: '7',
    libc: 'musl',
    specificity: 5
  })

  t.end()
})

test('sort tags', function (t) {
  check('electron', [
    'electron.abi64.uv1.node',
    'electron.napi.uv1.armv7.musl.node',
    'electron.napi.uv1.musl.node',
    'node.abi64.uv1.node',
    'node.abi64.node',
    'node.napi.uv1.armv7.musl.node',
    'node.napi.uv1.node'
  ], 'sort order ok')

  check('node', [
    'node.abi64.uv1.node',
    'node.abi64.node',
    'node.napi.uv1.armv7.musl.node',
    'node.napi.uv1.node',
    'electron.abi64.uv1.node',
    'electron.napi.uv1.armv7.musl.node',
    'electron.napi.uv1.musl.node'
  ], 'same files, different runtime')

  function check (runtime, sorted, message) {
    t.same(
      shuffle(sorted)
        .map(parseTags)
        .sort(compareTags(runtime))
        .map(getFile),
      sorted,
      message
    )
  }

  t.end()
})

test('match and sort tags', function (t) {
  check('electron', '64', [
    'node.abi64.node',
    'electron.napi.node'
  ], [
    'electron.napi.node'
  ], 'dont use a node abi for electron')

  check('electron', '64', [
    'node.abi64.node',
    'node.napi.node'
  ], [
    'node.napi.node'
  ], 'but do use a node napi for electron')

  check('electron', '64', [
    'node.abi64.node',
    'node.napi.node',
    'electron.abi64.node',
    'electron.abi99.node',
    'electron.napi.node'
  ], [
    'electron.abi64.node',
    'electron.napi.node',
    'node.napi.node'
  ], 'except if an electron abi is available')

  check('node', '64', [
    'electron.napi.node',
    'electron.abi64.node',
    'node.abi64.node'
  ], [
    'node.abi64.node'
  ], 'never use electron for node')

  function check (runtime, abi, files, expected, message) {
    t.same(
      files
        .map(parseTags)
        .filter(matchTags(runtime, abi))
        .sort(compareTags(runtime))
        .map(getFile),
      expected,
      message
    )
  }

  t.end()
})

function getFile (tags) {
  return tags.file
}
