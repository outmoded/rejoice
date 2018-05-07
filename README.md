# rejoice

hapi.js CLI.

[![Build Status](https://travis-ci.org/hapijs/rejoice.svg)](https://travis-ci.org/hapijs/rejoice)

Lead Maintainer - [Lloyd Benson](https://github.com/lloydbenson)

Rejoice is a CLI tool for hapi which requires a js/json file with the config.  It relies on the composer library called glue (http://github.com/hapijs/glue).

To start it up simply:

```javascript
rejoice -c app.json

// or using regular JS file
// where app.js must export the config object
rejoice -c app.js
```

where app.json may look something like:

```javascript
{
    server: {
        cache: 'redis',
        port: 8000
    },
    register: {
        plugins: [
            './awesome-plugin.js',
            {
                plugin: require('myplugin'),
                options: {
                    uglify: true
                }
            },
            {
                plugin: './ui-user'
            },
            {
                plugin: './ui-admin',
                options: {
                    sessiontime: 500
                },
                routes: {
                    prefix: '/admin'
                }
            }
        ],
        options: {
            once: false
        }
    }
}
```

For more information about manifests, see [Glue's API](https://github.com/hapijs/glue/blob/master/API.md).

You can specify a specific path to be passed to Glue as the `relativeTo` option by using the `-p` flag.

```javascript
rejoice -c app.json -p /full/path/to/project/plugin/dir
```

If you need a module required before your application is loaded you can use the `-r` flag.

```javascript
rejoice -c app.json -r `module`
```

Multiple modules can be required by using the `-r` flag as many times as needed. This example requires two modules from an implied source of `node_modules`.

```
rejoice -c app.json -r babel/register -r dotenv/config
```

When using `-r` with the `-p` flag, the `-p` flag takes on an additional meaning.  In this case, the `-p` specifies the path where the module specified in `-r` will be found.

```javascript
rejoice -c app.json -r `module` -p /base/path/to/required/module
```

The resulting search path for `module` would be `/base/path/to/required/module/node_modules`.

To specify both a `-p` option to be passed to Glue and specify a path to locate the `-r` module use an absolute path for `-r`.

```javascript
rejoice -c app.json -p ./lib -r /absolute/path/to/module
```
