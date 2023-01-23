const START_LINE = '2';
const END_LINE = '99';
const ROW_PACKAGE_NAME = 'E';
const ROW_VERSION = 'F';
const ROW_CHECKED_VERSION = 'G';

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Actions')
      .addItem('Refresh', 'refresh')
      .addToUi();
}

function refresh() {
  iterateAndUpdateLatestVersion('Sheet');
}

/**
 * Iterate on each line, fetch npm package version and update it
 */
function iterateAndUpdateLatestVersion(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

  for (let i = START_LINE; i <= END_LINE; i++) {
    const packageName = sheet.getRange(`${ROW_PACKAGE_NAME}${i}`).getValue();

    if (packageName) {
      console.log(`Update version of ${packageName}`)
      const url = `https://registry.npmjs.org/${packageName}/latest`;
      const response = UrlFetchApp.fetch(url, { method: 'GET'});
      const { version } = JSON.parse(response);
      sheet.getRange(`${ROW_VERSION}${i}`).setNumberFormat('@');
      sheet.getRange(`${ROW_VERSION}${i}`).setValue(version);
    }
  }
}

/**
 * Handle GET request to fetch data (cell content) 
 */
function doGet() {
  const result = exportToJSONBySheetname('Sheet');
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function exportToJSONBySheetname(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const values = sheet.getRange('2:99').getValues();

  const result = [];
  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    if (element[0]) {
      result.push({
        name: element[0],
        category: element[1],
        link: element[2],
        newsLink: element[3],
        npmPackage: element[4],
        latestVersion: element[5],
        latestCheckedVersion: element[6],
        sheet: sheetName
      })
    }
  }

  return result;
}


/**
 * Function to create a new line or to indicate element checked
 * Is "check_element" is in query parameter, we update the element
 * Otherwise, we add a new element
 */
function doPost(event) {
  const jsonData = JSON.parse(event.postData.getDataAsString());
  const sheetName = jsonData.sheet;
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  
  if (event.queryString.includes('check_element')) {
    const column = sheet.getRange("A:A").getValues();
    let foundIndex;
    for (let i = 0; i < column.length; i++){
      if (column[i][0] === jsonData.name) {
        foundIndex = i;
        break;
      }
    }

    if (!foundIndex) {
      return ContentService.createTextOutput(JSON.stringify({ "result": "failed found element"})).setMimeType(ContentService.MimeType.JSON);
    } else {
      const currentVersion = sheet.getRange(`${ROW_VERSION}${foundIndex + 1}`).getValue();
      sheet.getRange(`${ROW_CHECKED_VERSION}${foundIndex + 1}`).setNumberFormat('@');
      sheet.getRange(`${ROW_CHECKED_VERSION}${foundIndex + 1}`).setValue(currentVersion.toString());
    }
  } else {
    const newLine = getFirstEmptyRowByColumnArray(sheet);
    sheet.getRange(`A${newLine}`).setValue(jsonData.name);
    sheet.getRange(`B${newLine}`).setValue(jsonData.category);
    sheet.getRange(`C${newLine}`).setValue(jsonData.link);
    sheet.getRange(`D${newLine}`).setValue(jsonData.newsLink);
    sheet.getRange(`E${newLine}`).setValue(jsonData.npmPackage);
    sheet.getRange(`F${newLine}`).setNumberFormat("@");
    sheet.getRange(`F${newLine}`).setValue(jsonData.latestVersion.toString());
  }

  return ContentService.createTextOutput(JSON.stringify({ "result": "success"})).setMimeType(ContentService.MimeType.JSON);
}

function getFirstEmptyRowByColumnArray(sheet) {
  const column = sheet.getRange('A:A');
  const values = column.getValues(); // get all data in one call
  let ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}
