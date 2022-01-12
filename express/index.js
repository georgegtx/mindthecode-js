import { addRecord, deleteRecord, getAll, setAll, updateRecord } from './data.js'
import { dirname, join } from 'path';

import express from 'express'
import { fileURLToPath } from 'url';
import mustache from 'mustache-express'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

const port = 80

app.use(express.static(join(__dirname, '/www')));
app.use(express.json())

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', join(__dirname, '/views'));

app.get('/api/cars', (req, res) => {
    res.json(getAll())
})

app.post('/api/cars', (req, res) => {
    addRecord(req.body)
    res.send(req.body)
})

app.put('/api/cars', (req, res) => {
    updateRecord('Name', req.body.Name, req.body)
    res.send(req.body)
})

app.delete('/api/cars/:Name', (req, res) => {
    deleteRecord('Name', req.params.Name)
    res.send()
})

app.get('/', (req, res) => {
    res.render('home', {
        date: new Date(),
        list: [1,2,3,4,5,6,7,8,9,10].map(el => ({ name: el}))
    })
})

app.get('*', (req, res) => {
    res.render('not-found')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})