// Get all the currently loaded models
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { fetchData } from "../../utils.js";

const data = new SlashCommandBuilder()
  .setName("loadedmodels")
  .setDescription(`Gets all the models currently loaded and ready to be used.`)
  .addStringOption((option) =>
    option
      .setName("include-controlnet")
      .setDescription("Include ControlNet models in output")
  );

async function execute(interaction) {
  // Get values from command, set default values if options are not entered
  let includeControlNetModels =
    interaction.options.getString("include-controlnet") || false;

  try {
    // Wait before timeout
    await interaction.deferReply({ fetchReply: true, ephemeral: true });

    // Get endpoint
    let endpoint = "sdapi/v1/sd-models";
    let endpoint2 = "controlnet/model_list";

    // Fetch data from both endpoints
    let data1 = await fetchData(endpoint);

    // Extract the model names
    let fields = data1.map((model) => ({
      name: "Model",
      value: model.model_name,
      inline: true,
    }));

    // Append controlnet models to the fields
    if (includeControlNetModels) {
      let data2 = await fetchData(endpoint2);
      fields = fields.concat(
        data2.model_list.map((model) => ({
          name: "Controlnet Model",
          value: model.toString().split("[")[0],
          inline: true,
        }))
      );
    }
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("txt2img")
      .addFields(fields)
      .setTimestamp();

    // Send the model names as a reply in the Discord interaction
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply(
      "Failed to fetch loaded models. Please try again later."
    );
  }
}

export default {
  data,
  execute,
};
