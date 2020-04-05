# Broccoli Plugin Adapter

[![Build Status](https://travis-ci.org/stfsy/broccoli-plugin-adapter.svg?branch=master)](https://travis-ci.org/stfsy/broccoli-plugin-adapter)
[![Dependency Status](https://img.shields.io/david/stfsy/broccoli-plugin-adapter.svg)](https://github.com/stfsy/broccoli-plugin-adapter/blob/master/package.json)
[![DevDependency Status](https://img.shields.io/david/dev/stfsy/broccoli-plugin-adapter.svg)](https://github.com/stfsy/broccoli-plugin-adapter/blob/master/package.json)
[![Npm downloads](https://img.shields.io/npm/dm/broccoli-plugin-adapter.svg)](https://www.npmjs.com/package/broccoli-plugin-adapter)
[![Npm Version](https://img.shields.io/npm/v/broccoli-plugin-adapter.svg)](https://www.npmjs.com/package/broccoli-plugin-adapter)
[![Git tag](https://img.shields.io/github/tag/stfsy/broccoli-plugin-adapter.svg)](https://github.com/stfsy/broccoli-plugin-adapter/releases)
[![Github issues](https://img.shields.io/github/issues/stfsy/broccoli-plugin-adapter.svg)](https://github.com/stfsy/broccoli-plugin-adapter/issues)
[![License](https://img.shields.io/npm/l/broccoli-plugin-adapter.svg)](https://github.com/stfsy/broccoli-plugin-adapter/blob/master/LICENSE)

Broccoli plugin adapter. Allows easy implementation of broccoli plugins.

## Example
```js
'use strict'

const BroccoliPlugin = require('broccoli-plugin-adapter')

const tag = require('./tag')
const Injector = require('./injector')
const livereload = require('livereload')

class BroccoliLivereload extends BroccoliPlugin {

    constructor(inputNodes, options) {
        super(inputNodes, options)
    }

    /**
     * Override handle content to get access to file contents. Be aware that
     * to handle text files you have to encode the binary content.
     **/
    handleContent(path, content) {
        if (this._building) {
            return content
        }

        // Notify live reload server that file changed
        this._livereload.filterRefresh(path)

        const inject = this._injector.matches(path)

        if (inject) {
            return this._injector.inject(content)
        }

        return content
    }
}

module.exports = BroccoliLivereload
```

## Installation

```js
npm install broccoli-plugin-adapter --save-dev
```

## License

This project is distributed under the MIT license.