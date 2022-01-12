
// named imports
// import { start, startAsync } from './dataHelper.js'

// default imports

import { start, startAsync, startPromiseBased } from './dataHelper.js'

startPromiseBased().catch(err => console.log('exited with error ' + err))
