import BleCore from './ble-core';
declare class Ble extends BleCore {
    constructor(bleName: any, emitter: any);
    listen(callback: (data: any) => void): void;
    removeListen(): void;
    init(): Promise<void>;
    send(mudata: any, cmd: any): Promise<boolean>;
    close(): Promise<void>;
}
export default Ble;
