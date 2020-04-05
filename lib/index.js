'use strict'

const BroccoliPlugin = require('broccoli-plugin')
const resolve = require('path').resolve

const toBuffer = require('./to-buffer')

class BroccoliPluginAdapter extends BroccoliPlugin {

    constructor(inputNodes, options) {
        super(inputNodes, Object.assign(options, {trackInputChanges: true}))
    }

    build(nodes) {
        Object.keys(nodes.changedNodes).forEach((changed, index) => {
            if (changed) {
                this._walkDirectoriesAndProcessFiles(index, '.', this.input.at(index).readdirSync('.'))
            }
        })
    }

    _walkDirectoriesAndProcessFiles(inputAt, folder) {
        const entries = this.input.at(inputAt).entries(folder)
        entries.forEach(entry => {
            const fullRelativePath = folder + '/' + entry.relativePath
            if (entry.isDirectory()) {
                if (!this.output.existsSync(entry.relativePath)) {
                    this.output.mkdirSync(entry.relativePath)
                }
                this._walkDirectoriesAndProcessFiles(inputAt, fullRelativePath)
            } else {
                this._processSingleFile(inputAt, fullRelativePath)
            }
        })
    }

    /**
     * 
     * @param {String} path to file
     * @returns {Promise} resolved after files was processed
     */
    _processSingleFile(inputAt, path) {
        const content = this.input.at(inputAt).readFileSync(path, { encoding: null })
        const processedContent = this.handleContent(path, content)
        this.output.writeFileSync(path, toBuffer(processedContent), { encoding: null })
    }

    handleContent(path, content) {
        return content
    }
}

module.exports = BroccoliPluginAdapter