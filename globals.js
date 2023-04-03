import { sanitizeUrl } from "./utils.js";

let apiUrl = "https://residents-attempted-jewish-zones.trycloudflare.com/";
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

export function setApiUrl(url) {
  apiUrl = sanitizeUrl(url);
}

export function getApiUrl() {
  return apiUrl;
}
