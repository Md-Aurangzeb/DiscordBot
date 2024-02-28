const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10")
const fs= require("fs");

module.exports = (client)=>{
    client.handleCommands = async()=>{
        const commandFolders = fs.readdirSync('./src/commands');
        for(const folder of commandFolders){
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file=>file.endsWith(".js"));
            const { commands, commandArray } = client;
            for(const file of commandFiles){
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`command: ${command.data.name} has passed through the handler.`);
            }
        }
        const clientId = "1211840904864866386";
        const guildId = "1211843527701700609";
        const rest = new REST({version:10}).setToken(process.env.TOKEN);

        try {
            console.log("Started refreshing application (/) commands.");
            
            await rest.put(Routes.applicationGuildCommands(clientId, guildId),{
                body : client.commandArray,
            });
        } catch (error) {
            console.log(error);
        }
    };
};