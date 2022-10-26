export { default as EventEmitter2 } from 'eventemitter2';

interface BLEEmitter {
    on: (channelType: string, data: any) => void;
    emit: (channelType: string, data: any) => void;
    removeAllListeners: (channelType: string) => void;
}
declare class BleCore {
    bleName: string[];
    emitter: BLEEmitter;
    serviceIdCondition: string;
    readCharacteristicId: string;
    writeCharacteristicId: string;
    notifyCharacteristicId: string;
    deviceId: string;
    serviceId: string;
    module: any;
    constructor(bleName: any, emitter: any);
    getModule(): {
        print: (str: any) => void;
        promisify: (fn: any, args?: any) => Promise<unknown>;
        promisifyCallback: (fn: any) => Promise<unknown>;
        modBusCRC16: (data: any, startIdx: any, endIdx: any) => number;
        onBLEConnectionStateChange: (this: any) => any;
        openAdapter: () => Promise<unknown[] | string[]>;
        closeAdapter: () => Promise<unknown[] | string[]>;
        startSearchBle: () => Promise<unknown[] | string[]>;
        stopSearchBle: () => Promise<unknown[] | string[]>;
        onBluetoothFound: (this: any) => any;
        connectBle: (this: any) => Promise<unknown[] | string[]>;
        closeBleConnection: (this: any) => Promise<unknown[] | string[]>;
        getBleServices: (this: any) => Promise<any[] | string[]>;
        getCharacteristics: (this: any) => Promise<any[] | string[]>;
        notifyBleCharacteristicValueChange: (this: any) => Promise<unknown[] | string[]>;
        onBleCharacteristicValueChange: (this: any) => any;
        cleanSentOrder: (mudata: any, cmd: any) => any[];
        writeBLECharacteristicValue: (this: any, mudata: any) => Promise<unknown[] | string[]>;
    };
    onBleConnectionStateChange(): Promise<boolean>;
    openBleAdapter(): Promise<boolean>;
    closeBleAdapter(): Promise<boolean>;
    startSearchBle(): Promise<boolean>;
    stopSearchBle(): Promise<boolean>;
    onBluetoothFound(): Promise<boolean>;
    connectBle(): Promise<boolean>;
    closeBleConnection(): Promise<boolean>;
    getBleServices(): Promise<boolean>;
    getCharacteristics(): Promise<boolean>;
    notifyBleCharacteristicValueChange(): Promise<boolean>;
    onBleCharacteristicValueChange(): Promise<boolean>;
    sentOrder(mudata: any, cmd: any): Promise<boolean>;
}

declare class Ble extends BleCore {
    constructor(bleName: any, emitter: any);
    listen(callback: (data: any) => void): void;
    removeListen(): void;
    init(): Promise<void>;
    send(mudata: any, cmd: any): Promise<boolean>;
    close(): Promise<void>;
}

export { Ble as BLE };
