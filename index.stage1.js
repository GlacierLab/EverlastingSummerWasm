// Subtly hint at lack of WebAssembly support (if applicable)
if (typeof WebAssembly !== "object") {
  var error_message = "请更新你的浏览器，确保有WASM支持";
  document.body = document.createElement("body");
  document.body.innerHTML = error_message.replace("\n", "<br />");
  location.href =
    'javascript:alert("' + error_message.replace("\n", "\\n") + '")';
  throw error_message;
  window.stop();
  // R.I.P.
}
// Work-around iframe focus
// https://github.com/emscripten-core/emscripten/pull/7631
document.getElementById("canvas").addEventListener("mouseenter", function (e) {
  window.focus();
});
document.getElementById("canvas").addEventListener("click", function (e) {
  window.focus();
});

/* Copyright (C) 2018, 2019, 2020, 2021  Sylvain Beucler */

/* Context menu */
document
  .getElementById("ContextButton")
  .addEventListener("click", function (e) {
    var menu = document.getElementById("ContextMenu");
    if (menu.style.display == "none") menu.style.display = "block";
    else menu.style.display = "none";
    e.preventDefault();
  });

function onSavegamesImport(input) {
  reader = new FileReader();
  reader.onload = function (e) {
    FS.writeFile("savegames.zip", new Uint8Array(e.target.result));
    Module._emSavegamesImport();
    FS.syncfs(false, function (err) {
      if (err) {
        console.trace();
        console.log(err, err.message);
        Module.print(
          "Warning: cannot import savegames: write error: " + err.message + "\n"
        );
      } else {
        Module.print("Saves imported - restart game to apply.\n");
      }
    });
  };
  reader.readAsArrayBuffer(input.files[0]);
  input.type = "";
  input.type = "file"; // reset field
}

function onSavegamesExport() {
  ret = Module._emSavegamesExport();
  if (ret) {
    FSDownload("savegames.zip", "application/zip");
  }
}

function gameExtractAndRun() {
  start = Date.now();
  var ret = Module.ccall(
    "PyRun_SimpleString",
    "number",
    ["string"],
    [
      "import zipfile\n" +
        "zip_ref = zipfile.ZipFile('game.zip', 'r')\n" +
        "zip_ref.extractall('.')\n" +
        "zip_ref.close()\n",
    ]
  );
  if (ret != 0) {
    Module.setStatus("Error extracting .zip.");
    return;
  }
  FS.unlink("/game.zip");
  typing.innerText = "正在载入游戏...";

  if (FS.readdir("/").indexOf("game") < 0) {
    Module.setStatus("Invalid .zip (no top-level 'game' directory).");
    return;
  }

  // presplash
  presplash = undefined;
  if (FS.readdir("/").indexOf("web-presplash.png") >= 0) {
    presplash = FS.readFile("/web-presplash.png");
  } else if (FS.readdir("/").indexOf("web-presplash.jpg") >= 0) {
    presplash = FS.readFile("/web-presplash.jpg");
  } else if (FS.readdir("/").indexOf("web-presplash.webp") >= 0) {
    presplash = FS.readFile("/web-presplash.webp");
  } else if (FS.readdir("/").indexOf("web-presplash-default.jpg") >= 0) {
    presplash = FS.readFile("/web-presplash-default.jpg");
  }

  // give control back to webui before running main
  window.setTimeout(function () {
    Module.ccall("pyapp_runmain", "", [], [], { async: true });
  }, 200); // smaller delay doesn't update the DOM, esp. on mobile
}

// hook for Ren'Py
function presplashEnd() {
  raburi.style.display = "none";
}
function FSDownload(filename, mimetype) {
  console.log("download", filename);
  var a = document.createElement("a");
  a.download = filename.replace(/.*\//, "");
  try {
    a.href = window.URL.createObjectURL(
      new Blob([FS.readFile(filename)], { type: mimetype || "" })
    );
  } catch (e) {
    Module.print("Error opening " + filename + "\n");
    return;
  }
  document.body.appendChild(a);
  a.click();
  // delay clean-up to avoid iOS issue:
  // The operation couldn’t be completed. (WebKitBlobResourse error 1.)
  setTimeout(function () {
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }, 1000);
}

var statusElement = document.getElementById("status");
var progressElement = document.getElementById("progress");
var spinnerElement = document.getElementById("spinner");

var Module = {
  preRun: [],
  postRun: [],
  print: (function () {
    var element = document.getElementById("status");
    return function (text) {
      if (arguments.length > 1)
        text = Array.prototype.slice.call(arguments).join(" ");
      console.log(text);
      // These replacements are necessary if you render to raw HTML
      text = String(text);
      text = text.replace(/&/g, "&amp;");
      text = text.replace(/</g, "&lt;");
      text = text.replace(/>/g, "&gt;");
      text = text.replace("\n", "<br />", "g");
      element.innerHTML += text;

      statusbar = document.getElementById("statusbar");
      statusbar.hidden = false;
      var print_date = new Date();
      statusbar.date = print_date;
      window.setTimeout(function () {
        // Hide status bar after a few seconds - only if setStatus isn't active
        if (
          Module.setStatus.last &&
          Module.setStatus.last.text == "" &&
          statusbar.date == print_date
        ) {
          element.innerHTML = "";
          statusbar.hidden = true;
        }
      }, 3000);
    };
  })(),
  printErr: function (text) {
    if (arguments.length > 1)
      text = Array.prototype.slice.call(arguments).join(" ");
    if (0) {
      // XXX disabled for safety typeof dump == 'function') {
      dump(text + "\n"); // fast, straight to the real console
    } else {
      console.error(text);
    }
  },
  canvas: (function () {
    var canvas = document.getElementById("canvas");

    // As a default initial behavior, pop up an alert when webgl context is lost. To make your
    // application robust, you may want to override this behavior before shipping!
    // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
    canvas.addEventListener(
      "webglcontextlost",
      function (e) {
        alert("WebGL context lost. You will need to reload the page.");
        e.preventDefault();
      },
      false
    );

    return canvas;
  })(),
  setStatus: function (text) {
    if (!Module.setStatus.last)
      Module.setStatus.last = { time: Date.now(), text: "" };
    if (text === Module.setStatus.last.text) return;
    var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    var now = Date.now();
    if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
    Module.setStatus.last.time = now;
    Module.setStatus.last.text = text;
    if (m) {
      text = m[1];
      progressElement.value = parseInt(m[2]) * 100;
      progressElement.max = parseInt(m[4]) * 100;
      progressElement.hidden = false;
      spinnerElement.hidden = false;
    } else {
      progressElement.value = null;
      progressElement.max = null;
      progressElement.hidden = true;
      if (!text) spinnerElement.style.display = "none";
    }
    if (text == "") {
      statusElement.innerHTML = "";
      document.getElementById("statusbar").hidden = true;
    } else {
      statusElement.innerHTML = text + "<br />";
      document.getElementById("statusbar").hidden = false;
    }
  },
  totalDependencies: 0,
  monitorRunDependencies: function (left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    typing.innerText = left
      ? "加载WASM模块... " +
        String(
          ((this.totalDependencies - left) / this.totalDependencies) * 100
        ).substring(0, 4) +
        "%"
      : "WASM模块加载完成";
  },
};
Module.setStatus("下载中...");
window.onerror = function (event) {
  // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
  //Module.setStatus('Exception thrown, see JavaScript console');
  // Explicitly display meaningful errors such as "uncaught exception: out of memory":

  var appleWarning = "";

  if (/RangeError/.test(event)) {
    appleWarning =
      "\n<p>This is a known issue in Safari and Webkit browsers. Please report this issue to Apple.";
  }

  Module.setStatus(
    "Error: " +
      event.split("\n")[0] +
      " (see JavaScript console for details)" +
      appleWarning
  );
  spinnerElement.style.display = "none";
  Module.setStatus = function (text) {
    if (text) Module.printErr("[post-exception status] " + text);
  };
};

window.DEFAULT_GAME_FILENAME = "game.zip";
const rawOpen = window.open;
window.open = (url, target, feature) => {
  if (url.indexOf("player.html") > 1) {
    var videoFrame = document.createElement("iframe");
    videoFrame.frameBorder = 0;
    videoFrame.style =
      "z-index:9999;position:fixed;backdrop-filter: blur(10px) brightness(100%);background-color: rgba(255, 255, 255, .6);width:100%;margin-top:0px;height:100%;left:0px;right:0px;top:0px;";
    document.body.appendChild(videoFrame);
    var clsBtn = document.createElement("img");
    clsBtn.style =
      "z-index:10000;filter: invert(100%);position:fixed;display: inline-block;right:0px;top:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;";
    clsBtn.className = "barBtn";
    clsBtn.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMiwzLjQxbC01LjI5LDUuMjlMMjAsMTJoLThWNGwzLjI5LDMuMjlMMjAuNTksMkwyMiwzLjQxeiBNMy40MSwyMmw1LjI5LTUuMjlMMTIsMjB2LThINGwzLjI5LDMuMjlMMiwyMC41OUwzLjQxLDIyeiIvPjwvc3ZnPg==";
    document.body.appendChild(clsBtn);
    clsBtn.onclick = function () {
      document.body.removeChild(videoFrame);
      document.body.removeChild(clsBtn);
    };
    videoFrame.src = url;
  } else {
    rawOpen(url, target, feature);
  }
};
