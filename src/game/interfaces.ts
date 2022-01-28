import type { Game } from "./Game";

export type Nullable<T> = T | null;
export type Handler<T> = (o: T) => void;
export interface Manifest {
    getParameterPatterns(): ParameterPattern<any>[];
    createGame(gameParameters: any): Game;
}

export interface ParameterPattern<P> {
    id: string; // 标记该参数的类型
    name: string; // 该参数的名字
    display?: string; // 该参数显示在界面上的名字
    defaultValue: P; // 该参数的默认值
    // defaultValue?: P; // 该参数的默认值
    // required?: boolean; // 该参数是否是必填的
    subParameters?: ParameterPattern<any>[]; // 子参数
}

export interface NumberParameterPattern extends ParameterPattern<number> {
    id: "number";
    min?: number; // 最小值
    max?: number; // 最大值
    step?: number; // 步长
    integer?: boolean; // 是否必须是整数
}

export interface BooleanParameterPattern extends ParameterPattern<boolean> {
    id: "boolean";
}

export interface SelectParameterPattern extends ParameterPattern<string | number> {
    id: "select";
    options: [string | number, string]; // [数值, 现实的名称]
}

// [下限, 上限]
export interface RangeParameterPattern extends ParameterPattern<[number, number]> {
    id: "range";
    min: number; // 最小值
    max: number; // 最大值
    step?: number; // 步长
    integer?: number; // 是否必须是整数
}