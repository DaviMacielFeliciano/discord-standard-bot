const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("./config/config.json");
const connectToDatabase = require("./database/index.js");
const Functions = require("./objects/functions.js");


class TicketSystemClient extends Client {
    constructor(options) {
        super(options)
        this.commands = new Collection();
        this.aliases = new Collection();
        this.database = new Collection();
        this.config = config;
        this.database = [];
    }

    start() {
        this.login(this.config.token);
        connectToDatabase.connect()
        this.loadCommands();
        this.loadEvents();
    }

    loadCommands() {
        let startedAt = performance.now();
        let commandsCount = 0;
        const commands = readdirSync("./src/commands/").filter(file => file.endsWith(".js"));
        commands.forEach(command => {
            try {
                const props = new (require(`./commands/${command}`))(this);
                props.location = `./commands/`;
                if (props.init) {
                    props.init(this);
                }
                this.commands.set(props.name, props);
                props.aliases.forEach(aliase => {
                    this.aliases.set(aliase, props.name);
                });
                commandsCount++;
            } catch (error) {
                console.log(error);
                console.log(`\x1b[91m[Commands] Ocorreu um erro ao carregar o comando ${command} \x1b[0m`);
            }
        })
        let finishedAt = performance.now();
        let time = (parseFloat(finishedAt - startedAt).toFixed(2)).replace(".00", "");
        console.log(`\x1b[32m✔ [Commands] Foram carregados ${commandsCount} comandos em ${time}ms\x1b[0m`);
    }

    loadEvents() {
        let startedAt = performance.now();
        let eventsCount = 0;
        const events = readdirSync(`./src/events/`).filter(file => file.endsWith('.js'));
        events.forEach(async eventFile => {
            try {
                const event = new (require(`./events/${eventFile}`))(this);
                this.on(event.eventName, (...args) => event.run(...args));
                eventsCount++;
            } catch (error) {
                console.error(error);
                console.log(`\x1b[91m[Events] Ocorreu um erro ao carregar o evento ${eventFile} \x1b[0m`);
            }
        });
        let finishedAt = performance.now();
        let time = (parseFloat(finishedAt - startedAt).toFixed(2)).replace(".00", "");
        console.log(`\x1b[32m✔ [Events] Foram carregados ${eventsCount} eventos em ${time}ms\x1b[0m`);
    }
}

const TicketSystem = new TicketSystemClient({
    intents: 32767,
    partials: ["CHANNEL"]
});

process.on('multipleResolves', (type, reason, promise) => {
    console.log(`Foi detectado um erro, mais informações abaixo:\n\n` + type, promise, reason)
});
process.on('unhandRejection', (reason, promise) => {
    console.log(`Foi detectado um erro, mais informações abaixo:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
    console.log(`Foi detectado um erro, mais informações abaixo:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`Foi detectado um erro, mais informações abaixo:\n\n` + error, origin)
});

TicketSystem.start();
