import { Game } from "../Game";
import type { BooleanParameterPattern, Manifest, NumberParameterPattern as NumberParameterPattern, ParameterPattern } from "../interfaces";
import { MazeTerrainGenerator } from "./game-generators/MazeTerrainGenerator";
import { SimpleRandomStructureGenerator } from "./game-generators/SimpleRandomStructureGenerator";
import { SimpleRandomTerrainGenerator } from "./game-generators/SimpleRandomTerrainGenerator";
import { WallTerrainGenerator } from "./game-generators/WallTerrainGenerator";

function createGame(gameParameters: any): Game {
    const {
        gameMapWidth,
        gameMapHeight,
        genSimpleRandomTerrain,
        initGridSize,
        initMaxWaterLevel,
        genMaze,
        genWallTerrain,
        wallAltitude,
        wallRadius,
        genRandomStructure,
        maxWaterLevel,
        initWaterSourceCount,
        initCityCount,
    } = gameParameters;

    const game = new Game(gameMapWidth, gameMapHeight);

    const tgs = [
        genSimpleRandomTerrain ? new SimpleRandomTerrainGenerator({ initGridSize, initMaxWaterLevel }) : null,
        genMaze ? new MazeTerrainGenerator() : null,
        genWallTerrain ? new WallTerrainGenerator({ wallAltitude, wallRadius }) : null,
        genRandomStructure ? new SimpleRandomStructureGenerator({
            maxWaterLevel,
            initWaterSourceCount,
            initCityCount,
        }) : null,
    ];
    tgs.forEach(tg => tg?.generate(game));

    return game;
}

function getParameterPatterns(): ParameterPattern<any>[] {
    const patterns: ParameterPattern<any>[] = [];

    const gameMapWidth: NumberParameterPattern = {
        id: "number",
        name: "gameMapWidth",
        display: "游戏地图宽度（格）",
        defaultValue: 16,
        min: 1,
        max: 100,
        step: 1,
    };

    const gameMapHeight: NumberParameterPattern = {
        id: "number",
        name: "gameMapHeight",
        display: "游戏地图高度（格）",
        defaultValue: 12,
        min: 1,
        max: 64,
        step: 1,
    };

    const maxWaterLevel: NumberParameterPattern = {
        id: "number",
        name: "maxWaterLevel",
        display: "最高水平面",
        defaultValue: 16,
        min: 1,
        max: 64,
        step: 1,
    };

    const initWaterSourceCount: NumberParameterPattern = {
        id: "number",
        name: "initWaterSourceCount",
        display: "水源个数",
        defaultValue: 2,
        min: 0,
        max: 64,
        step: 1,
    };

    const initCityCount: NumberParameterPattern = {
        id: "number",
        name: "initCityCount",
        display: "城市个数",
        defaultValue: 12,
        min: 0,
        max: 64,
        step: 1,
    };

    const genRandomStructure: BooleanParameterPattern = {
        id: "boolean",
        name: "genRandomStructure",
        display: "生成随机建筑",
        defaultValue: true,
        subParameters: [maxWaterLevel, initWaterSourceCount, initCityCount],
    };

    const genMaze: BooleanParameterPattern = {
        id: "boolean",
        name: "genMaze",
        display: "生成迷宫",
        defaultValue: false,
    };

    const initGridSize: NumberParameterPattern = {
        id: "number",
        name: "initGridSize",
        display: "网格单元长度",
        defaultValue: 4,
        min: 1,
        max: 64,
        step: 1,
        integer: true,
    };

    const initMaxWaterLevel: NumberParameterPattern = {
        id: "number",
        name: "initMaxWaterLevel",
        display: "初始地形最高水平面",
        defaultValue: 16,
        min: 1,
        max: 64,
        step: 1,
        integer: true,
    };

    const genSimpleRandomTerrain: BooleanParameterPattern = {
        id: "boolean",
        name: "genSimpleRandomTerrain",
        display: "生成简单随机地形",
        defaultValue: true,
        subParameters: [initGridSize, initMaxWaterLevel],
    };

    const wallAltitude: NumberParameterPattern = {
        id: "number",
        name: "wallAltitude",
        display: "墙高",
        defaultValue: 12,
        min: 1,
        max: 16,
        step: 1,
        integer: true,
    };

    const wallRadius: NumberParameterPattern = {
        id: "number",
        name: "wallRadius",
        display: "墙半径",
        defaultValue: 5,
        min: 0,
        max: 64,
        step: 1,
    };

    const genWallTerrain: BooleanParameterPattern = {
        id: "boolean",
        name: "genWallTerrain",
        display: "生成墙壁",
        defaultValue: false,
        subParameters: [wallAltitude, wallRadius],
    };


    patterns.push(gameMapWidth, gameMapHeight, genSimpleRandomTerrain, genMaze, genWallTerrain, genRandomStructure);

    return patterns;
}

export const manifest: Manifest = {
    createGame,
    getParameterPatterns,
};