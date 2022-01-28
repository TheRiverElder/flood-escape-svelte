
// 构造一个长度为length的数组，元素由genElem根据index产生
export function array<E>(length: number, genElem: (index: number) => E): E[] { return Array.from(Array(length), (_, i) => genElem(i)) }

// 生成一个[min, max)的随机数
export function rand(min: number, max: number): number { return min + Math.random() * (max - min); }

// 生成一个[min, max)的随机整数
export function randInt(min: number, max: any): number { return Math.floor(rand(min, max)); }

// 从数组arr中随机选择一个元素
export function randOne<E>(arr: E[]): E { return arr[randInt(0, arr.length)]; }

// 从数组arr中随机选择count个元素，若数组元素个数小于count，则只返回该数组的乱序
export function randOnes<E>(arr: E[], count: number): E[] {
    const cpy = arr.slice();
    for (let i = 0; i < cpy.length && i < count; i++) {
        const j = randInt(i, cpy.length);
        const tmp = cpy[i];
        cpy[i] = cpy[j];
        cpy[j] = tmp;
    }
    return cpy.slice(0, count);
}

// 限定数值在[min, max]范围内
export function constraints(value: number, min: number, max: number): number { return Math.min(Math.max(min, value), max); }

// 积算两个坐标的距离
export function distance(tile1: { x: number; y: number; }, tile2: { x: number; y: number; }): number { return Math.sqrt(Math.pow(tile1.x - tile2.x, 2) + Math.pow(tile1.y - tile2.y, 2)); }

// 判断一个数组或字符串内是否存在某元素
export function contains<E>(arr: string | E[], elem: any): boolean { return arr.indexOf(elem) >= 0; }

// 将一个字符串str重复count遍，并用joiner连接
export function repeat(str: any, count: number, joiner = ''): string { return Array(Math.floor(count)).fill(str).join(joiner); }

// 缩短数字，目前只是剪短其小数点后的位数
export function shorten(num: number): string { return num.toFixed(2); }

// 将数字转为百分值
export function toPercents(num: number): string { return (num * 100).toFixed(1) + '%'; }

// 根据给出的items，绘制进度条，长度为len，剩余空白会用filler填充
export function makeGraph(items: [string, number][], len: number, filler: string): string {
    const res = [];
    let acc = 0;
    for (const [str, ratio] of items.filter((it: any) => !!it)) {
        if (ratio > 0) {
            res.push(repeat(str, Math.floor(Math.max(1, len * ratio))));
        }
        acc += ratio;
    }
    // res.push(repeat(filler, floor(len * (1 - acc))));
    return res.join('').padEnd(len, filler);
}

// 将数组洗牌
export function shuffle<E>(arr: E[]): E[] {
    return randOnes(arr, arr.length);
}