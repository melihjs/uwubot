const Discord = require("discord.js");
const client = new Discord.Client();
const database = require("quick.db");
const { readdirSync } = require("fs");
const conf = require("./botconfig/config.json");
require("./modules/eventLoader.js")(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = conf;
client.logger = console;

client.on("ready", () => {
    client.logger.log(`[BOT]: Logged in as ${client.user.tag}`)
    client.user.setPresence({ 
        activity: { 
            name: `${client.guilds.cache.array().length} servers!`, 
            type: "PLAYING"
        }, 
        status: "online"
    });
});

readdirSync('./commands/').forEach(async (dir) => {
    let files = readdirSync(`./commands/${dir}`);
    for (let file of files) {
        let cmd = require(`./commands/${dir}/${file}`);
        client.commands.set(cmd.config.name, cmd);
        cmd.help.aliases.forEach(async (alias) => {
            client.aliases.set(alias, cmd.config.name);
        });
    };
});

client.on("message", async (message) => {
    let miktar = "1";
    database.add(`msgcount.${message.guild.id}_${message.author.id}`, miktar)
});

client.on("message", async (message) => {
  if(message.content == "uwu") {
    message.channel.send(`:no_entry_sign: **${message.author.username}**, use the __uwu help__ command!`)
  };
});

client.on("message", async (message) => {
  if(message.content == `<@${client.user.id}>`) {
    message.channel.send(`:no_entry_sign: **${message.author.username}**, use the __uwu help__ command!`)
  };
});

client.on("message", async (message) => {
  if(message.content == `<@!${client.user.id}>`) {
    message.channel.send(`:no_entry_sign: **${message.author.username}**, use the __uwu help__ command!`)
  };
});

client.on("messageDelete", message => {
  const data = require("quick.db");
  data.set(`snipe.mesaj.${message.guild.id}`, message.content);
  data.set(`snipe.id.${message.guild.id}`, message.author.id);
});

client.on("message", message => {
  const db = require("quick.db");
  let mesajsayi = db.fetch(`msgcount.${message.guild.id}_${message.author.id}`);
    if(mesajsayi == "500") {
    db.add(`usermoney.${message.author.id}`, 50)
    message.channel.send(`:sparkles: **| ${message.author.username}**, congratulations you have reached 500 messages on this server and deserved 50 uwu money.`);
  };
  if(mesajsayi == "1000") {
    db.add(`usermoney.${message.author.id}`, 100)
    message.channel.send(`:sparkles: **| ${message.author.username}**, congratulations you have reached 1000 messages on this server and deserved 100 uwu money.`);
  };
    if(mesajsayi == "2000") {
    db.add(`usermoney.${message.author.id}`, 250)
    message.channel.send(`:sparkles: **| ${message.author.username}**, congratulations you have reached 2000 messages on this server and deserved 250 uwu money.`);
  };
    if(mesajsayi == "3000") {
    db.add(`usermoney.${message.author.id}`, 400)
    message.channel.send(`:sparkles: **| ${message.author.username}**, congratulations you have reached 3000 messages on this server and deserved 400 uwu money.`);
  };
});

client.on("guildCreate", async (guild, message, role, member) => {
    database.set(`premiume.${guild.id}`, false);
    client.logger.log(`✅ | ${guild.name} (${guild.id}) named server's premium is de-active.`)
});

client.login(conf.token).catch(() => { client.logger.log('bruh token is invalid') });
