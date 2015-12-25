/*
  Template of scenario
*/

var fs = require('fs');
var phantomcss = require('../libs/phantomcss.js');
var mstrWeb = require('./mstrWeb.js');

/**
 * [run description]
 * @param  {String} scenarioName [description]
 * @param  {Object} configInfoObj     [description]
 * @param  {Function} calbak     [description]
 * @return {[type]}              [description]
 */
exports.run = function(scenarioName, configInfoObj, calbak) {
    casper.test.begin(configInfoObj.testsuite + ' - ' + scenarioName + ' started!', function(test) {
        var outputRoot = '/' + configInfoObj.testsuite + '/' + scenarioName,
            comparisonResultRoot = fs.workingDirectory + '/output' + outputRoot,
            failedComparisonsRoot = fs.workingDirectory + '/failures' + outputRoot,
            i, il;

        phantomcss.init({
            rebase: casper.cli.get("rebase"),
            casper: casper,
            libraryRoot: fs.absolute(fs.workingDirectory + ''),
            screenshotRoot: fs.absolute(fs.workingDirectory + '/baselines'),
            comparisonResultRoot: fs.absolute(comparisonResultRoot),
            failedComparisonsRoot: fs.absolute(failedComparisonsRoot),
            addLabelToFailedImage: false,
        });

        casper.on('remote.message', function(msg) {
            this.echo(msg);
        });

        casper.on('error', function(err) {
            this.die("PhantomJS has errored: " + err);
        });

        casper.on('resource.error', function(err) {
            casper.log('Resource load error: ' + err, 'warning');
        });

        // configuration for casper
        casper.options.waitTimeout = configInfoObj.waitTimeout;
        casper.options.viewportSize = {
            width: configInfoObj.viewsize.width,
            height: configInfoObj.viewsize.height
        };

        // start casper instance and delete existing output and failures folder
        casper.start().then(function() {
            if (fs.exists(comparisonResultRoot)) {
                console.log("Deleting related output folder...");
                fs.removeTree(comparisonResultRoot);
            }
            if (fs.exists(failedComparisonsRoot)) {
                console.log("Deleting related failures folder...");
                fs.removeTree(failedComparisonsRoot);
            }
        });

        // login
        mstrWeb.login(configInfoObj);

        // body of specific scenario
        calbak();

        // compare all the screenshots
        casper.then(function now_check_the_screenshots() {
            phantomcss.compareAll();
        });

        // Casper runs tests
        casper.run(function() {
            console.log('\nTHE END.');
            // phantomcss.getExitStatus() // pass or fail?
            casper.test.done();
        });
    });
};
