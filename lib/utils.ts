/**
 * 将不是标准的promise函数包装成promise处理
 * @param fn 处理的函数
 * @param args 函数调用的参数
 * @returns Promise
 */
export function promisify(fn, args?: any) {
  return new Promise((resolve, reject) => {
      fn({
          ...(args || {}),
          success: (res) => resolve(res),
          fail: (err) => reject(err),
      });
  });
}


/**
 * 将不是标准的promise函数【callback类型函数】包装成promise处理
 * @param fn 处理的函数
 * @returns Promise
 */
export function promisifyCallback(fn) {
  return new Promise((resolve, reject) => {
      fn(
          (res) => {
              resolve(res);
          },
          (rej) => {
              reject(rej);
          }
      );
  });
}

let PRINT_SHOW = true; // 是否开启蓝牙调试
export function print(str) {
  PRINT_SHOW ? console.log(str) : null;
}

export function cleanSentOrder(mudata, cmd) {
  print(`开始封装指令...`);
  let uarr = new Array(mudata.length + 8)
  uarr[0] = 0xEE //帧头
  uarr[1] = 0xFA //帧头
  uarr[2] = mudata.length + 1
  uarr[3] = cmd //命令码
  mudata.map((item, index) => {
      uarr[index + 4] = item
  })
  let crc = modBusCRC16(uarr, 2, mudata.length + 3)
  uarr[uarr.length - 4] = (crc >> 8) & 0xff
  uarr[uarr.length - 3] = crc & 0xff
  uarr[uarr.length - 2] = 0xFC //帧尾
  uarr[uarr.length - 1] = 0xFF //帧尾

  print(`✔ 封装成功!${uarr}`)
  return uarr
}

// CRC16 校验算法
export function modBusCRC16(data, startIdx, endIdx) {
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
