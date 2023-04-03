import { SlashCommandBuilder } from "discord.js";
import { getApiUrl } from "../../globals.js";

const data = new SlashCommandBuilder()
  .setName("getapi")
  .setDescription(`Gets the current API url being used.`);

async function execute(interaction) {
    // Get the url arg
    let url = getApiUrl();
    if(!url) {
      await interaction.reply("No url has been set. Please use /setapi to set one.");
      return;
    }
    await interaction.reply(`Current url being used: ${url}`);
}

export default {
  data,
  execute,
};
