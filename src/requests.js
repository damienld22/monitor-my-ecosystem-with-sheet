import axios from "axios";

const URL_API =
  "https://script.google.com/macros/s/AKfycbzbA25F1v8kXwhr0IxsYD1FjRJRSp1bfECXsEvIDZSU5x_GSXsssq0J5XJ7oY0xbPbIgw/exec";

export async function getAllData() {
  try {
    const { data } = await axios.get(URL_API);
    return data;
  } catch (err) {
    console.error("Failed to fetch data", err);
    return [];
  }
}

export async function createNewItem(element) {
  const versionOfPackage = await getVersionOfPackage(element.npmPackage);
  const updatedItem = { ...element, latestVersion: versionOfPackage };
  await fetch(
    new Request(URL_API, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(updatedItem),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  return updatedItem;
}

export async function getVersionOfPackage(packageName) {
  const url = `https://registry.npmjs.org/${packageName}/latest`;
  const { data } = await axios.get(url);
  return data.version;
}

export async function indicateUpToDate(element) {
  const updatedItem = {
    ...element,
    latestCheckedVersion: element.latestVersion,
  };

  await fetch(
    new Request(`${URL_API}?check_element=true`, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ name: element.name, sheet: element.sheet }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  return updatedItem;
}
