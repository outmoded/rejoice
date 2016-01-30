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
    preConnections: function (server, next) {

        console.log('Inside `preConnections` function.');
        next();
    }
};
