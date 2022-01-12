import { getRandomData } from './data.js'
import { page } from './lib/templateEngine.js'
import { startServer } from './lib/rawServer.js'

const homeController = {
    get: () => {
        var data = getRandomData()

        console.log('data '+ JSON.stringify(data))

        return page('home', data)
    }
}

const notFoundController = {
    get: () => {
        return page('not-found')
    }
}

const routes = {
    '/': homeController,
    '*': notFoundController
}

startServer({
    port: 80,
    routes
})
