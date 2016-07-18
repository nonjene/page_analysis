# Page_analysis

* 一个网页性能分析的后台, 类似于[gtmetrix.com](https://gtmetrix.com), 就是功能少一些, 但可扩展。
* 目前有有资源统计, 截图, 和图片文件的可优化度及优化图片的下载。
* 工具基于[phantomjs](https://github.com/ariya/phantomjs)开发。


## 依赖

### windows
[下载phantomjs](http://phantomjs.org/download.html), 解压后要记得在系统设置环境变量。
    
### MacOS X
直接运行`brew install phantomjs`安装。也可以在上面的链接下载安装包。

## 安装
1. 执行:`git clone https://github.com/nonjene/page_analysis.git` 
2. 然后 `npm install` 
3. 然后 `npm run build` 
4. 然后 `npm start` (页面端口默认`3005`, 如需更换,如`80` 请先输入:`export PORT=80`)
5. 然后即可访问页面:`http://localhost:3005/pageTest.html`
    
