// Get all the currently loaded models
import { SlashCommandBuilder } from "discord.js";
import { getApiUrl } from "../../globals.js";

// TODO: Dynamically grab loaded models to use as options
const data = new SlashCommandBuilder()
  .setName("changemodels")
  .setDescription(`Change the current model being used.`)
  .addStringOption((option) =>
    option
      .setName("modelname")
      .setDescription("The model name, see /loadedmodels for valid models")
      .setRequired(true)
  );

async function execute(interaction) {
  try {
    // Wait before timeout
    await interaction.deferReply({ fetchReply: true });

    // Get model name
    let modelname = interaction.options.getString("modelname");

    // Get endpoint
    let endpoint = "sdapi/v1/options";

    // Construct payload
    let payload = {
      "sd_model_checkpoint": modelname
    };

    // Send the payload to the API
    await fetch(getApiUrl() + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Send the model names as a reply in the Discord interaction
    await interaction.editReply(`Changed the model to "${modelname}"`);
  } catch (error) {
    console.error(error);
    await interaction.editReply(
      "Failed to load the model. Are you using a valid name?"
    );
  }
}

export default {
  data,
  execute,
};
