/**
 * 将不是标准的promise函数包装成promise处理
 * @param fn 处理的函数
 * @param args 函数调用的参数
 * @returns Promise
 */
export declare function promisify(fn: any, args?: any): Promise<unknown>;
/**
 * 将不是标准的promise函数【callback类型函数】包装成promise处理
 * @param fn 处理的函数
 * @returns Promise
 */
export declare function promisifyCallback(fn: any): Promise<unknown>;
export declare function print(str: any): void;
export declare function cleanSentOrder(mudata: any, cmd: any): any[];
export declare function modBusCRC16(data: any, startIdx: any, endIdx: any): number;
