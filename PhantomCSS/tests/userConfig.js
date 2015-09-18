/*
  Read configurations
  Paths are relative to CasperJs directory
*/

var config_info = {
  iserver: "VMHTML5VI",
  port: "34952",
  webserver: "http://localhost:8080/MicroStrategy/servlet/mstrWeb",
  project_name: "MicroStrategy Tutorial",
  username: "Automation",
  password: "",
  testsuite: 'VI_Automation',
  viewsize: {
    width: 1432,
    height: 790
  },
  waitTimeout: 60000,
  //waitTime: 50 // must > 0
};

var folder_list = [{
  name: 'VI_Acceptance', // output folder name
  id: 'F11CAB7C4B887D887CB5D387D350AD65' // folder id
}];

var fs = require('fs');
var mstrWeb = require('../libs/mstrWeb.js');
var visr = require('../libs/visr.js');

config_info.project_name = config_info.project_name.replace(" ", "+");
config_info.login_url = mstrWeb.generateLoginURL(config_info);

for (var i = 0; i < folder_list.length; i++) {
  folder_list[i].url = mstrWeb.generateFolderURL(config_info, folder_list[i].id);
}

visr.staticRendering(config_info, folder_list);
