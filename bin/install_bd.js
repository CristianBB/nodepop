'use strict';

const mongoose = require('mongoose');

// Carga conector a la base de datos 
require('../lib/connectMongoose');

// Carga los modelos
const Anuncio = require('../models/Anuncio');
const Usuario = require('../models/Usuario');

// Elimina el contenido de un modelo de entrada
function removeModel(model) {

    return new Promise((resolve, reject) => {
        //Elimina todo el contenido sin filtros
        model.remove({}, function(err) {
            if (err) {
                reject(new Error(`There was an Error removing data in collection ${model.collection.name} : ${err}`));
                return;
            }
            console.log(`Collection ${model.collection.name} removed`);
            resolve();
        });
    });
}

// Lee fichero de entrada y devuelve JSON del contenido
function readJSON(filename) {
    return new Promise((resolve, reject) => {
        try {
            const file = require('fs').readFileSync(__dirname + '/../init_config/' + filename, 'utf-8');
            const jsonFile = JSON.parse(file);
            resolve(jsonFile);
        } catch (err) {
            reject(new Error(`There was an Error reading JSON file ${filename} : ${err}`));
            return;
        }
    });
}


// Carga datos en un modelo desde json
function initModel(model, jsonData) {
    return new Promise((resolve, reject) => {
        model.collection.insertMany(jsonData, function(err, result) {
            if (err) {
                reject(new Error(`There was an Error inserting data in collection ${model.collection.name} : ${err}`));
                return;
            }
            console.log(`Collection ${model.collection.name} loaded correctly`);
            resolve();
        });

    });
}

async function main() {
    await removeModel(Anuncio) //Elimina contenido de la colección anuncios
    await removeModel(Usuario) //Elimina contenido de la colección usuarios

    //Carga el contenido del fichero de anuncios y usuarios
    const jsonAnuncios = await readJSON('anuncios.json');
    let jsonUsuarios = await readJSON('usuarios.json');

    //Calcula hash de las claves de usuario
    for (let i = 0; i < jsonUsuarios['usuarios'].length; i++) {
        let clave = jsonUsuarios['usuarios'][i].clave;
        let hash = Usuario.generateHash(clave);
        jsonUsuarios['usuarios'][i].clave = hash;
    }

    await initModel(Anuncio, jsonAnuncios['anuncios']); //Carga contenido inicial en colección anuncios
    await initModel(Usuario, jsonUsuarios['usuarios']); //Carga contenido inicial en colección usuarios 

    //Termina el proceso
    mongoose.connection.close();
    process.exit(0);
}

main().catch(err => {
    console.log(err);
    process.exit(1); //Finaliza ejecución con código de error "1"
});