import type { Game } from "../../Game";
import type { GameGenerator } from "../../TerrainGenerator";
import type { Tile } from "../../Tile";
import { rand, randInt, randOne, randOnes } from "../../utils";
import { CityStructure } from "../structures/CityStructure";
import { RocketStructure } from "../structures/RocketStructure";
import { WaterSourceStructure } from "../structures/WaterStructure";

export interface SimpleRandomStructureGeneratorParameters {
    maxWaterLevel: number;
    initWaterSourceCount: number;
    initCityCount: number;
    // waterSourceGenBelow: number;
    // cityGenAbove: number;
}

export class SimpleRandomStructureGenerator implements GameGenerator {

    private parameters: SimpleRandomStructureGeneratorParameters;
    constructor(parameters: SimpleRandomStructureGeneratorParameters) {
        this.parameters = parameters;
    }

    private grid: number[][];

    generate(game: Game): void {
        const { maxWaterLevel, initWaterSourceCount, initCityCount } = this.parameters;

        // 在低地势生成水源
        randOnes(game.tiles.filter(t => t.terrain.altitude < 0.25 * maxWaterLevel), initWaterSourceCount)
            .forEach(t => t.structure = new WaterSourceStructure({ speed: 0.3 }));

        // 在最高地生成火箭
        const tilesDescent = game.tiles.slice().sort((a, b) => a.terrain.altitude - b.terrain.altitude).reverse();
        const rocketTile = randOne(tilesDescent.filter(t => t.terrain.altitude >= tilesDescent[0].terrain.altitude && !t.structure));
        rocketTile.structure = new RocketStructure({ targetEnergy: 5000, energy: 0, ruined: false });

        // 在中上地势生成城市
        const cityTiles: Tile[] = randOnes(game.tiles.filter((t: Tile) => t.terrain.altitude > 0.5 * maxWaterLevel && !t.structure), initCityCount);
        cityTiles.forEach(t => t.structure = new CityStructure({
            genEnergyPerTick: rand(2, 5),
            transportSpeed: rand(0.1, 0.2),
            transportPeriodTick: randInt(12, 18),
            transportEnergy: randInt(20, 30),
            activeValve: randInt(600, 1000),
            maxEnergy: randInt(4000, 8000),
            energy: 0,
            active: false,
            ruined: false,
        }));
        randOnes(cityTiles, 1).forEach(t => (t.structure as CityStructure).active = true);
    }
}