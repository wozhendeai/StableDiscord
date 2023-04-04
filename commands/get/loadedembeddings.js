// Get all the currently loaded models
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { fetchData } from "../../utils.js";

const data = new SlashCommandBuilder()
  .setName("loadedembeddings")
  .setDescription(
    `Gets all the embeddings currently loaded and ready to be used.`
  );

async function execute(interaction) {
  try {
    // Wait before timeout
    await interaction.deferReply({ fetchReply: true });

    // Get endpoint
    let endpoint = "sdapi/v1/embeddings";

    // Send the payload to the API
    let data = await fetchData(endpoint);

    let fields = Object.entries(data.loaded).map(([modelName, modelInfo]) => ({
        name: modelName,
        value: `Step: ${modelInfo.step}, Shape: ${modelInfo.shape}, Vectors: ${modelInfo.vectors}`,
        inline: true,
      }));
  
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Loaded Embeddings")
      .addFields(fields)
      .setTimestamp();

    // Send the model names as a reply in the Discord interaction
    await interaction.editReply({
      embeds: [embed],
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
