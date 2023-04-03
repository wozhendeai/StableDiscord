// Imports
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { getEmbedData, deleteEmbedData } from "./globals.js";
import { getFiles } from "./utils.js";

// Configuration
dotenv.config();
const token = process.env.TOKEN;
const storeImageLengthMS = process.env.STORE_IMAGE_DATA_MIN * 60_000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands
const commandsPath = join(__dirname, "commands");
const commandFiles = getFiles(commandsPath, ".js"); // Use the getFiles function from utils.js

for (const file of commandFiles) {
  const filePath = join("file:///", file).replace(/\\/g, "/");

  import(filePath)
    .then((commandModule) => {
      const command = commandModule.default;
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    })
    .catch((error) => {
      console.log(`[ERROR] Failed to load command at ${filePath}: ${error}`);
    });
}

client.once(Events.ClientReady, () => {
  console.log("Started");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    console.log(command)
    if (!command) return;

    try {
      const success = await command.execute(interaction);

      // If txt2img and executed successfully, we will delete the img data after the set time.
      if (
        success &&
        (interaction.commandName === "txt2img" ||
          interaction.commandName === "img2img")
      ) {
        setTimeout(() => {
          deleteEmbedData("get_image_generation_data:" + interaction.id);
        }, storeImageLengthMS);
      }
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isButton()) {
    // console.log(interaction.customId);
    const [action, embedDataKey] = interaction.customId.split(/:(.+)/);

    if (action === "get_image_generation_data") {
      const embedData = getEmbedData(embedDataKey);
      if (embedData) {
        await interaction.reply({
          embeds: [embedData],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "The requested image generation data is no longer available.",
          ephemeral: true,
        });
      }
    }
  }
});

client.login(token);
