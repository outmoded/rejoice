#rejoice

hapi.js CLI.

[![Build Status](https://secure.travis-ci.org/hapijs/rejoice.png)](http://travis-ci.org/hapijs/rejoice)

Lead Maintainer - [Lloyd Benson](https://github.com/lloydbenson)

Rejoice is a CLI tool for hapi which requires a json file with the config.  It relies on the composer library called glue (http://github.com/hapijs/glue).

To start it up simply:

```javascript
rejoice -c app.json
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
    "plugins": {
        "good": {
            "opsInterval": 5000,
            "requestHeaders": true,
            "reporters": [{
                "reporter": "good-console",
                "events": { "response": "*", "ops": "*", "log": "*", "error": "*" }
            },
            {
                "reporter": "good-file",
                "events": { "response": "*", "error": "*" },
                "config": "/log/response.log"
            },
            {
                "reporter": "good-file",
                "events": { "ops": "*" },
                "config": "/log/ops.log"
            }]
        },
        "lout": {}
    }
}
```

You can specify a specific node_modules top level path by using the `-p` flag.

```javascript
rejoice -c app.json -p /full/path/node_modules
```

This will allow you for your plugins to use relative paths in the config file as well.  See the example below.

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
    },
    "plugins": {
        "good": {
            "opsInterval": 5000,
            "requestHeaders": true,
            "reporters": [{
                "reporter": "good-console",
                "events": { "response": "*", "ops": "*", "log": "*", "error": "*" }
            },
        },
        "lout": {},
        "./myplugin": {}
    }
}
```

If you need a module required before your application is loaded you can use the `-r` flag.

```javascript
rejoice -c app.json -r `module`
```
