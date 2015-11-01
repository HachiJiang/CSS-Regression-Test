/*
  Read configurations
  Paths are relative to CasperJs directory
*/

var config_info = {
    iserver: "VMHTML5VI",
    port: "34952",
    webserver: "http://localhost:8080/MicroStrategy/servlet/mstrWeb",
    project_name: "MicroStrategy Tutorial",
    username: "administrator",
    password: "",
    testsuite: 'VI_Automation', // output folder name under "output"
    viewsize: {
        width: 1432,
        height: 790
    },
    waitTimeout: 60000 // if response time > 60000, kill process
};

// config for each folder
var folder_list = [
    {
      name: 'VI_Acceptance', // output folder name under testsuite folder
      id: 'F11CAB7C4B887D887CB5D387D350AD65' // folder id
    },
    {
      name: 'VIZ_PreCheckin',
      id: '2F3C710F460CA8956860129BFC0000C2',
      waitTime: 60000 // must > 0, if you needn't add extra waiting time after waitbox disappears, just remove this prop
    }
];

var fs = require('fs'),
    mstrWeb = require('../libs/mstrWeb.js'),
    visr = require('../libs/visr.js'),
    i, il;

config_info.project_name = config_info.project_name.replace(" ", "+");
config_info.login_url = mstrWeb.generateLoginURL(config_info);

for (i = 0, il = folder_list.length; i < il; i++) {
    folder_list[i].url = mstrWeb.generateFolderURL(config_info, folder_list[i].id);
}

visr.staticRendering(config_info, folder_list);
