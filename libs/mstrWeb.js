// common actions for mstrWeb

exports.generateLoginURL = generateLoginURL;
exports.generateFolderURL = generateFolderURL;

function generateLoginURL(config_info) {
  return config_info.webserver + '?evt=3010&src=mstrWeb.3010&loginReq=true&server=' + config_info.iserver + '&Project=' + config_info.project_name + '&Port=' + config_info.port;
}

function generateFolderURL(config_info, folder_id) {
  return config_info.webserver + '?evt=2001&src=mstrWeb.shared.fbb.fb.2001&server=' + config_info.iserver + '&Project=' + config_info.project_name + '&Port=' + config_info.port + '&folderID=' + folder_id;
}