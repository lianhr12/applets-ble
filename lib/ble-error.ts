interface IBleError extends Error {
  errCode: number;
}
export default function getErrorMsg(err: IBleError): string {
  const errCodeMsgMaps = {
    "10001": "当前蓝牙适配器不可用",
    "10002": "没有找到指定设备",
    "10003": "连接失败",
    "10004": "没有找到指定服务",
    "10005": "没有找到指定特征值",
    "10006": "当前连接已断开",
    "10007": "当前特征值不支持此操作",
    "10008": "其余所有系统上报的异常",
    "10009": "Android 系统特有，系统版本低于 4.3 不支持 BLE",
    "10012": "连接超时",
    "10013": "连接 deviceId 为空或者是格式不正确",
  }
  let msg = '';
  if (err && err.errCode) {
    msg = errCodeMsgMaps[err.errCode] || '蓝牙功能暂不支持';
  }else {
    if (typeof err === 'string') {
      if (err === 'device not found') {
        msg = '找不到该设备';
      } else {
        msg = err;
      }
    } else {
      msg = '蓝牙功能暂不支持';
    }
  }
  return msg;
}