const colors = require("colors");

module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "ready";
    }
    async run() {
        const getRandomRichPresence = (size) => [`🎮 | ${size} membros.`, `🤖 | standard`][Math.floor(Math.random() * 2)]
        const updatedRichPresence = () => {
            let msg = getRandomRichPresence(this.client.users.cache.size);

            this.client.user.setActivity(msg, {
                game: {
                    type: 1
                }
            });

        }
        setInterval(updatedRichPresence, 1000 * 10);
        this.client.functions.checkMessages();
        this.client.functions.checkTickets();
        this.client.functions.updateMessages();
        console.log(colors.green(`[${this.client.user.username}] O bot foi inicializado com sucesso!`));
    } catch(error) {
        console.log(error);
    }
}