/*
  common actions for mstrWeb
*/

var selectorEnum = require('../libs/selectorConsts.js').Enum;

exports.generateFolderURL = generateFolderURL;
exports.login = login;

// generate url of target folder by id
function generateFolderURL(configInfoObj, folderId) {
    return configInfoObj.webserver + '?evt=2001&src=mstrWeb.shared.fbb.fb.2001&server=' + configInfoObj.iserver + '&Project=' + _projectName(configInfoObj.projectName) + '&Port=' + configInfoObj.port + '&folderID=' + folderId;
}

/**
 * login to mstr web
 * @param  {String} url      url of login page
 * @param  {String} username [description]
 * @param  {String} password      [description]
 * @return null
 */
function login(configInfoObj) {
    var url = _generateLoginURL(configInfoObj);
    casper.thenOpen(url, function() {
        // wait for login container to appear 
        casper.waitForSelector(selectorEnum.LOGINCONTAINER,
            function success() {
                casper.evaluate(function(username, password, selectorEnum) {
                    document.querySelector(selectorEnum.LOGINUSRINPUT).value = username;
                    document.querySelector(selectorEnum.LOGINPWDINPUT).value = password;
                    document.querySelector(selectorEnum.LOGINSUBMIT).click();
                }, configInfoObj.username, configInfoObj.password, selectorEnum);
                console.log("Login success...");
            },
            function timeout() {
                casper.waitForSelector('#mstrPathAccount',
                    function success() {
                        console.log("Already logined in...");
                    },
                    function timeout() {
                        casper.test.fail('Should see Login container');
                    });
            }
        );
    });
}

// generate url of login page
function _generateLoginURL(configInfoObj) {
    return configInfoObj.webserver + '?evt=3010&src=mstrWeb.3010&loginReq=true&server=' + configInfoObj.iserver + '&Project=' + _projectName(configInfoObj.projectName) + '&Port=' + configInfoObj.port;
}

// convert project name
function _projectName(projectName) {
    return projectName.replace(" ", "+");
}
