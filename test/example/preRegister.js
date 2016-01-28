'use strict';

module.exports = {
    connections: [{
        port: 0,
        labels: ['api', 'nasty', 'test']
    }, {
        host: 'localhost',
        port: 0,
        labels: ['api', 'nice']
    }],
    registrations: [{
        plugin: './--loaded'
    }],
    preRegister: function (server, next) {

        console.log('Inside `preRegister` function.');
        next();
    }
};
