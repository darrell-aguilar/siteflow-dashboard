const express = require('express')
const app = express()
const crypto = require('crypto');
const axios = require("axios");
const csv = require("csvtojson")
const path = require('path')
require('dotenv').config()

const port = 5000

const baseURL = 'https://pro-api.oneflowcloud.com'

// middleware for creating the headers
const createHeader = (req, res, next) => {
    var token, secret
    var tokenName = `SF_${req.query.site}_TOKEN`
    var secretName = `SF_${req.query.site}_SECRET`

    if (req.query.site) {
        token = process.env[tokenName]
        secret = process.env[secretName]
    }
    else {
        next()
        return
    }
    
    var time = new Date().toLocaleTimeString()
    var date = new Date().toISOString().slice(0,10)
    dateAndTime = date + " " + time
    var stringToSign = req.method + " " + req.path + " " + dateAndTime;
    var hmac = crypto.createHmac("SHA1", secret);
    hmac.update(stringToSign);
    var signature = hmac.digest("hex");
    authHeader = token + ":" + signature;
    
    var headers = {
        "x-oneflow-authorization": authHeader,
        "x-oneflow-date": dateAndTime,
        "content-type": "application/json"
    }
    
    res.locals.options = {
        headers: headers
    };
    res.locals.site = req.query.site
    next()
}

const root = require('path').join(__dirname, 'build')
app.use(express.json())
app.use(express.static(root))

const getData = async (options, path) => {
    const response = await axios.get(baseURL + path + '?direction=1&sort=name&page=1&pagesize=1000', options)
                        .then(res => res.data)
                        .catch((err) => console.log(err)) 
    return response
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use(('/'), createHeader, (req, res, next) => {
    next()
})

app.get(('/api/printer'), async (req, res) => {
    try {
        const printerArray = await getData(res.locals.options, req.path)
        res.status(200).json(printerArray)
    }
    catch(e) {
        res.status(500).status("Error occured")
    }
})

app.get(('/api/user'), async (req, res) => {
    try {
        const userArray = await getData(res.locals.options, req.path)
        res.json(userArray)
    }
    catch(e) {
        res.status(500).send("Error occured")
    }
})

app.post(('/api/print-job/device'), async (req, res) => {
    var siteAgentID = `${res.locals.site}AGENTID`
    req.body = {...req.body, agentId: process.env[siteAgentID]}
    try {
        const sendPrint = await axios.post(baseURL + req.path, req.body, res.locals.options)
                                    .then(response => res.status(200).json(response.data))
                                        .catch(err => res.status(400).send("Error occured"))
    }
    catch(e) {
        res.status(500).send("Error occured")
    } 
   
})

app.get(('*'), (req, res) => {
    res.status(404).json({"Error": "This page is not available", "Status": "404"})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})