// Require the necessary discord.js classes
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { getEmbedData, deleteEmbedData } from "./globals.js";

dotenv.config();

const token = process.env.TOKEN;
const storeImageLengthMS = process.env.STORE_IMAGE_DATA_MIN * 60_000; // STORE_IMAGE_DATA_MIN is in minutes, convert to MS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Client commands accessor
client.commands = new Collection();

// Dynamically load commands
const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const filePath = join("file:///", commandsPath, file).replace(/\\/g, "/");
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

    if (!command) return;

    try {
      const success = await command.execute(interaction);

      // If txt2img and executed successfully, we will delete the img data after the set time.
      if (success && interaction.commandName === "txt2img") {
		console.log("set to delete in..")
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
