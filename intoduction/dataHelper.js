import * as fs from 'fs'

import fetch from 'node-fetch'

const DEBUG = true;

function debug(arg) {
    if (DEBUG) {
        console.log('DEBUG: ' + arg)
    }
}

const foldersInitialized = new Promise((resolve, reject) => {
    fs.mkdir('./assets/data', { recursive: true }, (err) => {
        if (err) {
            console.log('data folder not created! err: ' + err)
            reject(err)
            return
        }
        console.log('data folder created successfully')
        resolve()
    })
})

function waitForInitAndThen(doAction) {
    return foldersInitialized.then(() => doAction())
}


function saveToDisk(data, path, cb) {
    debug('saving to disk')
    fs.writeFile(path, JSON.stringify(data), (err) => {
        err ? debug('failed to save to disk') : debug('saved to disk!')
        cb(err)
    })
}

async function saveToDiskAsync(data, path) {
    debug('saving to disk async')
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(data), (err) => {
            if (err) {
                debug('failed to save to disk async')
                reject(err)
                return
            }
            debug('saved to disk async!')
            resolve()
        })
    })
}

function getData(cb) {
    debug('getting data')
    fetch('http://worldtimeapi.org/api/timezone/Europe/Athens', {
        headers: {
            Accept: "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        debug('got data')
        saveToDisk(data, './assets/data/time.json', cb)
    })
}

async function getDataAsync() {
    debug('getting data async')
    return fetch('http://worldtimeapi.org/api/timezone/Europe/Athens', {
        headers: {
            Accept: "application/json"
        }
    })
    .then(res => res.json())
    .then(data => { 
        debug('got data async')
        return saveToDiskAsync(data, './assets/data/time.json')
    })
}




function start() {
    debug('starting')
    waitForInitAndThen(() => {
        getData((err) => {
            if (err) {
                console.log('oops!!! ' + err)
                return
            }
            console.log('completed')
        })
    })
    
}

function startPromiseBased() {
    debug('starting promise based')
    return waitForInitAndThen(() => {
        return getDataAsync()
            .then(() => console.log('completed'))
            .catch(err => console.log('oops!!! ' + err))
    })
    
}

async function startAsync() {
    debug('starting async')
    try {
        await waitForInitAndThen(getDataAsync)
        console.log('completed')
    } catch (err) {
        console.log('oops!!! ' + err)
    }
}

const APIAddress = 'http://worldtimeapi.org/api/timezone/Europe/Athens'
// named exports
export {
    start,
    startAsync,
    startPromiseBased,
    APIAddress
}

const defExport = {
    start,
    startAsync,
    startPromiseBased,
    APIAddress
}

// default export
export default defExport

// default export with named emulation
// export default {
//     start,
//     startAsync,
//     APIAddress
// }