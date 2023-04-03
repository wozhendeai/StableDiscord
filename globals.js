let apiUrl = "https://eating-event-coach-fashion.trycloudflare.com/";
let embedsData = new Map();

export function storeEmbedData(key, data) {
  embedsData.set(key, data);
}

export function getEmbedData(key) {
  return embedsData.get(key);
}

export function deleteEmbedData(key) {
  embedsData.delete(key);
}

// TODO: Move to a utils file
export function sanitizeUrl(url) {
  try {
    // Try adding https:// to the beginning of the URL if it doesn't have a protocol
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Parse the URL to get the domain name and top-level domain
    const parsedUrl = new URL(url);
    const { hostname, pathname, search } = parsedUrl;

    // Validate the URL using regex
    const urlRegex =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (!urlRegex.test(parsedUrl.origin)) {
      return;
    }

    const [domain, tld] = hostname.split(".").slice(-2);

    if (!domain || !tld) {
      return;
    }

    // Ensure that there is no query parameters in the given URL
    if (pathname !== "/" || search !== "") {
      return;
    }

    // Construct and return the sanitized URL
    return parsedUrl.toString();
  } catch (error) {
    return;
  }
}

export function setApiUrl(url) {
  apiUrl = sanitizeUrl(url);
}

export function getApiUrl() {
  return apiUrl;
}
