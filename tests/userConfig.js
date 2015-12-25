/*
  Read configurations
  Paths are relative to CasperJs directory
*/

var config_info = {
    iserver: "VMHTML5VI",
    port: "34952",
    webserver: "http://localhost:8080/MainBranch/servlet/mstrWeb",
    project_name: "MicroStrategy Tutorial",
    username: "administrator",
    password: "",
    testsuite: 'VI_Automation', // output folder name under "output"
    viewsize: {
        width: 1432,
        height: 790
    },
    waitTimeout: 45000 // if response time > 4500, skip process
};

// config for each folder
var folderObj_list = [
    {
      name: 'VI_Acceptance', // output folder name under testsuite folder
      id: 'F11CAB7C4B887D887CB5D387D350AD65' // folder id
    },
    {
      name: 'PreCheckin_GM_HM_NV',
      id: '1CB4E5A34B36FB69DBF7EA9FF951A686',
    },
    {
      name: 'PreCheckin_3rdParty_map_imagelayout',
      id: '708146F2491EF8AD022F65948E705425',
      waitTime: 60000 // must > 0, if you needn't add extra waiting time after waitbox disappears, just remove this prop
    }
];

/* execute scenarios */
var fs = require('fs'),
    mstrWeb = require('../libs/mstrWeb.js'),
    visr = require('../libs/visr.js'),
    i, il;

config_info.project_name = config_info.project_name.replace(" ", "+");
config_info.login_url = mstrWeb.generateLoginURL(config_info);

for (i = 0, il = folderObj_list.length; i < il; i++) {
    folderObj_list[i].url = mstrWeb.generateFolderURL(config_info, folderObj_list[i].id);
}

visr.staticRendering(config_info, folderObj_list);