const START_LINE = "2";
const END_LINE = "99";
const ROW_PACKAGE_NAME = "E";
const ROW_VERSION = "F";

/**
 * Iterate on each package and update the latest version
 */
function updateLatestVersionsOfPackages() {
  iterateAndUpdateLatestVersion("Using");
  iterateAndUpdateLatestVersion("InterestedIn");
}

function iterateAndUpdateLatestVersion(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

  for (let i = START_LINE; i <= END_LINE; i++) {
    const packageName = sheet.getRange(`${ROW_PACKAGE_NAME}${i}`).getValue();

    if (packageName) {
      console.log(`Update version of ${packageName}`);
      const url = `https://registry.npmjs.org/${packageName}/latest`;
      const response = UrlFetchApp.fetch(url, { method: "GET" });
      const { version } = JSON.parse(response);
      sheet.getRange(`${ROW_VERSION}${i}`).setValue(version);
    }
  }
}

function refresh() {
  updateLatestVersionsOfPackages();
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Actions").addItem("Refresh", "refresh").addToUi();
}

function exportToJSONBySheetname(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const values = sheet.getRange("2:99").getValues();

  const result = [];
  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    if (element[0]) {
      result.push({
        name: element[0],
        description: element[1],
        link: element[2],
        newsLink: element[3],
        npmPackage: element[4],
        latestVersion: element[5],
        latestCheckedVersion: element[6],
        sheet: sheetName,
      });
    }
  }

  return result;
}

/**
 * Handle GET request to fetch data (cell content)
 */
function doGet() {
  const usingData = exportToJSONBySheetname("Using");
  const interestedInData = exportToJSONBySheetname("InterestedIn");
  const result = [...usingData, ...interestedInData];

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Function to create a new line
 */
function doPost(event) {
  const jsonData = JSON.parse(event.postData.getDataAsString());
  const sheetName = jsonData.sheet;
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  sheet.appendRow([
    jsonData.name,
    jsonData.description,
    jsonData.link,
    jsonData.newsLink,
    jsonData.npmPackage,
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ result: "success" })
  ).setMimeType(ContentService.MimeType.JSON);
}
