import { EmbedBuilder } from "discord.js";

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

export function createEmbedFromResponse(data) {
  // Extract fields
  const info = JSON.parse(data.info);
  const fields = extractFields(info);
  
  // Create embed
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("txt2img")
    .addFields(fields)
    .setTimestamp();

  return embed;
}
