import { REST, Routes } from "discord.js";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getFiles } from "./utils.js";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];

// Grab all the command files from the commands directory
const commandsPath = join(__dirname, "commands");
const commandFiles = getFiles(commandsPath, ".js");

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const filePath = join("file:///", file).replace(/\\/g, "/");
  const { default: command } = await import(filePath);
  const { data } = command;
  commands.push(data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// Deploy commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // Make sure we catch and log any errors
    console.error(error);
  }
})();
