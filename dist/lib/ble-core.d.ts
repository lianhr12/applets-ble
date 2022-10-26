import { IBleOptions, EClientType } from './ble';
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
    clientType: EClientType;
    module: any;
    constructor(options: IBleOptions, emitter: any);
    getModule(): {
        onBLEConnectionStateChange: (this: any) => any;
        openAdapter: () => Promise<string[] | unknown[]>;
        closeAdapter: () => Promise<string[] | unknown[]>;
        startSearchBle: () => Promise<string[] | unknown[]>;
        stopSearchBle: () => Promise<string[] | unknown[]>;
        onBluetoothFound: (this: any) => any;
        connectBle: (this: any) => Promise<string[] | unknown[]>;
        closeBleConnection: (this: any) => Promise<string[] | unknown[]>;
        getBleServices: (this: any) => Promise<any[] | string[]>;
        getCharacteristics: (this: any) => Promise<any[] | string[]>;
        notifyBleCharacteristicValueChange: (this: any) => Promise<string[] | unknown[]>;
        onBleCharacteristicValueChange: (this: any) => any;
        writeBLECharacteristicValue: (this: any, mudata: any) => Promise<string[] | unknown[]>;
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
export default BleCore;
