export class Terrain {
    
    altitude: number;
    water: number;

    constructor(altitude: number, water: number = 0) {
        this.altitude = altitude;
        this.water = water;
    }

    get level(): number { 
        return this.altitude + this.water; 
    }
}