import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import { uglify } from "rollup-plugin-uglify";

export default [
  // 编译TS文件为UMD模块标准
  {
    input: "lib/index.ts",
    output: {
      file: "dist/applets-ble.umd.js",
      format: "umd",
      name: 'applets-ble'
    },
    plugins: [
      typescript(),
      uglify()
    ]
  },
  // 编译TS文件为CJS模块标准
  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    plugins: [
      typescript()
    ]
  },
  // 编译TS文件为ES Module模块
  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es" //这里的es指的就是将源码编译成esmodule规范的文件
    },
    plugins: [
      typescript(),
    ]
  },
  // 编译输出.d.ts声明文件
  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.d.ts",
    },
    plugins: [
      dts()
    ]
  }
]