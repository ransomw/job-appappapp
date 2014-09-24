var assert = require("assert");
// var hoodie_server = require('hoodie_server');

var environment = require('hoodie-server/lib/core/environment');
var hconsole = require('hoodie-server/lib/utils/hconsole');
var app = require('hoodie-server/lib');

var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'http://localhost:6001/',
    waitSeconds: 30,
    paths: {
        'hoodie': '_api/_files/hoodie',
        'jquery': 'bower_components/jquery/dist/jquery.min'
    },
    shim: {
        'hoodie': {
            deps: ['jquery'],
            exports: 'Hoodie'
        }
    }
});

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('login tests', function () {

    before(function (done) {
        var project_dir = process.cwd();

        var cfg = environment.getConfig(
            process.platform,   // platform
            process.env,        // environment vars
            project_dir,        // project directory
            {} // no args
        );

        app.init(cfg, function (err) {
            if (err) {
                hconsole.error(err);
                process.exit(1);
            }
            // line break before logs
            console.log('');
            var Hoodie;

            requirejs([
                'hoodie'
            ], function (mHoodie) {
                Hoodie = mHoodie;
            });

            debugger;
            done();
        });

    });

    it('should register a new user', function () {

    });

});
