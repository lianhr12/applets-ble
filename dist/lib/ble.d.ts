import BleCore from './ble-core';
export declare enum EClientType {
    weixin = 0,
    uniapp = 1
}
export interface IBleOptions {
    bleName: string[];
    serviceIdCondition: string;
    clientType: EClientType;
}
declare class Ble extends BleCore {
    constructor(options: IBleOptions, emitter: any);
    listen(callback: (data: any) => void): void;
    removeListen(): void;
    init(): Promise<void>;
    send(mudata: any, cmd: any): Promise<boolean>;
    close(): Promise<void>;
}
export default Ble;
