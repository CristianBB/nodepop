'use strict';

function parseFilter(req) {
    const tags = req.query.tags;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const nombre = req.query.nombre;

    //Creo el filtro vacio
    let filter = {};

    //Agrega los filtros que han llegado
    if (tags) filter.tags = { $all: tags };
    if (venta) filter.venta = venta;
    if (nombre) filter.nombre = { $regex: new RegExp('^' + nombre + '.*', 'i') };

    if (precio) {
        const precioSplitted = precio.split('-');

        if (precioSplitted.length == 1) {
            //Precio = "XX"
            filter.precio = precioSplitted[0];

        } else if (precioSplitted.length == 2 && precioSplitted[0] == '') {
            //Precio = "-XX"
            filter.precio = { $lte: precioSplitted[1] };

        } else if (precioSplitted.length == 2 && precioSplitted[1] == '') {
            //Precio = "XX-"
            filter.precio = { $gte: precioSplitted[0] };

        } else if (precioSplitted.length == 2) {
            //Precio = "XX-XX"
            filter.precio = { $gte: precioSplitted[0], $lte: precioSplitted[1] };
        }

    }

    return filter;
}

module.exports = parseFilter;