/*
  Scenario1
*/

var fs = require('fs'),
    runFuncTpl = require('../libs/scenarioTpl.js').run,
    selectorEnum = require('../libs/selectorConsts.js').Enum,
    mstrWeb = require('../libs/mstrWeb.js'),
    staticRender = require('../libs/staticRender.js'),
    configInfoObj = require('./configSuite1.js').configInfoObj;

// config folder list
var folderObjArr = [{
    name: 'PreCheckin_GM_HM_NV',
    id: '1CB4E5A34B36FB69DBF7EA9FF951A686',
}/*, {
    name: 'PreCheckin_3rdParty_map_imagelayout',
    id: '708146F2491EF8AD022F65948E705425',
    waitTime: 60000 // must > 0, if you needn't add extra waiting time after waitbox disappears, just remove this prop
}*/];

// each scenario should have a 'run()' method
exports.run = function() {
    runFuncTpl('scenario 2', configInfoObj, function() {
        staticRender.captureFolders(configInfoObj, folderObjArr);
    });
};
