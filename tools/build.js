{
    "appDir": "../www",
    "baseUrl": "js/lib",
    "paths": {
        // Because we cannot mix shim configs and CDN resource (see
        // https://github.com/jrburke/requirejs/wiki/Upgrading-to-RequireJS-2.0),
        // it is necessary to not include anything that is not AMD-capable in
        // the built file (and depend on something on the CDN). Otherwise, it 
        // will be loaded before its dependencies are loaded.
        "app": "../app",
        "jquery": "empty:",
        // From CDN
        "moment": "empty:",
        "Modernizr": "empty:",
        "json2": "empty:",
        "jquery.validate": "empty:"
    },
    "mainConfigFile": "../www/js/app.js", // relative to this file
    "optimizeCss": "standard",
    "dir": "../www-built",
    "modules": [
        {
            "name": "app"
        }
    ]
}
