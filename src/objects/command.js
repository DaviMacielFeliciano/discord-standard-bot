module.exports = class Command {
    constructor(client) {
        this.client = client;

        this.name = "Nome";
        this.description = "Sem descrição";
        this.category = "Sem categoria";
        this.aliases = [];

        this.ownerOnly = false;
    }

    async run() {
        try {

        } catch (eror) {
            console.log(error);
        }
    }
};