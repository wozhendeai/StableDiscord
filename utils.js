import { EmbedBuilder } from "discord.js";
import axios from "axios";

// Ensure a valid url. Use queryCheck=false when sanitizing image urls.
// TODO: Proper error handling
export function sanitizeUrl(url, queryCheck = true) {
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
    if (queryCheck)
      if (pathname !== "/" || search !== "") {
        return;
      }

    // Construct and return the sanitized URL
    return parsedUrl.toString();
  } catch (error) {
    return;
  }
}

// Prevents string from going over maxLength characters
export function truncate(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}

// Extracts fields from /sdapi/txt2img response
function extractFields(info) {
  const fields = Object.entries(info)
    .filter(([key, value]) => {
      // Don't include anything the bot is not going to use. User can assume default values
      const excludedKeys = [
        "all_negative_prompts",
        "all_prompts",
        "seed",
        "all_subseeds",
        "subseed",
        "extra_generation_params",
        "infotexts",
        "styles",
        "clip_skip",
        "seed_resize_from_w",
        "index_of_first_image",
        "job_timestamp",
        "is_using_inpainting_conditioning",
        "seed_resize_from_h",
        "restore_faces",
      ];

      // Exclude any empty strings or 0 values.
      return (
        !excludedKeys.includes(key) &&
        value !== null &&
        value !== "" &&
        value !== 0
      );
    })
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: truncate(value.toString(), 1024), // Discord max embed length is 1024
      inline: true,
    }));
  return fields;
}

// Create embed from a response
export function createEmbedFromResponse(data, title) {
  // Extract fields
  const info = JSON.parse(data.info);
  const fields = extractFields(info);

  // Create embed
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .addFields(fields)
    .setTimestamp();

  return embed;
}

// Get base64 encoding from a url
export async function getBase64EncodedImageData(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");
    const base64EncodedData = buffer.toString("base64");

    return base64EncodedData;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}
