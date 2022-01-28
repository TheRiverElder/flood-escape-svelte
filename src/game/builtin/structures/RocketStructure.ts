import type { Tile } from "../../Tile";
import { constraints } from "../../utils";

export interface RocketStructureParameters {
    targetEnergy: number; // 目标能量数量，当达到这个数量，火箭起飞，游戏胜利
    energy: number; // 当前能量
    ruined: boolean; // 是否已经被摧毁，若被摧毁，则游戏直接失败
}


export class RocketStructure {

    get id() { return 'rocket'; }
    
    targetEnergy: number;
    energy: number;
    ruined: boolean;

    constructor(parameters: RocketStructureParameters) {
        this.targetEnergy = parameters.targetEnergy;
        this.energy = parameters.energy;
        this.ruined = parameters.ruined;
    }

    changeEnergy(deltaEnergy: number) {
        this.energy = constraints(this.energy + deltaEnergy, 0, this.targetEnergy);
    }

    tick(tile: Tile) {
        if (tile.terrain.water > 0) {
            this.ruined = true;
        }

        if (this.ruined) {
            tile.game.status = 'failed';
            window.alert("Rocket is ruined, YOU LOSE!");
        } else if (this.energy >= this.targetEnergy) {
            tile.game.status = 'succeed';
            window.alert("Rocket launched, YOU WIN!");
        }
    }
}