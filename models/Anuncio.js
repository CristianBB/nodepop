'use strict';

const mongoose = require('mongoose');

//Creamos el esquema
const anuncioSchema = mongoose.Schema({
    nombre: {
        type: String,
        index: true
    },
    venta: {
        type: Boolean,
        index: true
    },
    precio: {
        type: Number,
        index: true
    },
    foto: String,
    tags: {
        type: [{
            type: String,
            enum: ['work', 'lifestyle', 'motor', 'mobile'],
            index: true
        }]
    }
});

//Método estático de filtrado
anuncioSchema.statics.list = function(filters, limit, skip, sort) {
    //Obtenemos la query sin ejecutarla
    const query = Anuncio.find(filters);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);

    //Ejecutamos la query y devolvemos una promesa
    return query.exec();
}

//Metodo estático para devolver los distintos tags de la BD
anuncioSchema.statics.tagList = function() {
    const query = Anuncio.find().distinct('tags');

    return query.exec();
}

//Creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

//Exportamos el modelo
module.exports = Anuncio;