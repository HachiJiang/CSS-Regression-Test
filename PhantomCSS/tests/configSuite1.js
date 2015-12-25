/*
  Configuration for mstr web
*/
exports.configInfoObj = {
    iserver: "VMHTML5VI",
    port: "34952",
    webserver: "http://localhost:8080/MainBranch/servlet/mstrWeb",
    projectName: "MicroStrategy Tutorial",
    username: "administrator",
    password: "",
    testsuite: 'VI_Automation', // output folder name under "output"
    viewsize: {
        width: 1432,
        height: 790
    },
    waitTimeout: 45000 // if response time > 4500, skip process
};

/*
  Senario list: should be placed under folder /tests
*/
exports.scenarioArr = [
    'scenario1.js',    // static rendering
    /*'scenario2.js'*/
];