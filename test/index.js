// Load modules

var ChildProcess = require('child_process');
var Fs = require('fs');
var Os = require('os');
var Path = require('path');
var Code = require('code');
var Hoek = require('hoek');
var Lab = require('lab');
var Rejoice = require('..');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('start()', function () {

});

describe('bin/rejoice', function () {

    it('composes pack with absolute path', function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            servers: [
                {
                    port: 0,
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: 'localhost',
                    port: 0,
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--loaded': {}
            }
        };

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');
        var modulePath = Path.join(__dirname, 'plugins');

        Fs.writeFileSync(configPath, JSON.stringify(manifest));

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', modulePath]);

        hapi.stdout.on('data', function (data) {

            expect(data.toString()).to.equal('loaded\n');
            hapi.kill();
            Fs.unlinkSync(configPath);

            done();
        });

        hapi.stderr.on('data', function (data) {

            expect(data.toString()).to.not.exist();
        });
    });

    it('composes pack with absolute path using symlink', { skip: process.platform === 'win32' }, function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            servers: [
                {
                    port: 0,
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: 'localhost',
                    port: 0,
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--loaded': {}
            }
        };

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');
        var modulePath = Path.join(__dirname, 'plugins');
        var symlinkPath = Hoek.uniqueFilename(Os.tmpDir());

        Fs.symlinkSync(modulePath, symlinkPath, 'dir');
        Fs.writeFileSync(configPath, JSON.stringify(manifest));

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', symlinkPath]);

        hapi.stdout.on('data', function (data) {

            expect(data.toString()).to.equal('loaded\n');
            hapi.kill();

            Fs.unlinkSync(configPath);
            Fs.unlinkSync(symlinkPath);

            done();
        });

        hapi.stderr.on('data', function (data) {

            expect(data.toString()).to.not.exist();
        });
    });

    it('fails when path cannot be resolved', function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            servers: [
                {
                    port: 0,
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: 'localhost',
                    port: 0,
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--loaded': {}
            }
        };

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');

        Fs.writeFileSync(configPath, JSON.stringify(manifest));

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', 'somethingWrong']);

        hapi.stdout.on('data', function (data) {

            expect(data.toString()).to.not.exist();
        });

        hapi.stderr.on('data', function (data) {

            expect(data.toString()).to.include('ENOENT');

            hapi.kill();

            Fs.unlinkSync(configPath);

            done();
        });
    });

    it('errors when it cannot require the extra module', function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            servers: [
                {
                    port: 0,
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: 'localhost',
                    port: 0,
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--loaded': {}
            }
        };

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var extraPath = 'somecoolmodule';
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');
        var modulePath = Path.join(__dirname, 'plugins');

        Fs.writeFileSync(configPath, JSON.stringify(manifest));

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', modulePath, '--require', extraPath]);

        hapi.stdout.on('data', function (data) {

            expect(data.toString()).to.not.exist();
        });

        hapi.stderr.on('data', function (data) {

            expect(data.toString()).to.include('Cannot find module');

            hapi.kill();

            Fs.unlinkSync(configPath);

            done();
        });
    });
    it('errors when it cannot require the extra module from absolute path', function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            servers: [
                {
                    port: 0,
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: 'localhost',
                    port: 0,
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--loaded': {}
            }
        };

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var extraPath = Hoek.uniqueFilename(Os.tmpDir());
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');
        var modulePath = Path.join(__dirname, 'plugins');

        Fs.writeFileSync(configPath, JSON.stringify(manifest));

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', modulePath, '--require', extraPath]);

        hapi.stdout.on('data', function (data) {

            expect(data.toString()).to.not.exist();
        });

        hapi.stderr.on('data', function (data) {

            expect(data.toString()).to.include('Cannot find module');

            hapi.kill();

            Fs.unlinkSync(configPath);

            done();
        });
    });

    it('loads extra modules as intended', function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            servers: [
                {
                    port: 0,
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: 'localhost',
                    port: 0,
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--loaded': {}
            }
        };

        var extra = 'console.log(\'test passed\')';

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var extraPath = Hoek.uniqueFilename(Os.tmpDir());
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');
        var modulePath = Path.join(__dirname, 'plugins');

        Fs.writeFileSync(configPath, JSON.stringify(manifest));
        Fs.writeFileSync(extraPath, extra);

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', modulePath, '--require', extraPath]);

        hapi.stdout.on('data', function (data) {

            expect(data.toString()).to.equal('test passed\n');
            hapi.kill();

            Fs.unlinkSync(configPath);
            Fs.unlinkSync(extraPath);

            done();
        });

        hapi.stderr.on('data', function (data) {

            expect(data.toString()).to.not.exist();
        });
    });

    it('parses $prefixed values as environment variable values', { parallel: false }, function (done) {

        var manifest = {
            pack: {
                cache: {
                    engine: 'catbox-memory'
                },
                app: {
                    my: '$env.special_value'
                }
            },
            servers: [
                {
                    port: '$env.undefined',
                    options: {
                        labels: ['api', 'nasty', 'test']
                    }
                },
                {
                    host: '$env.host',
                    port: '$env.port',
                    options: {
                        labels: ['api', 'nice']
                    }
                }
            ],
            plugins: {
                './--options': {
                    key: '$env.plugin_option'
                }
            }
        };

        var changes = [];
        var setEnv = function (key, value) {

            var previous = process.env[key];

            if (typeof value === 'undefined') {
                delete process.env[key];
            }
            else {
                process.env[key] = value;
            }

            return setEnv.bind(null, key, previous);
        };

        changes.push(setEnv('host', 'localhost'));
        changes.push(setEnv('plugin_option', 'plugin-option'));
        changes.push(setEnv('port', 0));
        changes.push(setEnv('special_value', 'special-value'));
        // Ensure that the 'undefined' environment variable is *not* set.
        changes.push(setEnv('undefined'));

        var configPath = Hoek.uniqueFilename(Os.tmpDir());
        var rejoice = Path.join(__dirname, '..', 'bin', 'rejoice');
        var modulePath = Path.join(__dirname, 'plugins');

        Fs.writeFileSync(configPath, JSON.stringify(manifest));

        var hapi = ChildProcess.spawn('node', [rejoice, '-c', configPath, '-p', modulePath]);

        hapi.stdout.setEncoding('utf8');
        hapi.stdout.on('data', function (data) {

            expect(data).to.equal('app.my: special-value, options.key: plugin-option\n');
            hapi.kill();
            Fs.unlinkSync(configPath);

            var restore = changes.pop();
            while (restore) {
                restore();
                restore = changes.pop();
            }

            done();
        });

        hapi.stderr.setEncoding('utf8');
        hapi.stderr.on('data', function (data) {

            expect(data).to.not.exist();
        });
    });
});
