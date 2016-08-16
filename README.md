#rejoice

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
    "connections": [
        {
            "port": 8080,
            "routes": {
                "timeout": {
                    "server": 10000
                }
            },
            "load": {
                "maxHeapUsedBytes": 1073741824,
                "maxRssBytes": 2147483648,
                "maxEventLoopDelay": 5000
            },
            "labels": [
                "api",
                "http"
            ]
        },
        {
            "port": 8999,
            "labels": [
                "admin"
            ]
        }
    ],
    "server": {
        "load": {
            "sampleInterval": 1000
        }
    },
    "registrations": [
        {
            "plugin": {
                "register": "good",
                "options": {
                    "ops": {
                      "interval": 5000
                    },
                    "reporters": {
                        "myConsoleReporter": [{
                            "module": "good-squeeze",
                            "name": "Squeeze",
                            "args": [{ "log": "*", "response": "*" }]
                        }, {
                            "module": "good-console"
                        }, "stdout"],
                        "myFileReporter": [{
                            "module": "good-squeeze",
                            "name": "Squeeze",
                            "args": [{ "ops": "*" }]
                        }, {
                            "module": "good-squeeze",
                            "name": "SafeJson"
                        }, {
                            "module": "good-file",
                            "args": ["./test/fixtures/awesome_log"]
                        }]
                    }
                }
            }
        },
        {
            "plugin": "lout"
        }
    ]
}
```

You can specify a specific path to be passed to Glue as the `relativeTo` option by using the `-p` flag.

```javascript
rejoice -c app.json -p /full/path/to/project/plugin/dir
```

This will allow your plugins to use relative paths in the config file.  See the example below.

```javascript
{
    "connections": [
        {
            "port": 8080,
            "labels": [
                "api",
                "http"
            ]
        }
    ],
    "registrations": [
        {
            "plugin": "lout"
        },
        {
            "plugin": "./myplugin"
        }
    ]
}
```

When using regular JS file, you may add `preConnections` or `preRegister` callbacks. See the example below.

```javascript
module.exports = {
  connections: [ '...' ],
  registrations: [ '...' ],
  preConnections: function(server, next) {
    // your preConnections logic goes here
    next();
  },
  preRegister: function(server, next) {
    // your preRegister logic goes here
    next();
  }
};
```

For more information about these options, see [Glue's API](https://github.com/hapijs/glue/blob/master/API.md).

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
