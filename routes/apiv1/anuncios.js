'use strict';

const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtauth');
const parseFilter = require('../../lib/parseFilter');
const myError = require('../../lib/myError');

// Cargar el modelo de Agente
const Agente = require('../../models/Anuncio');

/**
 * GET /
 * Obtener la lista de anuncios
 */
router.get('/', jwtAuth(), async(req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const start = parseInt(req.query.start) || 0;
        const sort = req.query.sort;
        const filter = parseFilter(req);

        //Realiza la consulta
        const rows = await Agente.list(filter, limit, start, sort);

        //Devuelve resultado
        res.json({ success: true, result: rows });
    } catch (err) {
        next(myError(res.__('ERR_GET_ADS') + ": " + err.message, 500));
        return;
    }
});

/**
 * GET /tags
 * Obtener lista de tags disponibles
 */
router.get('/tags', async(req, res, next) => {
    try {
        const tagList = await Agente.tagList();
        res.json({ success: true, result: tagList });
    } catch (err) {
        next(myError(res.__('ERR_GET_TAGS') + ": " + err.message, 500));
        return;
    }
});

module.exports = router;