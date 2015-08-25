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
  waitTimeout: 60000
};

var folder_list = [{
  name: 'VI_Acceptance',
  id: 'F11CAB7C4B887D887CB5D387D350AD65'
}, /*{
  name: 'VI_timeout2',
  id: '5C420FD8428E3B47F1A864B9B30E90AA'
}, {
  name: 'VI_timeout',
  id: 'FE9B5273443E0CC4FAA6929AF553EAC3'
}, {
  name: 'VI_Map',
  id: '1117A6864D99F5BFF7C8FF88CA149F44'
}, {
  name: 'VI_Blank',
  id: '1CD124FD454126F25EF3F38CDCEF82AE'
}, {
  name: 'HM_Acceptance',
  id: 'BFA755F942C5351D337750959B763DBE'
}, {
  name: 'NV_Acceptance',
  id: 'EA51C48C48C18DCD2A16959B625D107A'
}, {
  name: 'GM_Accep
  id: 'F005D3F24142674ED7459C8084E38118'
}, {
  name: 'ImageLayout_Acceptance',
  id: '4BC5EBC54786977EF74CAD81B2B94488'
}*/];

var fs = require('fs');
var mstrWeb = require('../libs/mstrWeb.js');
var visr = require('../libs/visr.js');

config_info.project_name = config_info.project_name.replace(" ", "+");
config_info.login_url = mstrWeb.generateLoginURL(config_info);

for (var i = 0; i < folder_list.length; i++) {
  folder_list[i].url = mstrWeb.generateFolderURL(config_info, folder_list[i].id);
}

visr.staticRendering(config_info, folder_list);
