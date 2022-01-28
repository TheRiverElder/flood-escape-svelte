import type { Tile } from "../../Tile";
import { constraints, distance } from "../../utils";

export interface CityStructureParameters {
    genEnergyPerTick: any; // 每个tick所生产的能量，只有已经激活且没被毁坏的城市才会产生能量，
    transportSpeed: any; // 能量转运速度
    transportPeriodTick: any; // 能量转运周期，即几个tick向外发送一次能量
    transportEnergy: any; // 转运能量数量，即一次向外发送多少能量（总和，而不是每路）
    activeValve: any; // 激活阈值，没有激活的城市要接收能量，并到达到整个阈值才能继续
    maxEnergy: any; // 最大能量，所有超过整个数值的能量都会被抛弃
    energy: number; // 现存能量，最大不超过最大能量阈值
    active: boolean; // 是否已经激活
    ruined: boolean; // 是否已经被毁坏，目前只有被水淹没会导致毁坏
}

// export const DEFAULT_CITY_STRUCTURE_PARAMETERS = {

// };

export class CityStructure {
    
    get id() { return 'city'; }

    genEnergyPerTick: any;
    transportSpeed: any;
    transportPeriodTick: any;
    transportEnergy: any;
    activeValve: any;
    maxEnergy: any;
    energy: number;
    active: boolean;
    ruined: boolean;

    transportationLines: any[];

    constructor(parameters: CityStructureParameters) {
        this.genEnergyPerTick = parameters.genEnergyPerTick;
        this.transportSpeed = parameters.transportSpeed;
        this.transportPeriodTick = parameters.transportPeriodTick;
        this.transportEnergy = parameters.transportEnergy;
        this.activeValve = parameters.activeValve;
        this.maxEnergy = parameters.maxEnergy;
        this.energy = parameters.energy;
        this.active = parameters.active;
        this.ruined = parameters.ruined;

        this.transportationLines = [];
    }

    changeEnergy(deltaEnergy) {
        this.energy = constraints(this.energy + deltaEnergy, 0, this.maxEnergy);
    }

    tick(tile: Tile) {
        if (tile.terrain.water > 0) {
            this.ruined = true;
        }
        if (this.ruined) return;

        if (!this.active) {
            if (this.energy < this.activeValve) return;
            this.changeEnergy(-this.activeValve);
            this.active = true;
        }

        for (const { target, pipe } of this.transportationLines) {
            const dist = distance(tile, target);
            for (let i = 0; i < pipe.length; i++) {
                const transportation = pipe[i];
                transportation.progress += this.transportSpeed;
                // console.log(`${transportation.progress}/${dist}`);
                if (transportation.progress >= dist) {
                    pipe.splice(i, 1);
                    target.structure.changeEnergy(transportation.energy);
                }
            }
        }

        if (tile.game.ticks % this.transportPeriodTick === 0 && this.transportationLines.length > 0) {
            const lineCount = this.transportationLines.length;
            const totalSentEnergy = constraints(this.transportEnergy * lineCount, 0, this.energy);
            this.changeEnergy(-totalSentEnergy);
            const p: number = totalSentEnergy / lineCount;
            this.transportationLines.forEach(line => this.transport(line.target, p));
        }

        this.changeEnergy(this.genEnergyPerTick * (1 + 0.5 * (this.energy / this.maxEnergy)));
    }

    addTransportLine(target: Tile, source: Tile) {
        if (!this.hasTransportLine(target)) {
            const dist = distance(source, target);
            const cost = CONFIG.lineCost * dist;
            if (this.energy < cost) return false;

            this.changeEnergy(-cost);
            const line = { target, pipe: [] };
            this.transportationLines.push(line);
            return true;
        }
        return false;
    }

    removeTransportLine(target: Tile) {
        const index = this.transportationLines.findIndex(it => it.target === target);
        if (index >= 0) {
            this.transportationLines.splice(index, 1);
        }
    }

    hasTransportLine(target: Tile) {
        const index = this.transportationLines.findIndex(it => it.target === target);
        return index >= 0;
    }

    transport(target: Tile, energy: number) {
        const transportation = { energy, progress: 0 };
        const line = this.transportationLines.find(line => line.target === target);
        if (!line) return;

        line.pipe.push(transportation);
    }
}