import { IBleOptions, EClientType } from './ble';
import wxAppBle from './ble-weixin-api';
import uniAppBle from './ble-uniapp-api';
import { cleanSentOrder } from './utils';

interface BLEEmitter {
  on: (channelType: string, data: any) => void;
  emit: (channelType: string, data: any) => void;
  removeAllListeners: (channelType: string) => void;
}

// 实现API 的主要方法，对应平台API 则在拆分出来
class BleCore {
  bleName: string[]; // 设备名称集合
  emitter: BLEEmitter; // 事件实例
  serviceIdCondition: string; // 特征条件值
  readCharacteristicId: string; // 可读特征值id
  writeCharacteristicId: string; // 可写特征值id
  notifyCharacteristicId: string; // 可订阅特征值id
  deviceId: string; // 蓝牙设备id
  serviceId: string; // 服务id
  clientType: EClientType; // 使用端类型

  module; // 适配器的模块

  constructor(options: IBleOptions, emitter) {
    const {
      bleName,
      serviceIdCondition,
      clientType
    } = options;

    this.bleName = bleName;
    this.emitter = emitter;
    this.clientType = clientType;

    this.readCharacteristicId = "";
    this.writeCharacteristicId = "";
    this.notifyCharacteristicId = "";
    this.deviceId = "";
    this.serviceIdCondition = serviceIdCondition || "";
    this.serviceId = ""; // 通过条件查找符合的serverid
    
    this.module = this.getModule();
  }

  getModule() {
    // 通过条件去区分处理， 后面要增加uniapp支持的API
    if (this.clientType == EClientType.weixin) {
      return wxAppBle;
    }
    
    if (this.clientType == EClientType.uniapp) {
      return uniAppBle;
    }
  }

  // 打开蓝牙适配器状态监听
  async onBleConnectionStateChange() {
    const [err] = await this.module.onBLEConnectionStateChange.call(this);
    if (err != null) {
      this.emitter.emit("channel", {
        type: "connect",
        data: "监听蓝牙适配器状态异常"
      });
      return false;
    }
    return true;
  }

  // 打开蓝牙适配器
  async openBleAdapter() {
    const [err] = await this.module.openAdapter.call(this);
    if (err != null) {
      this.emitter.emit("channel", {
        type: "connect",
        data: "openBluetoothAdapterFailAlreadyOpened"
      });
      await this.closeBleAdapter();
      return false;
    }
    return true;
  }
  // 关闭蓝牙适配器
  async closeBleAdapter() {
    const [err] = await this.module.closeAdapter.call(this);
    if (err != null) {
      return false;
    }
    return true;
  }
  // 搜索蓝牙设备
  async startSearchBle() {
    const [err] = await this.module.startSearchBle.call(this);
    if (err != null) {
      return false;
    }
    this.emitter.emit('channel', {
      type: 'connect',
      data: '正在连接中'
    });
    return true;
  }
  // 停止搜索蓝牙设备
  async stopSearchBle() {
    const [err] = await this.module.stopSearchBle.call(this);
    if (err != null) {
      return false;
    }
    return true;
  }
  // 监听寻找到新设备的事件
  async onBluetoothFound() {
    let [err] = await this.module.onBluetoothFound.call(this);
    if (err != null) {
      this.emitter.emit('channel', {
        type: 'connect',
        data: '未找到设备'
      });
      return false;
    }
    return true;
  }
  // 连接蓝牙设备
  async connectBle() {
    const [err] = await this.module.connectBle.call(this);
    if (err != null) {
      this.emitter.emit('channel', {
        type: 'connect',
        data: '未找到设备！'
      });
      return false;
    }
    return true;
  }
  // 关闭蓝牙设备连接
  async closeBleConnection() {
    const [err] = await this.module.closeBleConnection.call(this);
    if (err != null) {
      return false;
    }
    return true;
  }
  // 获取蓝牙serviceId
  async getBleServices() {
    const [err] = await this.module.getBleServices.call(this);
    if (err != null) {
      return false;
    }
    return true;
  }
  // 获取蓝牙特征值
  async getCharacteristics() {
    const [err] = await this.module.getCharacteristics.call(this);
    if (err != null) {
      this.emitter.emit("channel", {
        type: 'connect',
        data: '无法订阅特征值'
      });
      this.closeBleConnection();
      this.closeBleAdapter();
      return;
    }
    this.emitter.emit("channel", {
      type: "connect",
      data: "蓝牙已连接"
    });
    return true;
  }
  // 订阅蓝牙特征值
  async notifyBleCharacteristicValueChange() {
    const [err] = await this.module.notifyBleCharacteristicValueChange.call(this);
    if (err != null) {
      return false;
    }
    return true;
  }
  // 收到设备推送的通知
  async onBleCharacteristicValueChange() {
    const [err] = await this.module.onBleCharacteristicValueChange.call(this);
    if (err != null) {
      this.emitter.emit("channel", {
        type: "connect",
        data: "监听蓝牙设备推送异常"
      });
      return false;
    }
    return true;
  }

  // 发送指令
  async sentOrder(mudata, cmd) {
    let data = cleanSentOrder(mudata, cmd);
    console.log("-- 发送数据:", data)
    let arrayBuffer = new Uint8Array(data).buffer;
    let [err] = await this.module.writeBLECharacteristicValue.call(this, arrayBuffer)
    if (err != null) {
      return false;
    }
    console.log("数据发送成功！")
    return true
  }
}

export default BleCore;