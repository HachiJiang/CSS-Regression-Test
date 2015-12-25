Use PhantomCSS for CSS regression test

#####File Structure
- libs
- test-reports
- tests

#####Steps to Run it:
1.	Unzip the attachment in you test machine
2.	Open “/tests/userConfig.js” and change parameters, such as i-server, web server, etc. (PS: currently it only support one folder at one time)
```js
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
    waitTimeout: 45000 // if response time > 4500, skip process
};

// config for each folder
var folder_list = [
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
```

3.	Make sure the web server is connected to i-server
4.	Open command window, and run “start.bat”
```
$ start.bat
```

5.	Once testing is done, open the “/test-reports/index.html” to read test results.
 ![Alt text](./xx.png)


Click one of the rows in table, you will see the corresponding screenshots, baseline + output + fail from top to bottom.
