const sleep = delay => new Promise((resolve) => setTimeout(resolve, delay))
const init = async () => {
    if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
        await navigator.serviceWorker.register('./sw.js', { scope: '/' });
        document.getElementById("status").innerText="正在安装Service Worker..."
        await sleep(3000)
        document.location.reload();
    }
    if (navigator.userAgent.indexOf("WOW64") > 1) {
        alert("你正在64位操作系统上使用32位浏览器!\n为了更快的访问速度请改用64位浏览器!")
    }
    let renpyScript = document.createElement("script");
    document.body.appendChild(renpyScript);
    renpyScript.src = "./index.js";
    document.getElementById("status").innerText="正在加载Ren'Py..."
};
init();