'use strict';

const jwt = require('jsonwebtoken');
const myError = require('./myError');

//exportamos un creador de middlewares de autenticación
module.exports = () => {
    return function(req, res, next) {
        // leer credenciales, pueden venir en el body, por query o en las cabeceras
        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token) {
            next(myError(res.__('NO_TOKEN'), 401));
            return;
        }

        // comprobar credenciales
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                next(myError(res.__('INVALID_TOKEN'), 401));
                return;
            }
            // continuar 
            req.userId = decoded.user_id; //Lo guardamos en el request para los siguientes middlewares
            next();
        });
    }
};