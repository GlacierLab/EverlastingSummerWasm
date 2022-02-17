# EverlastingSummerWasm
## 基于WASM的永恒之夏网页移植
[itch.io项目页](https://qinlili23333.itch.io/everlasting-summer-online)  
<br>

## 马上在线体验
[琴梨梨自建](https://es.qinlili.bid)（PWA支持完善，省流量）  
[Github Pages](https://185-199-109-153.dynamic-ip.hinet.net/)（PWA支持完善，慢一些）  
[itch.io](https://v6p9d9t4.ssl.hwcdn.net/html/5189756/index.html)（部分地区直连更快）  

## 相比Steam版的改动
使用[un.rpyc](https://github.com/CensoredUsername/unrpyc)和[unrpa](https://github.com/Lattyware/unrpa)对最新Steam版本解包得到工程文件  
使用`Ren'Py`7.4.11打包为网页版  
移除创意工坊相关文件支持（网页无法支持读写外部文件）  
移除多语言仅保留简体中文（WASM版无法重载，无法实现多语言）  
为控制包大小微调字体  
高质量有损压缩大部分图片资源  
有损压缩所有`mp3`音频为128kbps  
有损压缩所有`ogg`音频到`opus`编码  
为确保合规性移除了一些原版内并没有用到的R18素材（Steam版本来也有屏蔽，不影响游戏流程）  



## 关于许可
本项目使用`GPLv3`，因为永恒之夏本身使用`CC-BY-SA 4.0`，参考[此链接](https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software)可知该协议与`GPLv3`单向兼容，故选取`GPLv3`作为本项目协议  

## 本项目使用以下开源软件施工
##### `本项目操作过程未使用任何闭源软件，开源让本项目的制作不产生任何版权风险和费用，开源万岁！`
rpyc反编译：[un.rpyc](https://github.com/CensoredUsername/unrpyc)  
rpa解包：[unrpa](https://github.com/Lattyware/unrpa)  
游戏引擎：[Ren'Py](https://www.renpy.org/)  
音频处理：[ffmpeg](https://www.ffmpeg.org/)  
代码编辑：[VS Code](https://code.visualstudio.com/)  
图片压缩：[Caesium - Image Compressor](https://github.com/Lymphatus/caesium-image-compressor)  
图片压缩：[limitPNG](https://github.com/nullice/limitPNG)  
浏览器：[Chromium](https://www.chromium.org/chromium-projects/)  
浏览器：[Firefox](https://www.mozilla.org/zh-CN/firefox/new)  
