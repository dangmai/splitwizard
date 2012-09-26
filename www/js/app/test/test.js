/*global requirejs, window, mocha, chai, describe, it*/
(function () {
    "use strict";

    requirejs.config({
        baseUrl: '../../lib',
        paths: {
            app: '../app'
        }
    });
    requirejs(['app/split'], function (split) {
        var expect = chai.expect,
            assert = chai.assert,
            spec = [
                "app/spec/split"
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