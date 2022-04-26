const Command = require("../objects/Command");

module.exports = class Eval extends Command {
    constructor(client) {
        super(client);
        this.client = client;

        this.name = "eval";
        this.description = "Executa um código especificado em JavaScript.";
        this.category = "Desenvolvimento";
        this.aliases = [];

        this.ownerOnly = false;
    }

    async run({ message, args, prefix }) {

        function clean(text) {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        if (!args[0]) {
            message.reply({ content: `O uso correto do comando é &eval \`código\`.` })
            return;
        }

        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
        } catch (err) {
            message.reply(`\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
};