/*global requirejs, window, mocha, chai, describe, it*/
(function () {
    "use strict";

    requirejs.config({
        baseUrl: '../../lib',
        paths: {
            app: '../app',
            "bootstrap-datepicker": 'bootstrap-datepicker/js/bootstrap-datepicker'
        },
        urlArgs: "bust=" +  (new Date()).getTime(),
        shim: {
            'bootstrap-datepicker': ['jquery']
        }
    });
    requirejs(['app/split'], function (split) {
        var expect = chai.expect,
            assert = chai.assert,
            spec = [
                "app/spec/split",
                "app/spec/model",
                "app/spec/main"
            ];
        mocha.ui('bdd');
        mocha.reporter('html');
        requirejs(spec, function () {
            if (window.mochaPhantomJS) {
                window.mochaPhantomJS.run();
            } else {
                mocha.run();
            }
        });
    });
}());