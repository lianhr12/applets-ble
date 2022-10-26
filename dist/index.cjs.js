'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter2 = require('eventemitter2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter2__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter2);

function getErrorMsg(err) {
    const errCodeMsgMaps = {
        "10000": "未初始化蓝牙适配器",
        "10001": "当前蓝牙适配器不可用",
        "10002": "没有找到指定设备",
        "10003": "连接失败",
        "10004": "没有找到指定服务",
        "10005": "没有找到指定特征值",
        "10006": "当前连接已断开",
        "10007": "当前特征值不支持此操作",
        "10008": "其余所有系统上报的异常",
        "10009": "Android 系统特有，系统版本低于 4.3 不支持 BLE",
        "10010": "已连接设备",
        "10011": "配对设备需要配对码",
        "10012": "连接超时",
        "10013": "连接 deviceId 为空或者是格式不正确",
    };
    let msg = '';
    if (err && err.errCode) {
        msg = errCodeMsgMaps[err.errCode] || '蓝牙功能暂不支持';
    }
    else {
        if (typeof err === 'string') {
            if (err === 'device not found') {
                msg = '找不到该设备';
            }
            else {
                msg = err;
            }
        }
        else {
            msg = '蓝牙功能暂不支持';
        }
    }
    return msg;
}

/**
 * 将不是标准的promise函数包装成promise处理
 * @param fn 处理的函数
 * @param args 函数调用的参数
 * @returns Promise
 */
function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        fn({
            ...(args || {}),
            success: (res) => resolve(res),
            fail: (err) => reject(err),
        });
    });
}
function print(str) {
    console.log(str) ;
}
function cleanSentOrder(mudata, cmd) {
    print(`开始封装指令...`);
    let uarr = new Array(mudata.length + 8);
    uarr[0] = 0xEE; //帧头
    uarr[1] = 0xFA; //帧头
    uarr[2] = mudata.length + 1;
    uarr[3] = cmd; //命令码
    mudata.map((item, index) => {
        uarr[index + 4] = item;
    });
    let crc = modBusCRC16(uarr, 2, mudata.length + 3);
    uarr[uarr.length - 4] = (crc >> 8) & 0xff;
    uarr[uarr.length - 3] = crc & 0xff;
    uarr[uarr.length - 2] = 0xFC; //帧尾
    uarr[uarr.length - 1] = 0xFF; //帧尾
    print(`✔ 封装成功!${uarr}`);
    return uarr;
}
// CRC16 校验算法
function modBusCRC16(data, startIdx, endIdx) {
    var crc = 0xffff;
    do {
        if (endIdx <= startIdx) {
            break;
        }
        if (data.length <= endIdx) {
            break;
        }
        for (var i = startIdx; i <= endIdx; i++) {
            var byte = data[i] & 0xffff;
            for (var j = 0; j < 8; j++) {
                crc = (byte ^ crc) & 0x01 ? (crc >> 1) ^ 0xa001 : crc >> 1;
                byte >>= 1;
            }
        }
    } while (0);
    return ((crc << 8) | (crc >> 8)) & 0xffff;
}

function openAdapter$1() {
    print(`准备初始化蓝牙适配器...`);
    return promisify(wx.openBluetoothAdapter)
        .then((res) => {
        print(`√ 适配器初始化成功`);
        return [null, res];
    }).catch((err) => {
        print(`× 适配器初始化失败`);
        console.log(err);
        return [getErrorMsg(err), null];
    });
}
// 关闭蓝牙适配器
function closeAdapter$1() {
    print(`释放蓝牙适配器...`);
    return promisify(wx.closeBluetoothAdapter)
        .then((res) => {
        print(`√ 释放适配器成功！`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 释放适配器失败：${errMsg}`);
        return [errMsg, null];
    });
}
function startSearchBle$1() {
    print(`准备搜索附近的蓝牙外围设备...`);
    return promisify(wx.startBluetoothDevicesDiscovery, {
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
function onBLEConnectionStateChange$1() {
    print(`监听蓝牙适配器状态...`);
    return _onBLEConnectionStateChange$1.call(this)
        .then((res) => {
        print(`√ 监听蓝牙适配器状态成功，结果为${JSON.stringify(res)}`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 监听蓝牙适配器状态失败! ${errMsg}`);
        return [errMsg, null];
    });
}
function _onBLEConnectionStateChange$1() {
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
function onBluetoothFound$1() {
    print(`监听搜索蓝牙新设备事件...`);
    return _onBluetoothFoundPromise$1.call(this)
        .then((res) => {
        print(`√ 设备ID找到成功！`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 设备ID找到失败! ${errMsg}`);
        return [errMsg, null];
    });
}
function _onBluetoothFoundPromise$1() {
    let count = 0;
    return new Promise((resolve, reject) => {
        wx.onBluetoothDeviceFound((result) => {
            const devices = result.devices;
            count++;
            if (count > 1) {
                devices.forEach((item) => {
                    let name = item.name || item.localName || '';
                    if (this.bleName.indexOf(name) > -1) {
                        print(`已嗅探到符合条件的设备：${item.name}: ${item.deviceId}`);
                        this.deviceId = item.deviceId;
                        resolve(result);
                    }
                });
            }
            print(`已嗅探蓝牙设备数：${devices.length}`);
        });
    });
}
function stopSearchBle$1() {
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
function connectBle$1() {
    print(`准备连接新设备..., deviceId: ${this.deviceId}`);
    return promisify(wx.createBLEConnection, {
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
function closeBleConnection$1() {
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
function getBleServices$1() {
    print(`获取蓝牙设备所有服务...`);
    return promisify(wx.getBLEDeviceServices, {
        deviceId: this.deviceId,
    }).then((res) => {
        print(`√ 获取service成功`);
        print(`serviceIdCondition: ${this.serviceIdCondition}`);
        let services = res.services;
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
function getCharacteristics$1() {
    print(`开始获取蓝牙特征值...\n serviceId: ${this.serviceId}`);
    return promisify(wx.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId
    }).then((res) => {
        print(`√ 获取特征值成功！`);
        print(res);
        const characteristics = res.characteristics;
        for (let i = 0, cLen = characteristics.length; i < cLen; i++) {
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
        wx.setStorageSync("bluestatus", "on");
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 获取蓝牙特征值失败! ${errMsg}`);
        wx.setStorageSync("bluestatus", "");
        return [errMsg, null];
    });
}
function notifyBleCharacteristicValueChange$1() {
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
    });
}
function onBleCharacteristicValueChange$1() {
    print(`监听接收蓝牙特征值...`);
    return _onBleCharacteristicValueChange$1.call(this)
        .then((res) => {
        print(`√ 监听接收蓝牙特征值成功，结果为${JSON.stringify(res)}`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 监听接收蓝牙特征值失败! ${errMsg}`);
        return [errMsg, null];
    });
}
function _onBleCharacteristicValueChange$1() {
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
function writeBLECharacteristicValue$1(mudata) {
    return promisify(wx.writeBLECharacteristicValue, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.writeCharacteristicId,
        value: mudata
    }).then((res) => {
        print(`✔ 写入数据成功！`);
        return [null, res];
    }).catch((err) => {
        print(`✘ 写入数据失败！${JSON.stringify(err)}`);
        return [getErrorMsg(err), null];
    });
}
var wxAppBle = {
    onBLEConnectionStateChange: onBLEConnectionStateChange$1,
    openAdapter: openAdapter$1,
    closeAdapter: closeAdapter$1,
    startSearchBle: startSearchBle$1,
    stopSearchBle: stopSearchBle$1,
    onBluetoothFound: onBluetoothFound$1,
    connectBle: connectBle$1,
    closeBleConnection: closeBleConnection$1,
    getBleServices: getBleServices$1,
    getCharacteristics: getCharacteristics$1,
    notifyBleCharacteristicValueChange: notifyBleCharacteristicValueChange$1,
    onBleCharacteristicValueChange: onBleCharacteristicValueChange$1,
    writeBLECharacteristicValue: writeBLECharacteristicValue$1
};

function openAdapter() {
    print(`准备初始化蓝牙适配器...`);
    return promisify(uni.openBluetoothAdapter)
        .then((res) => {
        print(`√ 适配器初始化成功`);
        return [null, res];
    }).catch((err) => {
        print(`× 适配器初始化失败`);
        console.log(err);
        return [getErrorMsg(err), null];
    });
}
// 关闭蓝牙适配器
function closeAdapter() {
    print(`释放蓝牙适配器...`);
    return promisify(uni.closeBluetoothAdapter)
        .then((res) => {
        print(`√ 释放适配器成功！`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 释放适配器失败：${errMsg}`);
        return [errMsg, null];
    });
}
function startSearchBle() {
    print(`准备搜索附近的蓝牙外围设备...`);
    return promisify(uni.startBluetoothDevicesDiscovery, {
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
function onBLEConnectionStateChange() {
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
function _onBLEConnectionStateChange() {
    return new Promise((resolve, reject) => {
        uni.onBLEConnectionStateChange((result) => {
            // 该方法回调中，可以用于处理连接意外断开等异常情况
            if (!result.connected) {
                this.closeBleAdapter();
                // 更新蓝牙状态
                uni.setStorageSync("bluestatus", "");
                this.emitter.emit('channel', {
                    type: 'connect',
                    data: "蓝牙已断开"
                });
            }
            resolve(result);
        });
    });
}
function onBluetoothFound() {
    print(`监听搜索蓝牙新设备事件...`);
    return _onBluetoothFoundPromise.call(this)
        .then((res) => {
        print(`√ 设备ID找到成功！`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 设备ID找到失败! ${errMsg}`);
        return [errMsg, null];
    });
}
function _onBluetoothFoundPromise() {
    let count = 0;
    return new Promise((resolve, reject) => {
        uni.onBluetoothDeviceFound((result) => {
            const devices = result.devices;
            count++;
            if (count > 1) {
                devices.forEach((item) => {
                    let name = item.name || item.localName || '';
                    if (this.bleName.indexOf(name) > -1) {
                        print(`已嗅探到符合条件的设备：${item.name}: ${item.deviceId}`);
                        this.deviceId = item.deviceId;
                        resolve(result);
                    }
                });
            }
            print(`已嗅探蓝牙设备数：${devices.length}`);
        });
    });
}
function stopSearchBle() {
    print(`停止查找新设备...`);
    return promisify(uni.stopBluetoothDevicesDiscovery)
        .then((res) => {
        print(`√ 已停止查找设备！`);
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 停止查找设备失败! ${errMsg}`);
        return [errMsg, null];
    });
}
function connectBle() {
    print(`准备连接新设备..., deviceId: ${this.deviceId}`);
    return promisify(uni.createBLEConnection, {
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
function closeBleConnection() {
    print(`断开蓝牙连接...`);
    return promisify(uni.closeBLEConnection, {
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
function getBleServices() {
    print(`获取蓝牙设备所有服务...`);
    return promisify(uni.getBLEDeviceServices, {
        deviceId: this.deviceId,
    }).then((res) => {
        print(`√ 获取service成功`);
        print(`serviceIdCondition: ${this.serviceIdCondition}`);
        let services = res.services;
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
function getCharacteristics() {
    print(`开始获取蓝牙特征值...\n serviceId: ${this.serviceId}`);
    return promisify(uni.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId
    }).then((res) => {
        print(`√ 获取特征值成功！`);
        print(res);
        const characteristics = res.characteristics;
        for (let i = 0, cLen = characteristics.length; i < cLen; i++) {
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
        uni.setStorageSync("bluestatus", "on");
        return [null, res];
    }).catch((err) => {
        const errMsg = getErrorMsg(err);
        print(`× 获取蓝牙特征值失败! ${errMsg}`);
        uni.setStorageSync("bluestatus", "");
        return [errMsg, null];
    });
}
function notifyBleCharacteristicValueChange() {
    print(`开始订阅蓝牙特征值...\ncharacteristicId: ${this.notifyCharacteristicId}\n deviceId:${this.deviceId}\nserviceId:${this.serviceId}`);
    return promisify(uni.notifyBLECharacteristicValueChange, {
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
    });
}
function onBleCharacteristicValueChange() {
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
function _onBleCharacteristicValueChange() {
    let lastDate = new Date().getTime();
    return new Promise((resolve, reject) => {
        uni.onBLECharacteristicValueChange((result) => {
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
function writeBLECharacteristicValue(mudata) {
    return promisify(uni.writeBLECharacteristicValue, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.writeCharacteristicId,
        value: mudata
    }).then((res) => {
        print(`✔ 写入数据成功！`);
        return [null, res];
    }).catch((err) => {
        print(`✘ 写入数据失败！${JSON.stringify(err)}`);
        return [getErrorMsg(err), null];
    });
}
var uniAppBle = {
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
};

// 实现API 的主要方法，对应平台API 则在拆分出来
class BleCore {
    constructor(options, emitter) {
        const { bleName, serviceIdCondition, clientType } = options;
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
        console.log("-- 发送数据:", data);
        let arrayBuffer = new Uint8Array(data).buffer;
        let [err] = await this.module.writeBLECharacteristicValue.call(this, arrayBuffer);
        if (err != null) {
            return false;
        }
        console.log("数据发送成功！");
        return true;
    }
}

var EClientType;
(function (EClientType) {
    EClientType[EClientType["weixin"] = 0] = "weixin";
    EClientType[EClientType["uniapp"] = 1] = "uniapp";
})(EClientType || (EClientType = {}));
class Ble extends BleCore {
    constructor(options, emitter) {
        super(options, emitter);
    }
    listen(callback) {
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
        if (!flow)
            return;
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

function createBle(options) {
    const emitter = new EventEmitter2__default["default"]();
    const ble = new Ble(options, emitter);
    ble.init();
    return ble;
}

exports.createBle = createBle;
