import type { LinkTileEvent } from "./GameRenderer";
import { contains } from "./utils";
import type { CityStructure } from "./builtin/structures/CityStructure";

const CONFIG = {
    tileSize: 20,
    tileEdgeWidth: 1,
    doDrawTileEdge: false,
    maxWaterLevel: 16,
    lineCost: 100,
    initWaterLevel: 7,
    initGridSize: 4,
    initCityCount: 12,
    initWaterSourceCount: 2,
};

window.CONFIG = CONFIG;

export function handleLinkTile(e: LinkTileEvent) {
    const { src, dst } = e;
    const srcStruct = src.structure;
    const dstStruct = dst.structure;

    if (srcStruct && dstStruct && srcStruct.id === 'city') {
        const srcStc = srcStruct as CityStructure;
        if (srcStc.hasTransportLine(dst)) {
            srcStc.removeTransportLine(dst);
        } else if (srcStc.active && contains(['city', 'rocket'], dstStruct.id)) {
            srcStc.addTransportLine(dst, src);
        }
    }
}