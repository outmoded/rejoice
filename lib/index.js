'use strict';

const Bossy = require('bossy');
const Fs = require('fs');
const Path = require('path');
const Util = require('util');


// Declare internals

const internals = {};


internals.definition = {
    c: {
        description: 'Manifest json file',
        require: true
    },
    p: {
        description: 'node_modules path'
    },
    r: {
        alias: 'require',
        description: 'A module to be required before the application is loaded',
        multiple: true
    },
    h: {
        alias: 'help',
        description: 'Show help',
        type: 'boolean'
    }
};


internals.loadExtras = function (args) {

    const extras = args.require;

    if (!extras) {
        return;
    }

    let extrasPath;
    const nodeModulesPath = Path.join(args.p ? Fs.realpathSync(args.p) : process.cwd(), 'node_modules');

    for (let i = 0; i < extras.length; ++i) {
        const extra = extras[i];
        if (!Path.isAbsolute(extra)) {
            if (extra[0] === '.') {
                extrasPath = Path.join(process.cwd(), extra);
            }
            else {
                extrasPath = Path.join(nodeModulesPath, extra);
            }
        }
        else {
            extrasPath = extra;
        }

        try {
            require(extrasPath);
        }
        catch (err) {
            console.error('Unable to require extra file: %s (%s)', extra, err.message);
            return err;
        }
    }
};


internals.getManifest = function (args) {

    let manifest;
    const manifestPath = Path.resolve(process.cwd(), args.c);

    try {
        manifest = require(manifestPath);
    }
    catch (err) {
        console.log('Failed loading configuration file: %s (%s)', args.c, err.message);
        return err;
    }

    internals.parseEnv(manifest);

    return manifest;
};


internals.loadPacks = async function (args, manifest) {

    const options = {};

    options.preRegister = manifest.preRegister;

    delete manifest.preRegister;

    if (!args.p) {
        return options;
    }

    const realPath = Util.promisify(Fs.realpath);
    const path = await realPath(args.p);

    options.relativeTo = path;
    return options;
};


internals.parseEnv = function (manifest) {

    if (!manifest ||
        typeof manifest !== 'object') {

        return;
    }

    Object.keys(manifest).forEach((key) => {

        const value = manifest[key];
        if (typeof value === 'string' && value.startsWith('$env.')) {

            manifest[key] = process.env[value.slice(5)];
        }
        else {
            internals.parseEnv(value);
        }
    });
};


exports.start = async function (options) {

    const args = Bossy.parse(internals.definition, {
        argv: options.args
    });

    if (args instanceof Error) {
        console.error(Bossy.usage(internals.definition, 'rejoice -c manifest.json [-p node_modules_path -r pre_load_module]'));
        return process.exit(1);
    }

    if (args.h) {
        console.log(Bossy.usage(internals.definition, 'rejoice -c manifest.json [-p node_modules_path -r pre_load_module]'));
        return process.exit(1);
    }

    if (internals.loadExtras(args) instanceof Error) {
        return process.exit(1);
    }

    const manifest = internals.getManifest(args);

    if (manifest instanceof Error) {
        return process.exit(1);
    }

    let server;
    process.once('SIGQUIT', async () => {

        await server.stop();
        process.exit(0);
    });

    // Use kill -s SIGUSR2 {pid} to restart the servers
    process.on('SIGUSR2', async () => {

        console.log('Stopping...');
        await server.stop();
        console.log('Starting...');
        exports.start(options);
    });

    try {
        const packOptions = await internals.loadPacks(args, manifest);
        const Glue = require('glue');

        server = await Glue.compose(manifest, packOptions);

        await server.start();

    }
    catch (err) {
        console.error(err);
        return process.exit(1);
    }
};
