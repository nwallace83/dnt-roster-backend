const express = require('express')
const app = express();
const path = require('path')
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const helmet = require('helmet')

if (!process.env.CLIENT_SECRET || !process.env.JWT_KEY) {
    console.error('Missing environmental variable verify they exist: ')
    process.env.CLIENT_SECRET ?  console.log('CLIENT_SECRET: Found') : console.log('CLIENT_SECRET: missing')
    process.env.JWT_KEY ?  console.log('JWT_KEY: Found') : console.log('JWT_KEY: missing')
    console.error('CLIENT_SECRET, JWT_KEY')
    process.exit(1)
}

if (process.env.NODE_ENV === "ebproduction") {
    app.use((req,res,next) => {
        if (!req.secure) {
            console.log(req.secure)
            console.log("sending redirect: " + "https://" + req.headers.host + req.url)
            return res.redirect("https://" + req.headers.host + req.url);
        }
        next()
    })
}

app.use(cookieParser())
app.use(bodyParser.json())

var discord = require('./api/v1/discord')
var auth = require('./api/v1/auth')
var character = require('./api/v1/character')
var roster = require('./api/v1/roster');
var characterAdmin = require('./api/v1/admin/characterAdmin')

app.use('/api/v1/discord',discord)
app.use('/api/v1/auth',auth)
app.use('/api/v1/character',character)
app.use('/api/v1/roster',roster)
app.use('/api/v1/admin/character',characterAdmin)

app.use('/',express.static(path.join(__dirname, 'html')))



if (process.env.NODE_ENV === "production") {
    const https = require('https')
    const fs = require('fs')

    app.use(helmet({crossOriginEmbedderPolicy: false}))
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
            "img-src": ["'self'","*.discordapp.com","data:"]
            },
        })
    );

    const privateKey = fs.readFileSync("dntroster.com.key")
    const certicate = fs.readFileSync("dntroster.com_2022.crt")
    const caCert = fs.readFileSync("CA.crt")
    const ciphers= [
        "DHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA256",
        "ECDHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES256-SHA256",
        "DHE-RSA-AES128-SHA256",
        "HIGH",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!MD5",
        "!PSK",
        "!SRP",
        "!CAMELLIA"
         ].join(':')
        const credentials = {key: privateKey, cert: certicate, ca:caCert, ciphers: ciphers}

    const httpsServer = https.createServer(credentials, app)

    const httpServer = express();
    httpServer.disable('x-powered-by')
    httpServer.get('*', function(req, res) {  
        res.redirect('https://' + req.headers.host + req.url);
    })

httpsServer.listen(8443)
httpServer.listen(8080)

} else if (process.env.NODE_ENV === "staging") {
    const https = require('https')
    const fs = require('fs')

    app.use(helmet({crossOriginEmbedderPolicy: false}))
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
            "img-src": ["'self'","*.discordapp.com","data:"]
            },
        })
    );

    const privateKey = fs.readFileSync("dntroster.com.key")
    const certicate = fs.readFileSync("dntroster.com_2022.crt")
    const caCert = fs.readFileSync("CA.crt")
    const ciphers= [
        "DHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA256",
        "ECDHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES256-SHA256",
        "DHE-RSA-AES128-SHA256",
        "HIGH",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!MD5",
        "!PSK",
        "!SRP",
        "!CAMELLIA"
         ].join(':')
        const credentials = {key: privateKey, cert: certicate, ca: caCert, ciphers: ciphers}

    const httpsServer = https.createServer(credentials, app)

    httpsServer.listen(3001)
}  else if (process.env.NODE_ENV === "ebproduction") {
    const http = require('http')
    const httpServer = http.createServer(app)
    httpServer.listen(5000)
} else {
    const http = require('http')
    const httpServer = http.createServer(app)
    httpServer.listen(3001)
}