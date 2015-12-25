/*
Read test result data and
Generate HTML page for test report
*/
var fs = require('fs');

exports.generateHTML = generateHTML;

/**
 * Generate html file of output report
 * @param  {Array} tests      [description]
 * @param  {Int} noOfFails  [description]
 * @param  {Int} noOfErrors [description]
 * @param  {String} path       [description]
 * @return {[type]}            [description]
 */
function generateHTML(tests, noOfFails, noOfErrors, path) {
    // generate dashboards
    var dashboardHTML = _generateDashboards(tests.length, noOfFails, noOfErrors);

    // generate mismatch list
    var mismatchTable = _generateMismatchTable(tests);

    // generate index.html
    var content = fs.read('./test-reports/files/1.xml');
    content += dashboardHTML.gridHTML;
    content += fs.read('./test-reports/files/2.xml');
    content += mismatchTable.fail_tr;
    content += mismatchTable.error_tr;
    content += fs.read('./test-reports/files/3.xml');
    content += mismatchTable.fail_img_div;
    content += mismatchTable.error_img_div;
    content += fs.read('./test-reports/files/4.xml');

    fs.touch('./test-reports/index.html');
    fs.write('./test-reports/index.html', content, 'w');
}

function _generateDashboards(noOfTests, noOfFails, noOfErrors) {
    var dashboards = {};

    dashboards.gridHTML = '<tr>\n';
    dashboards.gridHTML += '<td class="data-total">' + noOfTests + '</td>\n';
    dashboards.gridHTML += '<td class="data-pass">' + (noOfTests - noOfFails - noOfErrors) + '</td>\n';
    dashboards.gridHTML += '<td class="data-fail">' + noOfFails + '</td>\n';
    dashboards.gridHTML += '<td class="data-nobaseline">' + noOfErrors + '</td>\n';
    dashboards.gridHTML += '</tr>\n';

    return dashboards;
}

function _generateMismatchTable(tests) {

    var table = {
            fail_tr: '',
            fail_img_div: '',
            error_tr: '',
            error_img_div: ''
        },
        m = 0,
        i, il = tests.length,
        tmp, scenario, screenshot;

    for (i = 0; i < il; i++) {
        try {
            tmp = tests[i].filename.split('/').pop().split('\\');
            scenario = tmp[0] + '/' + tmp[1];
            if (tmp[2]) {
                screenshot = '/' + tmp[2].split('.')[0];
            }
        } catch (err) {
            console.log('filename: ' + tests[i].filename);
            console.log('scenario: ' + scenario);
            console.log('screenshot: ' + screenshot);
            console.log('error: ' + err);
        }

        if (tests[i].fail === true) {

            table.fail_tr += '<tr class="tr-mismatch">\n';
            table.fail_tr += '<td>' + (m + 1) + '</td>\n';
            table.fail_tr += '<td>' + scenario + '</td>\n';
            table.fail_tr += '<td>' + screenshot + '</td>\n';
            table.fail_tr += '<td>Fail</td>\n';
            table.fail_tr += '</tr>\n';

            table.fail_img_div += '<div class="item" name="' + screenshot + '">\n';
            table.fail_img_div += '<img src="../baselines/' + scenario + screenshot + '.png" alt="' + screenshot + '.baseline.png">\n';
            table.fail_img_div += '<img src="../output/' + scenario + screenshot + '.png" alt="' + screenshot + '.png">\n';
            table.fail_img_div += '<img src="../failures/' + tmp[0] + screenshot + '.fail.png" alt="' + screenshot + '.fail.png">\n';
            table.fail_img_div += '</div>\n';

        } else if (tests[i].error === true) {

            table.error_tr += '<tr class="tr-mismatch">\n';
            table.error_tr += '<td>' + (m + 1) + '</td>\n';
            table.error_tr += '<td>' + scenario + '</td>\n';
            table.error_tr += '<td>' + screenshot + '</td>\n';
            table.error_tr += '<td>Baseline Not Found</td>\n';
            table.error_tr += '</tr>\n';

            table.error_img_div += '<div class="item" name="' + screenshot + '">\n';
            table.error_img_div += '<img src="../output/' + scenario + screenshot + '.png" alt="' + screenshot + '.png">\n';
            table.error_img_div += '</div>\n';
        }
        m++;
    }

    return table;
}
