import getErrorMsg from './ble-error';
import { promisify, print } from './utils';

function openAdapter() {
  print(`准备初始化蓝牙适配器...`);
  return promisify(wx.openBluetoothAdapter)
  .then((res) => {
    print(`√ 适配器初始化成功`);
    return [null, res];
  }).catch((err) => {
    print(`× 适配器初始化失败`);
    console.log(err);
    return [getErrorMsg(err), null];
  })
}

// 关闭蓝牙适配器
function closeAdapter() {
  print(`释放蓝牙适配器...`);
  return promisify(wx.closeBluetoothAdapter)
  .then((res) => {
    print(`√ 释放适配器成功！`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 释放适配器失败：${errMsg}`);
    return [errMsg, null];
  })
}

function startSearchBle() {
  print(`准备搜索附近的蓝牙外围设备...`);
  return promisify(wx.startBluetoothDevicesDiscovery,
  {
    allowDuplicatesKey: true,
    interval: 1000
  }).then((res) => {
    print(`√ 搜索蓝牙设备成功!`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 搜索蓝牙设备失败！${err}`);
    return [errMsg, null];
  });
}

function onBLEConnectionStateChange(this: any) {
  print(`监听蓝牙适配器状态...`);
  return _onBLEConnectionStateChange.call(this)
  .then((res) => {
    print(`√ 监听蓝牙适配器状态成功，结果为${JSON.stringify(res)}`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 监听蓝牙适配器状态失败! ${errMsg}`);
    return [errMsg, null];
  });
}

function _onBLEConnectionStateChange(this: any) {
  return new Promise((resolve, reject) => {
    wx.onBLEConnectionStateChange((result) => {
      // 该方法回调中，可以用于处理连接意外断开等异常情况
      if (!result.connected) {
        this.closeBleAdapter();
        // 更新蓝牙状态
        wx.setStorageSync("bluestatus", "");
        this.emitter.emit('channel', {
          type: 'connect',
          data: "蓝牙已断开"
        });
      }
      resolve(result);
    });
  });
}

function onBluetoothFound(this: any) {
  print(`监听搜索蓝牙新设备事件...`);
  return _onBluetoothFoundPromise.call(this)
  .then((res) => {
    print(`√ 设备ID找到成功！`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 设备ID找到失败! ${errMsg}`);
    return [errMsg, null];
  })
}

function _onBluetoothFoundPromise(this: any) {
  let count = 0;
  return new Promise((resolve, reject) => {
    wx.onBluetoothDeviceFound((result) => {
      const devices = result.devices;
      count++;
      if (count > 1) {
        devices.forEach((item) => {
          let name = item.name || item.localName || '';
          if (this.bleName.indexOf(name) > -1) {
            print(`已嗅探到符合条件的设备：${item.name}: ${item.deviceId}`)
            this.deviceId = item.deviceId;
            resolve(result);
          }
        })
      }
      print(`已嗅探蓝牙设备数：${devices.length}`);
    });
  });
}

function stopSearchBle() {
  print(`停止查找新设备...`);
  return promisify(wx.stopBluetoothDevicesDiscovery)
  .then((res) => {
    print(`√ 已停止查找设备！`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 停止查找设备失败! ${errMsg}`);
    return [errMsg, null];
  });
}

function connectBle(this: any) {
  print(`准备连接新设备..., deviceId: ${this.deviceId}`);
  return promisify(wx.createBLEConnection,
  {
    deviceId: this.deviceId,
  }).then((res) => {
    print(`√ 连接蓝牙成功！`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 连接蓝牙失败！${JSON.stringify(err)}`);
    return [errMsg, null];
  });
}

function closeBleConnection(this: any) {
  print(`断开蓝牙连接...`);
  return promisify(wx.closeBLEConnection, {
    deviceId: this.deviceId
  }).then((res) => {
    print(`√ 断开蓝牙连接成功！`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 断开蓝牙连接失败！${errMsg}`);
    return [errMsg, null];
  });
}

function getBleServices(this: any) {
  print(`获取蓝牙设备所有服务...`);
  return promisify(wx.getBLEDeviceServices, {
    deviceId: this.deviceId,
  }).then((res: any) => {
    print(`√ 获取service成功`);
    print(`serviceIdCondition: ${this.serviceIdCondition}`);
    let services = res.services
    services.forEach((item, index) => {
      if (item.uuid.indexOf(this.serviceIdCondition) > -1) {
       this.serviceId = item.uuid;
      }
    });
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 获取service失败! ${errMsg}`);
    return [errMsg, null];
  });
}

function getCharacteristics(this: any) {
  print(`开始获取蓝牙特征值...\n serviceId: ${this.serviceId}`);
  return promisify(wx.getBLEDeviceCharacteristics, {
    deviceId: this.deviceId,
    serviceId: this.serviceId
  }).then((res: any) => {
    print(`√ 获取特征值成功！`);
    print(res);
    const characteristics = res.characteristics;
    for (let i=0, cLen = characteristics.length; i < cLen; i++) {
      let item = characteristics[i];
      let properties = item.properties;
      if (properties.read) {
        this.readCharacteristicId = item.uuid;
        print(`readCharacteristicId: ${item.uuid}`);
      }

      if (properties.write && !properties.read) {
        this.writeCharacteristicId = item.uuid;
        print(`writeCharacteristicId:${item.uuid}`);
      }

      if (properties.notify || properties.indicate) {
        this.notifyCharacteristicId = item.uuid;
        print(`notifyCharacteristicId:${item.uuid}`);
      }
    }
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 获取蓝牙特征值失败! ${errMsg}`);
    return [errMsg, null];
  });
}

function notifyBleCharacteristicValueChange(this: any) {
  print(`开始订阅蓝牙特征值...\ncharacteristicId: ${this.notifyCharacteristicId}\n deviceId:${this.deviceId}\nserviceId:${this.serviceId}`);
  return promisify(wx.notifyBLECharacteristicValueChange, {
    characteristicId: this.notifyCharacteristicId,
    deviceId: this.deviceId,
    serviceId: this.serviceId,
    state: true,
  }).then((res) => {
    print(`√ 订阅notify成功!`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 订阅notify失败！`);
    return [errMsg, null];
  })
}

function onBleCharacteristicValueChange(this: any) {
  print(`监听接收蓝牙特征值...`);
  return _onBleCharacteristicValueChange.call(this)
  .then((res) => {
    print(`√ 监听接收蓝牙特征值成功，结果为${JSON.stringify(res)}`);
    return [null, res];
  }).catch((err) => {
    const errMsg = getErrorMsg(err);
    print(`× 监听接收蓝牙特征值失败! ${errMsg}`);
    return [errMsg, null];
  });
}

function _onBleCharacteristicValueChange (this: any) {
  let lastDate = new Date().getTime();
  return new Promise((resolve, reject) => {
    wx.onBLECharacteristicValueChange((result) => {
      const arrbf = new Uint8Array(result.value);
      const nowDate = new Date().getTime();
      print(`接收硬件的数据反馈：命令码为：${arrbf[3]}`);
      if ((nowDate - lastDate) > 800) {
          print('-- 节流800ms,Lock!');
          lastDate = nowDate;
          this.emitter.emit("channel", {
              type: "response",
              data: arrbf
          });
      }
      resolve(arrbf);
    });
  });
}



function writeBLECharacteristicValue(this: any, mudata) {
  return promisify(wx.writeBLECharacteristicValue, {
    deviceId: this.deviceId,
    serviceId: this.serviceId,
    characteristicId: this.writeCharacteristicId,
    value: mudata
  }).then((res) => {
    print(`✔ 写入数据成功！`)
    return [null, res];
  }).catch((err) => {
    print(`✘ 写入数据失败！${JSON.stringify(err)}`)
    return [getErrorMsg(err), null];
  });
}

export default {
  onBLEConnectionStateChange,
  openAdapter,
  closeAdapter,
  startSearchBle,
  stopSearchBle,
  onBluetoothFound,

  connectBle,
  closeBleConnection,
  getBleServices,
  getCharacteristics,
  notifyBleCharacteristicValueChange,
  onBleCharacteristicValueChange,

  writeBLECharacteristicValue
}