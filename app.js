var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require("i18n");

var app = express();

//Cargamos el conector a la base de datos 
require('./lib/connectMongoose');

//Inicializa i18n
i18n.configure({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    directory: __dirname + '/locales'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//libreria de internacionalizacion
app.use(i18n.init);

//rutas del APIv1
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {

    if (isAPI(req)) { //Si es una petición de API devuelve JSON
        res.status(err.status).json({ success: false, error: err.message });
        return;
    }

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).render('error');
});

//Función que devuelve si una petición es de la API o no
function isAPI(req) {
    return req.originalUrl.indexOf('/apiv') === 0; //Devuelve 1 si la url de la petición empieza por "/apiV"
}

module.exports = app;