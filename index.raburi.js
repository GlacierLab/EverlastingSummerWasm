const RABURI_CONFIG = {
    css: ["index.css"],
    js: ["index.stage1.js", "pythonhome-data.js", "pyapp-data.js", "index.stage2.js", "index.js"],
    sw: "sw.js",
    html: `  <div id="statusbar_container">
    <div id="statusbar">
      <div class="spinner" id='spinner'></div>
      <div style="margin-left: 50px;">
        <div class="emscripten" id="status">加载核心模块...</div>
        <progress value="0" max="100" id="progress" hidden=1></progress>
      </div>
    </div>
  </div>
  <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()" tabindex=-1></canvas>
  <div id="ContextContainer">
    <a id="ContextButton">&#8801;</a><br />
    <div id="ContextMenu" style="display: none;">
      <input id="ID_SavegamesImport" type="file" onchange="onSavegamesImport(this)" accept="application/zip"
        style=display:none></input>
      <a href="javascript:document.getElementById('ID_SavegamesImport').click();">导入存档</a><br>
      <a href="javascript:onSavegamesExport();">导出存档</a><br>
      <a href="javascript:FSDownload('/log.txt', 'text/plain');">Ren'Py日志</a><br>
      <a href="https://github.com/GlacierLab/EverlastingSummerWasm">开源仓库</a><br>
      <a href="https://qinlili.bid">琴梨梨</a><br>
      <a href="https://renpy.beuc.net/" target="_blank">
        <span style="font-size: smaller">
          <span style="color: dimgrey">Powered by</span>
          RenPyWeb
        </span>
      </a>
      </span>
    </div>
  </div>`
};
console.log("Raburi Loader 1.0 - Qinlili");
const sleep = delay => new Promise((resolve) => setTimeout(resolve, delay));
const loadScriptAsync = link => {
    return new Promise(resolve => {
        let script = document.createElement("script");
        script.src = link;
        script.defer = true;
        script.onload = resolve;
        document.body.appendChild(script);
    });
};
const loadCssAsync = link => {
    return new Promise(resolve => {
        let script = document.createElement("link");
        script.rel = "stylesheet";
        script.type = "text/css";
        script.href = link;
        script.onload = resolve;
        document.head.appendChild(script);
    });
};
const raburi = document.getElementById("raburi");
const typing = document.getElementById("typing");
const init = async () => {
    if (navigator.userAgent.indexOf("WOW64") > 1) {
        alert("你正在64位操作系统上使用32位浏览器!\n为了更快的访问速度请改用64位浏览器!")
    };
    if (RABURI_CONFIG.sw && navigator.serviceWorker && !navigator.serviceWorker.controller) {
        typing.innerText = "安装Service Worker...";
        await navigator.serviceWorker.register('./sw.js', { scope: '/' });
        await sleep(3000)
        document.location.reload();
        return;
    };
    if (RABURI_CONFIG.css) {
        for (let i = 0; RABURI_CONFIG.css[i]; i++) {
            typing.innerText = "加载界面样式..." + String(i / RABURI_CONFIG.css.length * 100).substring(0, 4) + "%";
            await loadCssAsync(RABURI_CONFIG.css[i])
        }
        if (RABURI_CONFIG.html) {
            document.body.insertAdjacentHTML("beforeend", RABURI_CONFIG.html)
        }
    };
    if (RABURI_CONFIG.js) {
        for (let i = 0; RABURI_CONFIG.js[i]; i++) {
            typing.innerText = "加载程序模块..." + String(i / RABURI_CONFIG.js.length * 100).substring(0, 4) + "%";
            await loadScriptAsync(RABURI_CONFIG.js[i])
        }
    };
};
init();