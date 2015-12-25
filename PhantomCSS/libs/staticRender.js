/*
  Static rendering
*/

var phantomcss = require('../libs/phantomcss.js'),
    selectorEnum = require('../libs/selectorConsts.js').Enum,
    mstrWeb = require('../libs/mstrWeb.js');

var VI_links = [],
    vizcount = 0;

exports.captureFolders = captureFolders;
exports.captureSingleFolder = captureSingleFolder;
exports.captureSingleDashboard = captureSingleDashboard;

/**
 * Static rendering for multiple folders
 * @param  {Object} configInfoObj [description]
 * @param  {Array} folderObjArr   folder list
 * @return null
 */
function captureFolders(configInfoObj, folderObjArr) {
    console.log("Start to open test folder one by one...");
    casper.each(folderObjArr, function(self, folderObj) {
        // generate url for each folder
        folderObj.url = mstrWeb.generateFolderURL(configInfoObj, folderObj.id);
        captureSingleFolder(configInfoObj, folderObj);
    });
}

/**
 * Static rendering for single folder
 * @param  {Object} configInfoObj [description]
 * @param  {Object} folder        [description]
 * @return null
 */
function captureSingleFolder(configInfoObj, folder) {
    // get VI lists in one folder
    casper.thenOpen(folder.url, function() {
        casper.waitForSelector(selectorEnum.FOLDERCONTAINER,
            function success() {
                console.log(folder.name + ": Navigate to this target folder successfully...");
            },
            function timeout() {
                casper.test.fail(folder.name + ": Fail to open this target folder");
            }
        );

        VI_links = casper.evaluate(function(folderContainer, dashboardLinks) {
            var links = document.querySelectorAll(dashboardLinks),
                count = links.length,
                lists = [];
            for (var i = 0; i < count; i++) {
                lists.push(links[i].href);
            }
            return lists;
        }, selectorEnum.FOLDERCONTAINER, selectorEnum.DASHBOARDLINKS);
    });

    // run dashboards one by one
    casper.then(function() {
        console.log(folder.name + ": Start to run dashboard one by one...");
        casper.each(VI_links, function(self, vizLink) {
            captureSingleDashboard(vizLink, configInfoObj.webserver, folder.name, folder.waitTime);
        });
    });
}

/**
 * Static rendering for single dashboardS
 * @param  {String} vizUrl     [description]
 * @param  {String} webserver  [description]
 * @param  {String} folderName [description]
 * @param  {String} waitTime   wait time before taking screenshot of panel, after the waitbox disappears
 * @return null
 */
function captureSingleDashboard(vizUrl, webserver, folderName, waitTime) {
    var data = _parseURL(vizUrl);

    casper.thenOpen(webserver, {
        method: "post",
        data: data
    }, function() {
        this.echo("Dashboard request has been sent successfully.");
    });

    casper.waitUntilVisible(selectorEnum.VIZCONTAINER,
        function success() {
            var viz_name = (casper.getTitle().split("."))[0];

            casper.waitWhileVisible(selectorEnum.MSTRWAITBOX,
                function success() {
                    vizcount++;

                    console.log(viz_name);

                    casper.then(function() {
                        // get the count of panels
                        var count = casper.evaluate(function() {
                            return (document.querySelectorAll('.mstrmojo-DockedPanelSelector .panel-list .item')).length;
                        });

                        var j = 0;
                        casper.repeat(count, function() {
                            var idx = j + 1;

                            casper.mouseEvent('click', selectorEnum.PANELSELECTOR + '[idx="' + j + '"]');

                            casper.waitUntilVisible(selectorEnum.PANELCONTAINER + '(' + idx + ')',
                                function success() {

                                    casper.waitWhileVisible(selectorEnum.MSTRWAITBOX,
                                        function success() {
                                            if (waitTime) {
                                                casper.wait(waitTime);
                                            }
                                            console.log("panel_" + idx);
                                            phantomcss.screenshot(selectorEnum.PANELCONTAINER + '(' + idx + ')', folderName + "/" + viz_name + "_panel_" + idx);
                                            j++;
                                        },
                                        function timeout() {
                                            phantomcss.screenshot('html', viz_name + "_panel_" + idx + "loading_timeout");
                                        });
                                },
                                function timeout() {
                                    phantomcss.screenshot('html', viz_name + "_panel_" + idx + "_timeout");
                                    casper.thenBypass(count - j - 1);
                                });
                        });
                    });
                },
                function timeout() {
                    phantomcss.screenshot('html', viz_name + "_timeout");
                    //casper.test.fail('Should see Viz_' + viz_name + " loading End");
                });
        },
        function timeout() {
            phantomcss.screenshot('html', "viz_" + vizcount + "_timeout");
            //casper.test.fail('Should see Viz opened');
        }
    );
}

function _parseURL(vizUrl) {
    var data = {};
    var paras = vizUrl.split("?")[1].split("&");
    var para = "";

    for (var i = 0, len = paras.length; i < len; i++) {
        para = paras[i].split("=");
        data[para[0]] = para[1];
    }

    return data;
}
