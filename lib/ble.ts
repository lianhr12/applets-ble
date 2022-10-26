import BleCore from './ble-core';

class Ble extends BleCore {
  constructor(bleName, emitter) {
    super(bleName, emitter);
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