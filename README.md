# EverlastingSummerWasm
## 基于WASM的永恒之夏网页移植


## 相比Steam版的改动
使用[un.rpyc](https://github.com/CensoredUsername/unrpyc)和[unrpa](https://github.com/Lattyware/unrpa)对最新Steam版本解包得到工程文件  
使用`Ren'Py`7.4.11打包为网页版  
移除创意工坊相关文件支持（网页无法支持读写外部文件）  
移除多语言仅保留简体中文（WASM版无法重载，无法实现多语言）  
为控制包大小微调字体  
高质量有损压缩大部分图片资源  
有损压缩所有`mp3`音频为128kbps  
有损压缩所有`ogg`音频到`opus`编码  



## 关于许可
本项目使用`GPLv3`，因为永恒之夏本身使用`CC-BY-SA 4.0`，参考[此链接](https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software)可知该协议与`GPLv3`单向兼容，故选取`GPLv3`作为本项目协议  
