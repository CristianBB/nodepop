'use strict';

function myError(message, statusCode) {

    let genError = new Error(message);
    genError.status = statusCode;

    return genError;
}

module.exports = myError;