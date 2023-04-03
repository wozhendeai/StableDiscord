# Features
* txt2img (/txt2img)
* img2img (/img2img)
* Change loaded model (/changemodel)
* Get loaded models (/loadedmodels)
* Get loaded embeddings (/loadedembeddings)
* Dynamic API, set to whatever AUTOMATIC Web UI url you want. (/setapi)
* Image info/data retrieval 

# Planned Features
* ControlNet
* Possibly add image regeneration
* Add image upscaler after generated
* Load samplers, models dynamically into choices
* (?) Add multiple web-ui API support
* (?) Make a better way of returning image data, currently it truncates values of >1024 characters due to embed limits

# Stable Diffusion WEBUI Discord Bot
- Built ontop of AUTOMATIC-1111 Web-UI & its API

# Installation/Setup
1. Clone this repo
2. npm install
3. Create a .env file with the following parameters
TOKEN="token-here"
CLIENT_ID="clientid"
GUILD_ID="guildid"
STORE_IMAGE_DATA_MIN=5
[If you don't know what to put here, click this](https://discordjs.guide/creating-your-bot/)
3. npm start

Alternatively, invite this bot to your server. Not sure how to set this up myself yet. Probably wont, since I don't want to run this bot for you (unless you pay me).

# Notes
- Image generation data is removed from memory after a set amount of time. 
