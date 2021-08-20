'use strict'

const fs = require('fs').promises
const resolve = require('path').resolve
const sha256 = require(resolve('test/sha256checksum'))

const expect = require('chai').expect
const rimRaf = require('rimraf')

const GIVEN_FILES_ROOT_DIRECTORY = 'test/fixtures/app/'
const PROCESSED_FILES_ROOT_DIRECTORY = 'test/fixtures/dist/'

describe('BroccoliPluginAdapter', () => {

    before(async () => {
        await fs.mkdir(GIVEN_FILES_ROOT_DIRECTORY + '/empty-folder')
    })
    after(async () => {
        await fs.rmdir(GIVEN_FILES_ROOT_DIRECTORY + '/empty-folder')
        await new Promise((resolve) => {
            rimRaf(PROCESSED_FILES_ROOT_DIRECTORY, resolve)
        })
    })

    it('should copy test.gif to the output directory', () => {
        expect(_compareFiles('test.gif')).to.be.true
    })

    it('should copy test-uppercas.PNG to the output directory', () => {
        expect(_compareFiles('test-uppercase.PNG')).to.be.true
    })

    it('should copy nested/nested/nested.png to the output directory', () => {
        expect(_compareFiles('nested/nested/nested.png')).to.be.true
    })

    const _compareFiles = (file) => {
        return _compareChecksums(resolve(GIVEN_FILES_ROOT_DIRECTORY, file), resolve(PROCESSED_FILES_ROOT_DIRECTORY, file))
    }

    const _compareChecksums = (left, right) => {
        return sha256(left) == sha256(right)
    }
})