import type { Tile } from "../../Tile";
import { constraints } from "../../utils";

export interface WaterSourceStructureParameters {
    speed: number; // 水流数量，每个tick，该水源都会向整个图格内释放这么多的水
}

export class WaterSourceStructure {

    get id() { return 'water-source'; }
    
    speed: any;

    constructor(parameters: WaterSourceStructureParameters) {
        this.speed = parameters.speed;
    }

    tick(tile: Tile) {
        tile.terrain.water = constraints(tile.terrain.water + this.speed, 0, CONFIG.maxWaterLevel - tile.terrain.altitude);
    }
}