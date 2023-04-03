# Features
* txt2img (/txt2img)
* img2img (/img2img)
* Change loaded model (/changemodel)
* Get loaded models (/loadedmodels)
* Get loaded embeddings (/loadedembeddings)
* Dynamic API, set to whatever AUTOMATIC Web UI url you want. (/setapi)
* Image info/data retrieval 

# Planned Features
* ControlNet support
* Add image upscaler for before & after generation
* (?) Add image regeneration
* (?) Load samplers, models dynamically into choices
* (?) Add multiple webui API support
* (?) Make a better way of returning image data, currently it truncates values of >1024 characters due to discord embed limits

# Stable Diffusion WEBUI Discord Bot
- Built ontop of AUTOMATIC-1111 Web-UI & its API

# Installation/Setup
1. Clone this repo
2. npm install
3. Create a .env file with the following parameters
|Variable name|Type|Information|
|TOKEN|string|discord auth token|
|CLIENT_ID|string|discord bot client id|
|GUILD_ID|string|discord server guild id|
|STORE_IMAGE_DATA_MIN|number (minutes)|how long you want to store image data in memory|
[If you don't know what to put here, click this](https://discordjs.guide/creating-your-bot/)
4. npm start

# Notes
- Image generation data is removed from memory after a set amount of time. 
