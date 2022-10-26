# applets-ble
[![npm](https://img.shields.io/npm/v/applets-ble.svg)](https://www.npmjs.com/package/@lianhr12/applets-ble)
[![LICENSE MIT](https://img.shields.io/npm/l/applets-ble.svg)](https://www.npmjs.com/package/@lianhr12/applets-ble) 

> uniapp 和 微信小程序蓝牙连接核心操作封装模块处理，可快速接入其他设备的蓝牙操作,提高可维护性以及可移植性。

## 安装使用
使用npm或者yarn快速安装
```bash
npm install applets-ble -S
# or yarn
yarn add applets-ble -S
```

根据模块使用工具库，下面简单举例：
ES Module
```javascript
import { createBle } from 'applets-ble';
const options = {
  // 适配的蓝牙名称集合
  bleName: [
    "XXX" // 要搜索的蓝牙名称
  ],
  // 查找serviceId的条件值
  serviceIdCondition: "", 
  clientType: 0, // 使用端的类型，0为微信小程序，1为uni APP
}
const ble = createBle(options);

// 监听事件处理
ble.listen(res => {
  if (res.type == 'connect') {
    switch(res.data){
      case "未打开适配器"：
        break
      case "蓝牙已连接"：
        break
      case ""
        break
    }
  }else if (res.type == "response") {
     console.log('收到设备消息响应：', res)
    // TODO 处理设备返回的数据
  }
});

// 移除监听事件处理
ble.removeListen();

// 蓝牙初始化
ble.init(); 

// 关闭蓝牙
ble.close();

// 发送指令
ble.send();
```

CommonJS
```javascript
const { createBle } = require('applets-ble');
const options = {
  // 适配的蓝牙名称集合
  bleName: [
    "XXX" // 要搜索的蓝牙名称
  ],
  // 查找serviceId的条件值
  serviceIdCondition: "", 
  clientType: 0, // 使用端的类型，0为微信小程序，1为uni APP
}
const ble = createBle(options);

// 监听事件处理
ble.listen(res => {
  if (res.type == 'connect') {
    switch(res.data){
      case "未打开适配器"：
        break
      case "蓝牙已连接"：
        break
      case ""
        break
    }
  }else if (res.type == "response") {
     console.log('收到设备消息响应：', res)
    // TODO 处理设备返回的数据
  }
});

// 移除监听事件处理
ble.removeListen();

// 蓝牙初始化
ble.init(); 

// 关闭蓝牙
ble.close();

// 发送指令
ble.send();
```

## 微信小程序使用npm包
### 1、 安装 npm 包
```bash
# 前提已经npm init或存在package.json文件
npm install applets-ble -S
```

### 2、构建npm
点击开发者工具IDE中的菜单栏：工具 --> 构建 npm

### 3、构建完成后即可使用 npm 包。
```javascript
import { BLE } from 'applets-ble';
// 调用模块方法
```

## API文档
详细API文档内容，后续补充