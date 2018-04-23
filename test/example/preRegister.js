'use strict';

module.exports = {
    server: {
        host: 'localhost',
        port: 0
    },
    register: {
        plugins: [
            {
                plugin: './--loaded'
            }
        ]
    },
    preRegister: function (server, next) {

        console.log('Inside `preRegister` function.');
        next();
    }
};
