/** 
 * test entry: execute test suites
 **/

/**
 * Execute testSuite1
 * @type {[type]}
 */
// read scenario list from configSuites file
var scenarioArr = require('./configSuite1.js').scenarioArr;

for (var i = 0, il = scenarioArr.length; i < il; i++) {
    require('./' + scenarioArr[i]).run();
}