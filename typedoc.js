module.exports = {
  excludePrivate: true,  // 导出不包含private声明内容
  excludeProtected: true, // 导出不包含protected声明内容
  // 将包版本添加到项目名称中。在这种情况下，如果项目是根据 1.2.3 版本`package.json`，这将生成名为“名称 - v1.2.3”的文档
  includeVersion: true, 
  entryPoints: [
    // 入口文件
    "./lib/index.ts"
  ],
  includes: ["lib/*.ts"], // 指定一个目录，其中包含可以在文档注释中使用[[include:file.md]]插入到生成文档中的文件。
  out: "docs", // 输出到文件夹
  name: "business-tools",
  readme: "none", // 是否在index页面展示README文件，该属性值设置为 none 时，index页面直接显示API文档内容。
}