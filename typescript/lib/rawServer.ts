import net from 'net'

const socket = net.createServer()

const getRequestPath = (req) => {
    const first = req.split("\n")[0]
    const match = new RegExp(/GET (.+) HTTP\/\d\.\d/).exec(first)
    return match[1]
}

const getByteCount = (text) => (new TextEncoder().encode(text)).length


const httpResponse = (res) =>  {

    var resp = 
`HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Server: Custom RAW Node server
Vary: Accept-Encoding
Content-Length: ${getByteCount(res)}\r\n\r\n${res}`

    return resp
}

const startServer = (options) => {

    socket.on('connection', (conn) => {
        
        console.log(`connection from ${conn.remoteAddress}:${conn.remotePort}`)
    
        conn.on('data', (req) => {
            
            console.log(`request from ${conn.remoteAddress}: ${req}`)

            const path = getRequestPath(req.toString())
            
            const controller = options.routes[path] || options.routes['*']

            if (controller) {
                var result = controller.get()

                console.log(result)
            
                conn.write(httpResponse(result), (err) => {
                    if (err) console.log(err)
                    conn.end(() => {
                        if (err) console.log(err)
                        conn.destroy()
                    })
                })
            }

            conn.end(() => {
                conn.destroy()
            })
        })
        
        conn.on('close', () => {
            console.log(`closed connection with ${conn.remoteAddress}`)
        })
    
        conn.on('error', () => {
            console.log(`connection error ${conn.remoteAddress}`)
        })
    })

    socket.listen(options.port, () => {    
        console.log('server listening to %j', socket.address());  
    });
}

export {
    startServer
}