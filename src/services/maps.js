const mapNames = ["bioplant"];

export default class MapsService {
    static async getMaps() {
        const maps = [];
        for (const name of mapNames) {
            const map = require(`../maps/${name}.json`);

            maps.push(map);
        }

        return maps;
    }
}
