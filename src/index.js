const express = require('express');
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const api = require('./api');
const fs = require('fs')
const http = require('http')
const helmet = require("helmet");

//const dotenv = dotenvm.config();


const app = express();
const port = process.env.PORT || 3001;

/*
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      //"base-uri": "https://cascadesdb.org/",
      "default-src": ["'self'", "https://cascadesdb.org", "http://cascadesdb.org", "cascadesdb.org", "cascadesdb.org/csaransh"],
      "script-src": ["'self'", "https://cascadesdb.org", "http://cascadesdb.org", "cascadesdb.org", "cascadesdb.org/csaransh"]
    },
  })
);
*/
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(express.static('client/build/'))
app.use('/csaransh/', express.static('client/build/'))

//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
*/

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  app.use(api());
  console.log(`Server started listening on http://localhost:${port}`);  
});