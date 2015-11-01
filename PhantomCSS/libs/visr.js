/*
  Require and initialise PhantomCSS module
  Paths are relative to CasperJs directory
*/

var fs = require('fs');
var phantomcss = require('../phantomcss.js');

// consts - dom selector
var login_component = {
    container: '#lb_LoginStyle',
    user: '#Uid',
    pwd: '#Pwd',
    submit: '.mstrLoginButtonBarLeft input'
    },
    folder_container = '#folderAllModes',
    dashboard_links = '#folderAllModes span[sty="nm"] a',
    viz_container = '.mstrmojo-VIDocLayout .mstrmojo-VIPanel-content .mstrmojo-VIVizPanel-content',
    panelseletor = '.mstrmojo-DockedPanelSelector .panel-list .item',
    panelcontainer = '.mstrmojo-VIVizPanel-content .mstrmojo-VIDocRelativePanel:nth-child',
    mstrWaitBox = "#waitBox .mstrWaitBox",
    VI_links = [],
    vizcount = 0;


exports.staticRendering = staticRendering;

function staticRendering(config_info, folder_list) {
    casper.test.begin('Mojo visual tests - ' + config_info.testsuite, function(test) {
        var outputRoot = '/' + config_info.testsuite,
            comparisonResultRoot = fs.workingDirectory + '/output' + outputRoot,
            failedComparisonsRoot = fs.workingDirectory + '/failures' + outputRoot,
            i, il;

        phantomcss.init({
            rebase: casper.cli.get("rebase"),
            casper: casper,
            libraryRoot: fs.absolute(fs.workingDirectory + ''),
            screenshotRoot: fs.absolute(fs.workingDirectory + '/baselines' + outputRoot),
            comparisonResultRoot: fs.absolute(comparisonResultRoot),
            failedComparisonsRoot: fs.absolute(failedComparisonsRoot),
            addLabelToFailedImage: false,
        });

        casper.on('remote.message', function(msg) {
            this.echo(msg);
        })

        casper.on('error', function(err) {
            this.die("PhantomJS has errored: " + err);
        });

        casper.on('resource.error', function(err) {
            casper.log('Resource load error: ' + err, 'warning');
        });

        // configuration for casper
        casper.options.waitTimeout = config_info.waitTimeout;
        casper.options.viewportSize = {
            width: config_info.viewsize.width,
            height: config_info.viewsize.height
        };

        casper.start(config_info.login_url);

        // delete existing output and failures folder
        casper.then(function() {
            if (fs.exists(comparisonResultRoot)) {
                console.log("Deleting related output folder...");
                fs.removeTree(comparisonResultRoot);
            }
            if (fs.exists(failedComparisonsRoot)) {
                console.log("Deleting related failures folder...");
                fs.removeTree(failedComparisonsRoot);
            }
        })

        casper.then(function() {
            // wait for login container to appear 
            casper.waitForSelector(login_component.container,
                function success() {
                    casper.evaluate(function(username, password, login_component) {
                        document.querySelector(login_component.user).value = username;
                        document.querySelector(login_component.pwd).value = password;
                        document.querySelector(login_component.submit).click();
                    }, config_info.username, config_info.password, login_component);
                    console.log("Login...");
                },
                function timeout() {
                    casper.test.fail('Should see Login container');
                }
            )
        });

        console.log("Start to open test folder one by one...");
        casper.eachThen(folder_list, function(folderItem) {
            _srSingleFolder(config_info, folderItem.data);
        });

        casper.then(function now_check_the_screenshots() {
            phantomcss.compareAll();
        });

        /*
        Casper runs tests
        */
        casper.run(function() {
            console.log('\nTHE END.');
            // phantomcss.getExitStatus() // pass or fail?
            casper.test.done();
        });
    });
}


function _srSingleFolder(config_info, folder) {
    // get VI lists in one folder
    casper.thenOpen(folder.url, function() {
        casper.waitForSelector(folder_container,
            function success() {
                console.log(folder.name + ": Navigate to this target folder successfully...");
            },
            function timeout() {
                casper.test.fail(folder.name + ": Fail to open this target folder");
            }
        );

        VI_links = casper.evaluate(function(folder_container, dashboard_links) {
            var links = document.querySelectorAll(dashboard_links),
                count = links.length,
                lists = [];
            for (var i = 0; i < count; i++) {
                lists.push(links[i].href);
            }
            return lists;
        }, folder_container, dashboard_links);
    });

    // run dashboards one by one
    casper.then(function() {
        console.log(folder.name + ": Start to run dashboard one by one...");
        casper.eachThen(VI_links, function(viz_link) {
            _runDashboard(viz_link.data, folder.name, folder.waitTime);
        });
    });
}


function _runDashboard(viz_url, folderName, waitTime) {
    var data = _parseURL(viz_url);

    casper.thenOpen(config_info.webserver, {
        method: "post",
        data: data
    }, function() {
        this.echo("Dashboard request has been sent successfully.")
    });

    casper.waitUntilVisible(viz_container,
        function success() {
            var viz_name = (casper.getTitle().split("."))[0];

            casper.waitWhileVisible(mstrWaitBox,
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

                            casper.mouseEvent('click', panelseletor + '[idx="' + j + '"]');

                            casper.waitUntilVisible(panelcontainer + '(' + idx + ')',
                                function success() {

                                    casper.waitWhileVisible(mstrWaitBox,
                                        function success() {
                                            if (waitTime) {
                                                casper.wait(waitTime);
                                            }
                                            console.log("panel_" + idx);
                                            phantomcss.screenshot(panelcontainer + '(' + idx + ')', folderName + "/" + viz_name + "_panel_" + idx);
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
            phantomcss.screenshot('html', viz_name + "_timeout");
            //casper.test.fail('Should see Viz opened');
        }
    );
}

function _parseURL(viz_url) {
    var data = {};
    var paras = viz_url.split("?")[1].split("&");
    var para = "";

    for (var i = 0, len = paras.length; i < len; i++) {
        para = paras[i].split("=");
        data[para[0]] = para[1];
    }

    return data;
}
