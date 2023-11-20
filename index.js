if (typeof require.addon === 'function') { // if the platform supports native resolving prefer that
  const runtimeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require // eslint-disable-line
  module.exports = runtimeRequire.addon.bind(runtimeRequire)
} else { // else use the runtime version here
  module.exports = require('./node-gyp-build.js')
}
