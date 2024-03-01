const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes'); //same as ('./routes/index')
const greenlockExpress = require('greenlock-express');
const http = require('http');
const https = require('https');

require('./models/db');
require('./models/Firebase');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router)

// Set up HTTP server to redirect to HTTPS
http.createServer(greenlockExpress.init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'tinzarpaing@gmail.com',
    cluster: false
  })).listen(80);
  
  // Set up HTTPS server
  https.createServer(greenlockExpress.init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'tinzarpaing@gmail.com',
    cluster: false
  })).listen(443);

app.get("/", (req, res, next) => {
   res.json({
        status:200,
        message: "Hello world!!! CI/CD is working fine!!! ENV file added via docker script"
   })
});

app.get("/*", (req, res, next) => {
    res.contentType = 'text/plain';
    res.status(404);
    res.send("Not found");
});

app.listen(8080, () => {
    console.log("Server running on port 8080.");
});

// module.exports = app;