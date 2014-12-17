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
            "logRequestHeaders": true,
            "reporters": [{
                "reporter": "good-console",
                "args": [{ "request": "*", "ops": "*", "log": "*", "error": "*" }]
            },
            {
                "reporter": "good-file",
                "args": [
                    "/log/", { "request": "*", "error": "*" }, { "fileName": "request.log" }
                ]
            },
            {
                "reporter": "good-file",
                "args": [
                    "/log/", { "ops": "*" }, { "fileName": "ops.log" }
                ]
            }]
        },
        "lout": {}
    }
}

```
