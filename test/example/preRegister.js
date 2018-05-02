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
    preRegister: function (server) {

        console.log('Inside `preRegister` function.');
    }
};
