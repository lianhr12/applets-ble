import BleCore from './ble-core';

export enum EClientType {
  weixin=0,
  uniapp=1,
}
export interface IBleOptions {
  bleName: string[]; // 匹配蓝牙硬件名称集合
  serviceIdCondition: string; // 查找serviceId的条件值
  clientType: EClientType; // 使用API的环境，微信和uniapp
}

class Ble extends BleCore {
  constructor(options: IBleOptions, emitter) {
    super(options, emitter);
  }

  listen(callback: (data: any) => void): void {
    this.emitter.removeAllListeners("channel");
    this.emitter.on("channel", callback);
  }

  // 移除所有蓝牙监听事件
  removeListen() {
    this.emitter.removeAllListeners("channel");
  }

  async init() {
    let flow = false;
    // 打开蓝牙适配器状态监听
    this.onBleConnectionStateChange();
    // 蓝牙适配器初始化
    await this.openBleAdapter();
    // 搜索蓝牙设备
    await this.startSearchBle();
    // 获取设备ID
    flow = await this.onBluetoothFound();
    // 停止搜索设备
    await this.stopSearchBle();
    if (!flow) return;

    // 连接蓝牙设备
    await this.connectBle();
    // 获取serviceId
    await this.getBleServices();
    // 获取特征值
    await this.getCharacteristics();
    // 订阅特征值
    await this.notifyBleCharacteristicValueChange();

    this.onBleCharacteristicValueChange();
  }

  async send(mudata, cmd) {
    let flag = await this.sentOrder(mudata, cmd);
    return flag;
  }

  async close() {
    await this.closeBleConnection();
    await this.closeBleAdapter();
  }
}

export default Ble;