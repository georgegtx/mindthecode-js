import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFileContentsAsString = (path) => {
    return fs.readFileSync(__dirname  + path, {encoding:'utf8', flag:'r'})
}
const setFileContentsAsString = (path, value) => {
    return fs.writeFileSync(__dirname  + path, value, {encoding:'utf8'})
}

const getAll = () => {
    const d = getFileContentsAsString('/data.json')
    return JSON.parse(d)
}

const setAll = (d) => {
    setFileContentsAsString('/data.json', JSON.stringify(d))
}

const addRecord = (created) => {
    const d = getAll()
    d.push(created)
    setAll(d)
    return d
}

const deleteRecord = (byKey, andValue) => {
    const d = getAll()
    const newArray = d.filter(el => (el[byKey] != andValue))
    setAll(newArray)
}

const updateRecord = (byKey, andValue, updated) => {
    const d = getAll()
    let match = d.find(el => el[byKey] == andValue)
    if (match) {
        const newArray = d.filter(el => {
            return el[byKey] != andValue
        })
        newArray.push(updated)
        setAll(newArray)
    }
    return updated
}

export {
    getAll,
    setAll,
    addRecord,
    updateRecord,
    deleteRecord,
}