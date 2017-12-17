'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Crea el esquema
const usuarioSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    clave: { type: String, required: true },
});

// Define indice
usuarioSchema.index({ 'email': 1 }, { unique: true });

// Método estatico de creación de Hash
usuarioSchema.statics.generateHash = function(clave) {
    return bcrypt.hashSync(clave, bcrypt.genSaltSync(8), null);
};

// Método de validación de Password
usuarioSchema.methods.validatePassword = function(clave) {
    return bcrypt.compareSync(clave, this.clave);
};

//Creamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

//Exportamos el modelo
module.exports = Usuario;