/*
=   Dependencies
=   @TODO update this to es6 as soon as we can figure out the issues with dep exports
*/
var config = require('config');
var _ = require('underscore');
var cluster = require('cluster');
var http = require('http');
var path = require('path');
var helmet = require('helmet');
var flash = require('connect-flash');
var winston = require('winston');
var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var CPU = require('cpu');
var Sequelize = require('sequelize');
var Redis = require('redis');
var API = require('./assets/js/utils/API.js');
var Store = require('connect-redis')(session);


/*
=   Constants
*/
const CPU_COUNT = CPU.num();
const PORT_REDIS = process.env.PORT_REDIS || 9090;
const PORT_APP = process.env.PORT_APP || 8080;
const DB_URL = process.env.DB_URL;

/*
=   App components
*/
let app = express();
let redis = Redis.createClient();
let router = express.Router();

/*
=   Generate workers
*/
if (cluster.isMaster) {
    for (var i = 0; i < CPU_COUNT; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker}/${code}: received ${signal} signal`);
        cluster.fork();
    });
}

/*
=   App configuration
*/
else if (cluster.isWorker) {
    app.set('view engine', 'mustache');
    app.set('views', __dirname + '/views');
    app.engine('mustache', require('hogan-middleware').__express);
    app.use(express.static(__dirname + '/public'));
    app.use(helmet());
    app.use(cookieParser(config.get('secrets.cookie')));
    app.use(session({
        secret: process.env.SESSION_SECRET || config.get('secrets.session'),
        key: process.env.SESSION_IDENTIFIER || config.get('keys.session'),
        proxy: true,
        store: new Store({ host: config.get('redis.host'), port: config.get('redis.port'), client: redis }),
        saveUninitialized: false,
        resave: false
    }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    /*
    =   Redis client events
    */
    redis.on('connected', () => {
        // @TODO Applesauce: log event
        console.log('connected');
    });

    redis.set('framework', 'express', (error, reply) => {
        if (!error) {
            // @TODO Applesauce: log event
        } else {
            // @TODO Applesauce: log event
            console.log(`Redis error: ${error}`);
        }
    });

    /*
    =   Postgres
    */
    require('./lib/postgres.js')(Sequelize);



    router.get('/', (request, response) => {
        response.render('index', {
            title: 'Buttlog'
        });
    });

    router.get('/session/set/:value', (request, response) => {
    	request.session.redSession = request.params.value;
    	response.send('session written in Redis successfully');
    });

    router.get('/session/get/', (request, response) => {
    	if(request.session.redSession)
    		response.send('the session value stored in Redis is: ' + request.session.redSess);
    	else
    		response.send("no session value stored in Redis ");
    });

    app.use('/', router);

    http.createServer(app).listen(PORT_APP);
    console.log(`Buttlog started on ${PORT_APP}`);
}
