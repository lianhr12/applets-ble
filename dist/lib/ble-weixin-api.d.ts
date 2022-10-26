declare function print(str: any): void;
/**
 * 对微信接口的promise封装
 * @param {function} fn
 * @param {object} args
 */
declare function promisify(fn: any, args?: any): Promise<unknown>;
/**
 * 对微信接口回调函数的封装
 * @param {function} fn
 */
declare function promisifyCallback(fn: any): Promise<unknown>;
declare function openAdapter(): Promise<unknown[] | string[]>;
declare function closeAdapter(): Promise<unknown[] | string[]>;
declare function startSearchBle(): Promise<unknown[] | string[]>;
declare function onBLEConnectionStateChange(this: any): any;
declare function onBluetoothFound(this: any): any;
declare function stopSearchBle(): Promise<unknown[] | string[]>;
declare function connectBle(this: any): Promise<unknown[] | string[]>;
declare function closeBleConnection(this: any): Promise<unknown[] | string[]>;
declare function getBleServices(this: any): Promise<any[] | string[]>;
declare function getCharacteristics(this: any): Promise<any[] | string[]>;
declare function notifyBleCharacteristicValueChange(this: any): Promise<unknown[] | string[]>;
declare function onBleCharacteristicValueChange(this: any): any;
declare function cleanSentOrder(mudata: any, cmd: any): any[];
declare function modBusCRC16(data: any, startIdx: any, endIdx: any): number;
declare function writeBLECharacteristicValue(this: any, mudata: any): Promise<unknown[] | string[]>;
declare const _default: {
    print: typeof print;
    promisify: typeof promisify;
    promisifyCallback: typeof promisifyCallback;
    modBusCRC16: typeof modBusCRC16;
    onBLEConnectionStateChange: typeof onBLEConnectionStateChange;
    openAdapter: typeof openAdapter;
    closeAdapter: typeof closeAdapter;
    startSearchBle: typeof startSearchBle;
    stopSearchBle: typeof stopSearchBle;
    onBluetoothFound: typeof onBluetoothFound;
    connectBle: typeof connectBle;
    closeBleConnection: typeof closeBleConnection;
    getBleServices: typeof getBleServices;
    getCharacteristics: typeof getCharacteristics;
    notifyBleCharacteristicValueChange: typeof notifyBleCharacteristicValueChange;
    onBleCharacteristicValueChange: typeof onBleCharacteristicValueChange;
    cleanSentOrder: typeof cleanSentOrder;
    writeBLECharacteristicValue: typeof writeBLECharacteristicValue;
};
export default _default;
