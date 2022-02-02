const sleep = delay => new Promise((resolve) => setTimeout(resolve, delay))
const rawOpen = window.open;
window.open = (url, target, feature) => {
    if (url.indexOf("player.html") > 1) {
        var videoFrame = document.createElement("iframe");
        videoFrame.frameBorder = 0;
        videoFrame.style = "z-index:9999;position:fixed;backdrop-filter: blur(10px) brightness(100%);background-color: rgba(255, 255, 255, .6);width:100%;margin-top:0px;height:100%;left:0px;right:0px;top:0px;";
        document.body.appendChild(videoFrame);
        var clsBtn = document.createElement("img");
        clsBtn.style = "z-index:10000;filter: invert(100%);position:fixed;display: inline-block;right:0px;top:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
        clsBtn.className = "barBtn"
        clsBtn.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMiwzLjQxbC01LjI5LDUuMjlMMjAsMTJoLThWNGwzLjI5LDMuMjlMMjAuNTksMkwyMiwzLjQxeiBNMy40MSwyMmw1LjI5LTUuMjlMMTIsMjB2LThINGwzLjI5LDMuMjlMMiwyMC41OUwzLjQxLDIyeiIvPjwvc3ZnPg==";
        document.body.appendChild(clsBtn);
        clsBtn.onclick = function () {
            document.body.removeChild(videoFrame);
            document.body.removeChild(clsBtn);
        }
        videoFrame.src = url;
    } else {
        rawOpen(url, target, feature);
    }
}
const init = async () => {
    if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
        await navigator.serviceWorker.register('./sw.js', { scope: '/' });
        document.getElementById("status").innerText = "正在安装Service Worker..."
        await sleep(3000)
        document.location.reload();
    }
    if (navigator.userAgent.indexOf("WOW64") > 1) {
        alert("你正在64位操作系统上使用32位浏览器!\n为了更快的访问速度请改用64位浏览器!")
    }
    let renpyScript = document.createElement("script");
    document.body.appendChild(renpyScript);
    renpyScript.src = "./index.js";
    document.getElementById("status").innerText = "正在加载Ren'Py..."
};
init();