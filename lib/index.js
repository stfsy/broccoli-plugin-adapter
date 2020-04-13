'use strict'

const BroccoliPlugin = require('broccoli-plugin')
const toBuffer = require('./to-buffer')

class BroccoliPluginAdapter extends BroccoliPlugin {

    constructor(inputNodes, options) {
        super(Array.isArray(inputNodes) ? inputNodes : [inputNodes], Object.assign(options, { trackInputChanges: true }))
    }

    build(nodes) {
        return Promise.all(Object.keys(nodes.changedNodes).map((changed, index) => {
            if (changed) {
                return this._walkDirectoriesAndProcessFiles(this.input.at(index), '.')
            }
        }))
    }

    /**
     * @param {FSMerger} fs representing the current folder
     * @param {String} folder current folder name relative to build base
     * @returns {Promise}
     */
    _walkDirectoriesAndProcessFiles(fs, folder) {
        const entries = fs.entries(folder)
        return this._processNextDirectoryEntry(fs, entries, 0, folder)
    }

    /**
     * @param {FSMerger} fs representing the current folder
     * @param {walkSync.entry[]} entries 
     * @param {Number} index next index of the entries to be processed
     * @param {String} folder current folder name relative to build base
     * @returns {Promise}
     */
    _processNextDirectoryEntry(fs, entries, index, folder) {
        let promise = null
        const entry = entries[index]
        if (entry.isDirectory()) {
            promise = this._processDirectoryEntry(fs, folder, entry)
        } else {
            promise = this._processFileEntry(fs, folder, entry)
        }

        return promise.then(() => {
            if (index + 1 < entries.length) {
                return this._processNextDirectoryEntry(fs, entries, ++index, folder)
            }
        })
    }

    _processDirectoryEntry(fs, folder, entry) {
        const path = folder + '/' + entry.relativePath
        if (!this.output.existsSync(entry.relativePath)) {
            this.output.mkdirSync(entry.relativePath)
        }
        return this._walkDirectoriesAndProcessFiles(fs, path)
    }

    /**
     * 
     * @param {FSMerger} fs representing the current folder
     * @param {String} path to file
     * @returns {Promise} resolved after files was processed
     */
    _processFileEntry(fs, folder, entry) {
        const path = folder + '/' + entry.relativePath
        return Promise.resolve().then(() => {
            return fs.readFileSync(path, { encoding: null })
        }).then(data => {
            return this.handleContent(path, data)
        }).then(data => {
            this.output.writeFileSync(path, toBuffer(data), { encoding: null })
        })
    }

    handleContent(path, content) {
        return content
    }
}

module.exports = BroccoliPluginAdapter