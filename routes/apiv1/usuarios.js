'use strict';

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const myError = require('../../lib/myError');

/**
 * POST /authenticate
 * Comprueba datos de usuario y devuelve token de sesión
 */
router.post('/authenticate', [
    check('email')
    .exists().withMessage('PARM_EMAIL')
    .isEmail().withMessage('PARM_EMAIL_FORMAT')
    .trim()
    .normalizeEmail(),

    check('clave')
    .exists().withMessage('PARM_PASS')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Existen errores de validacion
        const firstErr = errors.array({ onlyFirstError: true })[0]; //Únicamente devuelve el primer error
        next(myError(res.__(firstErr.msg), 401));
        return;
    }

    // Busca en la base de datos el usuario
    Usuario.findOne({ email: req.body.email }, (err, usuario) => {
        if (err) {
            next(myError(res.__('ERR_GET_USER'), 500));
            return;
        }

        if (!usuario) {
            next(myError(res.__('USER_NOT_FOUND'), 401));
            return;
        }

        // Valida password de usuario
        if (!usuario.validatePassword(req.body.clave)) {
            next(myError(res.__('INVALID_PASS'), 401));
            return;
        }

        // Crea Token de usuario
        jwt.sign({ user_id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if (err) {
                next(myError(res.__('ERR_CREATE_TOKEN') + ': ' + err.message, 500));
                return;
            }

            //Devolvemos el token
            res.json({ success: true, result: token });
        });
    });

});

/**
 * POST /registro
 * Realiza el alta de nuevo usuario en BD
 */
router.post('/registro', [
    check('nombre')
    .exists().withMessage('PARM_NAME')
    .trim(),

    check('email')
    .exists().withMessage('PARM_EMAIL')
    .isEmail().withMessage('PARM_EMAIL_FORMAT')
    .trim()
    .normalizeEmail(),

    check('clave')
    .exists().withMessage('PARM_PASS')
], function(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Existen errores de validacion
        const firstErr = errors.array({ onlyFirstError: true })[0]; //Únicamente devuelve el primer error
        next(myError(res.__(firstErr.msg), 400));
        return;
    }

    const usuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        clave: Usuario.generateHash(req.body.clave)
    });

    usuario.save((err) => {
        if (err) {
            if (err.code === 11000) {
                next(myError(res.__('USER_EXISTS'), 400));
            } else {
                next(myError(res.__('ERR_CREATE_USER') + ": " + err.message, 500));
            }
            return;
        }
        res.json({ success: true });
    });
});


module.exports = router;