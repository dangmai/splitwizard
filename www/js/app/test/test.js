/*global requirejs, window, mocha, chai, describe, it*/
(function () {
    "use strict";

    requirejs.config({
        baseUrl: '../../lib',
        paths: {
            app: '../app',
            "bootstrap-datepicker": 'bootstrap-datepicker/js/bootstrap-datepicker'
        },
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
                "app/spec/main",
                "app/spec/util"
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