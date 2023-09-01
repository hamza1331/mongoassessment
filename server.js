const express = require('express');
const app = express();
const UserApi = require('./Route/UserAPI')
const CardAPI = require('./Route/CardAPI')
const cors = require('cors')
const process = require('process')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/mongoassessment'
const port = process.env.PORT || 5000
const rateLimit = require("express-rate-limit");
const server = require('http').createServer(app);
require('events').EventEmitter.prototype._maxListeners = 200;
require('events').defaultMaxListeners = 200;

mongoose.connect(url, { useNewUrlParser: true }) //MongoDB connection using Mongoose
var db = mongoose.connection //Mongo Connection Instance

db.on('open', () => {
    console.log('database connected')
})
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200 // limit each IP to 200 requests per windowMs
});

//  apply to all requests
app.use(limiter);
app.use(cors())
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/user', UserApi)
app.use('/card', CardAPI)
app.get('/', (req, res) => {
    res.send("<h1>Hello from mongo assessment</h1>")
})

process.on('warning', function (err) {
    if ('MaxListenersExceededWarning' == err.name) {
        // write to log function
        process.exit(); // its up to you what then in my case script was hang
    }
});
//Start server
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});
