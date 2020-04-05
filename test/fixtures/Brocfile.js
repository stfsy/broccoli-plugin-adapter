'use strict'

const BroccoliPluginAdapter = require('../../lib/index')

const reloadable = new BroccoliPluginAdapter(['app'], {
    target: 'index.html',
})

module.exports = reloadable