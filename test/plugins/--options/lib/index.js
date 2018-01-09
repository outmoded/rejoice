'use strict';

const internals = {};


// Plugin registration

const register = function (server, options) {

    console.log('app.my: %s, options.key: %s', server.settings.app.my, options.key);
};


module.exports = {
    pkg: require('../package.json'),
    register
};
