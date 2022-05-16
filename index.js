var Module = typeof Module !== "undefined" ? Module : {};
Module["onRuntimeInitialized"] = function () {
  _GET = {};
  if (location.search.length > 0) {
    location.search
      .substr(1)
      .split("&")
      .forEach(function (item) {
        _GET[item.split("=")[0]] = item.split("=")[1];
      });
  }
  var url = DEFAULT_GAME_FILENAME;
  if (_GET["game"]) {
    if (_GET["game"].match(/^[0-9a-z._-]+$/i)) {
      url = _GET["game"];
    } else {
      throw "Invalid game filename.";
    }
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onprogress = function (event) {
    var size = -1;
    if (event.total) size = event.total;
    if (event.loaded) {
      if (!xhr.addedTotal) {
        xhr.addedTotal = true;
        if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
        Module.dataFileDownloads[url] = { loaded: event.loaded, total: size };
      } else {
        Module.dataFileDownloads[url].loaded = event.loaded;
      }
      var total = 0;
      var loaded = 0;
      var num = 0;
      for (var download in Module.dataFileDownloads) {
        var data = Module.dataFileDownloads[download];
        total += data.total;
        loaded += data.loaded;
        num++;
      }
      total = Math.ceil((total * Module.expectedDataFileDownloads) / num);
      typing.innerText =
        "下载基础资源包..." + String((loaded / size) * 100).substring(0, 4)+"%";
    } else if (!Module.dataFileDownloads) {
      typing.innerText = "下载基础资源包...";
    }
  };
  xhr.onerror = function (event) {
    console.log(xhr);
    console.log(event);
    Module.print(
      "Cannot download Story. Maybe the download was blocked, see the JavaScript console for more information.\n"
    );
  };
  xhr.onload = function (event) {
    if (
      xhr.status == 200 ||
      xhr.status == 304 ||
      xhr.status == 206 ||
      (xhr.status == 0 && xhr.response)
    ) {
      FS.writeFile("game.zip", new Uint8Array(xhr.response), { canOwn: true });
      typing.innerText = "解压基础资源包...";
      window.setTimeout(function () {
        gameExtractAndRun();
      }, 100);
    } else {
      console.log(xhr);
      console.log(event);
      Module.print(
        "Error while downloading Story " +
          xhr.responseURL +
          " : " +
          xhr.statusText +
          " (status code " +
          xhr.status +
          ")\n"
      );
    }
  };
  xhr.send(null);
};
Module["quit"] = function () {
  console.log("RenPyWeb: quit");
  Module["setStatus"]("Bye!");
  if (noExitRuntime) {
    noExitRuntime = false;
    exit(0);
  }
};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function (status, toThrow) {
  throw toThrow;
};
var ENVIRONMENT_IS_WEB = true;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}
var read_, readAsync, readBinary, setWindowTitle;
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = self.location.href;
  } else if (typeof document !== "undefined" && document.currentScript) {
    scriptDirectory = document.currentScript.src;
  }
  if (scriptDirectory.indexOf("blob:") !== 0) {
    scriptDirectory = scriptDirectory.substr(
      0,
      scriptDirectory.lastIndexOf("/") + 1
    );
  } else {
    scriptDirectory = "";
  }
  {
    read_ = function (url) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send(null);
      return xhr.responseText;
    };
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(xhr.response);
      };
    }
    readAsync = function (url, onload, onerror) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
          onload(xhr.response);
          return;
        }
        onerror();
      };
      xhr.onerror = onerror;
      xhr.send(null);
    };
  }
  setWindowTitle = function (title) {
    document.title = title;
  };
} else {
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (Module["quit"]) quit_ = Module["quit"];
var STACK_ALIGN = 16;
function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN;
  return Math.ceil(size / factor) * factor;
}
function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}
var tempRet0 = 0;
var setTempRet0 = function (value) {
  tempRet0 = value;
};
var getTempRet0 = function () {
  return tempRet0;
};
var compilerSettings = {
  ASSERTIONS: 0,
  RUNTIME_LOGGING: 0,
  STACK_OVERFLOW_CHECK: 0,
  VERBOSE: 0,
  INVOKE_RUN: 1,
  EXIT_RUNTIME: 0,
  MEM_INIT_METHOD: 1,
  TOTAL_STACK: 5242880,
  MALLOC: "dlmalloc",
  ABORTING_MALLOC: 0,
  INITIAL_MEMORY: 134217728,
  MAXIMUM_MEMORY: 2147483648,
  ALLOW_MEMORY_GROWTH: 1,
  MEMORY_GROWTH_GEOMETRIC_STEP: 0.2,
  MEMORY_GROWTH_GEOMETRIC_CAP: 100663296,
  MEMORY_GROWTH_LINEAR_STEP: -1,
  MEMORY64: 0,
  INITIAL_TABLE: -1,
  ALLOW_TABLE_GROWTH: 0,
  GLOBAL_BASE: 1024,
  USE_CLOSURE_COMPILER: 0,
  CLOSURE_WARNINGS: "quiet",
  IGNORE_CLOSURE_COMPILER_ERRORS: 0,
  DECLARE_ASM_MODULE_EXPORTS: 1,
  INLINING_LIMIT: 0,
  SUPPORT_BIG_ENDIAN: 0,
  SAFE_HEAP: 0,
  SAFE_HEAP_LOG: 0,
  EMULATE_FUNCTION_POINTER_CASTS: 1,
  EXCEPTION_DEBUG: 0,
  DEMANGLE_SUPPORT: 0,
  LIBRARY_DEBUG: 0,
  SYSCALL_DEBUG: 0,
  SOCKET_DEBUG: 0,
  DYLINK_DEBUG: 0,
  SOCKET_WEBRTC: 0,
  WEBSOCKET_URL: "ws:#",
  PROXY_POSIX_SOCKETS: 0,
  WEBSOCKET_SUBPROTOCOL: "binary",
  OPENAL_DEBUG: 0,
  WEBSOCKET_DEBUG: 0,
  GL_ASSERTIONS: 0,
  TRACE_WEBGL_CALLS: 0,
  GL_DEBUG: 0,
  GL_TESTING: 0,
  GL_MAX_TEMP_BUFFER_SIZE: 2097152,
  GL_UNSAFE_OPTS: 1,
  FULL_ES2: 1,
  GL_EMULATE_GLES_VERSION_STRING_FORMAT: 1,
  GL_EXTENSIONS_IN_PREFIXED_FORMAT: 1,
  GL_SUPPORT_AUTOMATIC_ENABLE_EXTENSIONS: 1,
  GL_SUPPORT_SIMPLE_ENABLE_EXTENSIONS: 1,
  GL_TRACK_ERRORS: 1,
  GL_SUPPORT_EXPLICIT_SWAP_CONTROL: 0,
  GL_POOL_TEMP_BUFFERS: 1,
  WORKAROUND_OLD_WEBGL_UNIFORM_UPLOAD_IGNORED_OFFSET_BUG: 0,
  GL_EXPLICIT_UNIFORM_LOCATION: 0,
  GL_EXPLICIT_UNIFORM_BINDING: 0,
  USE_WEBGL2: 0,
  MIN_WEBGL_VERSION: 1,
  MAX_WEBGL_VERSION: 2,
  WEBGL2_BACKWARDS_COMPATIBILITY_EMULATION: 0,
  FULL_ES3: 0,
  LEGACY_GL_EMULATION: 0,
  GL_FFP_ONLY: 0,
  GL_PREINITIALIZED_CONTEXT: 0,
  USE_WEBGPU: 0,
  STB_IMAGE: 0,
  GL_DISABLE_HALF_FLOAT_EXTENSION_IF_BROKEN: 0,
  GL_WORKAROUND_SAFARI_GETCONTEXT_BUG: 1,
  JS_MATH: 0,
  POLYFILL_OLD_MATH_FUNCTIONS: 0,
  LEGACY_VM_SUPPORT: 0,
  ENVIRONMENT: "web",
  LZ4: 1,
  DISABLE_EXCEPTION_CATCHING: 1,
  NODEJS_CATCH_EXIT: 1,
  NODEJS_CATCH_REJECTION: 1,
  ASYNCIFY: 1,
  ASYNCIFY_IGNORE_INDIRECT: 1,
  ASYNCIFY_STACK_SIZE: 65535,
  ASYNCIFY_ADVISE: 0,
  ASYNCIFY_LAZY_LOAD_CODE: 0,
  ASYNCIFY_DEBUG: 0,
  CASE_INSENSITIVE_FS: 0,
  FILESYSTEM: 1,
  FORCE_FILESYSTEM: 1,
  NODERAWFS: 0,
  NODE_CODE_CACHING: 0,
  EXPORT_ALL: 0,
  RETAIN_COMPILER_SETTINGS: 1,
  INCLUDE_FULL_LIBRARY: 0,
  SHELL_FILE: 0,
  RELOCATABLE: 0,
  MAIN_MODULE: 0,
  SIDE_MODULE: 0,
  BUILD_AS_WORKER: 0,
  PROXY_TO_WORKER: 0,
  PROXY_TO_WORKER_FILENAME: "",
  PROXY_TO_PTHREAD: 0,
  LINKABLE: 0,
  STRICT: 0,
  IGNORE_MISSING_MAIN: 1,
  AUTO_ARCHIVE_INDEXES: 1,
  STRICT_JS: 0,
  WARN_ON_UNDEFINED_SYMBOLS: 1,
  ERROR_ON_UNDEFINED_SYMBOLS: 1,
  SMALL_XHR_CHUNKS: 0,
  HEADLESS: 0,
  DETERMINISTIC: 0,
  MODULARIZE: 0,
  EXPORT_ES6: 0,
  USE_ES6_IMPORT_META: 1,
  BENCHMARK: 0,
  EXPORT_NAME: "Module",
  DYNAMIC_EXECUTION: 1,
  BOOTSTRAPPING_STRUCT_INFO: 0,
  EMSCRIPTEN_TRACING: 0,
  USE_GLFW: 2,
  WASM: 1,
  STANDALONE_WASM: 0,
  BINARYEN_IGNORE_IMPLICIT_TRAPS: 0,
  BINARYEN_EXTRA_PASSES: "",
  WASM_ASYNC_COMPILATION: 1,
  DYNCALLS: 1,
  WASM_BIGINT: 0,
  EMIT_PRODUCERS_SECTION: 0,
  EMIT_EMSCRIPTEN_METADATA: 0,
  EMIT_EMSCRIPTEN_LICENSE: 0,
  LEGALIZE_JS_FFI: 1,
  USE_SDL: 2,
  USE_SDL_GFX: 0,
  USE_SDL_IMAGE: 1,
  USE_SDL_TTF: 1,
  USE_SDL_NET: 1,
  USE_ICU: 0,
  USE_ZLIB: 0,
  USE_BZIP2: 0,
  USE_GIFLIB: 0,
  USE_LIBJPEG: 0,
  USE_LIBPNG: 0,
  USE_REGAL: 0,
  USE_BOOST_HEADERS: 0,
  USE_BULLET: 0,
  USE_VORBIS: 0,
  USE_OGG: 0,
  USE_MPG123: 0,
  USE_FREETYPE: 0,
  USE_SDL_MIXER: 1,
  USE_HARFBUZZ: 0,
  USE_COCOS2D: 0,
  USE_MODPLUG: 0,
  IN_TEST_HARNESS: 0,
  USE_PTHREADS: 0,
  PTHREAD_POOL_SIZE: "",
  PTHREAD_POOL_SIZE_STRICT: 1,
  PTHREAD_POOL_DELAY_LOAD: 0,
  DEFAULT_PTHREAD_STACK_SIZE: 2097152,
  PTHREADS_PROFILING: 0,
  ALLOW_BLOCKING_ON_MAIN_THREAD: 1,
  PTHREADS_DEBUG: 0,
  EVAL_CTORS: 0,
  TEXTDECODER: 1,
  EMBIND_STD_STRING_IS_UTF8: 1,
  OFFSCREENCANVAS_SUPPORT: 0,
  OFFSCREENCANVASES_TO_PTHREAD: "#canvas",
  OFFSCREEN_FRAMEBUFFER: 0,
  FETCH_SUPPORT_INDEXEDDB: 1,
  FETCH_DEBUG: 0,
  FETCH: 0,
  ASMFS: 0,
  SINGLE_FILE: 0,
  AUTO_JS_LIBRARIES: 1,
  AUTO_NATIVE_LIBRARIES: 1,
  MIN_FIREFOX_VERSION: 65,
  MIN_SAFARI_VERSION: 12e4,
  MIN_IE_VERSION: 2147483647,
  MIN_EDGE_VERSION: 44,
  MIN_CHROME_VERSION: 75,
  SUPPORT_ERRNO: 1,
  MINIMAL_RUNTIME: 0,
  MINIMAL_RUNTIME_STREAMING_WASM_COMPILATION: 0,
  MINIMAL_RUNTIME_STREAMING_WASM_INSTANTIATION: 0,
  USES_DYNAMIC_ALLOC: 1,
  SUPPORT_LONGJMP: 1,
  DISABLE_DEPRECATED_FIND_EVENT_TARGET_BEHAVIOR: 1,
  HTML5_SUPPORT_DEFERRING_USER_SENSITIVE_REQUESTS: 1,
  MINIFY_HTML: 0,
  MAYBE_WASM2JS: 0,
  ASAN_SHADOW_SIZE: -1,
  DISABLE_EXCEPTION_THROWING: 0,
  USE_OFFSET_CONVERTER: 0,
  LLD_REPORT_UNDEFINED: 0,
  DEFAULT_TO_CXX: 1,
  PRINTF_LONG_DOUBLE: 0,
  WASM2C: 0,
  WASM2C_SANDBOXING: "full",
  SEPARATE_DWARF_URL: "",
  ERROR_ON_WASM_CHANGES_AFTER_LINK: 0,
  ABORT_ON_WASM_EXCEPTIONS: 0,
  PURE_WASI: 0,
  IMPORTED_MEMORY: 0,
  SPLIT_MODULE: 0,
  REVERSE_DEPS: "auto",
  OFFSCREEN_FRAMEBUFFER_FORBID_VAO_PATH: 0,
  TEST_MEMORY_GROWTH_FAILS: 0,
  TARGET_BASENAME: "index",
  SYSCALLS_REQUIRE_FILESYSTEM: 1,
  AUTODEBUG: 0,
  WASM2JS: 0,
  UBSAN_RUNTIME: 0,
  USE_LSAN: 0,
  USE_ASAN: 0,
  LOAD_SOURCE_MAP: 0,
  EMBIND: 0,
  MAIN_READS_PARAMS: 1,
  FETCH_WORKER_FILE: "",
  WASI_MODULE_NAME: "wasi_snapshot_preview1",
  EMSCRIPTEN_VERSION: "2.0.20",
  USE_RTTI: 1,
  OPT_LEVEL: 3,
  DEBUG_LEVEL: 0,
  SHRINK_LEVEL: 0,
  EMIT_SYMBOL_MAP: 1,
  WASM_BINARY_FILE: "index.wasm",
  PTHREAD_WORKER_FILE: "",
  SOURCE_MAP_BASE: "",
  SUPPORT_BASE64_EMBEDDING: 0,
  MINIFY_WASM_IMPORTS_AND_EXPORTS: 1,
  MINIFY_WASM_IMPORTED_MODULES: 1,
  MINIFY_ASMJS_EXPORT_NAMES: 1,
  TARGET_NOT_SUPPORTED: 2147483647,
  LTO: 0,
  CAN_ADDRESS_2GB: 0,
  SEPARATE_DWARF: 0,
  EXCEPTION_HANDLING: 0,
  ONLY_CALC_JS_SYMBOLS: 0,
  EXPECT_MAIN: 1,
  EXPORT_READY_PROMISE: 1,
  MEMORYPROFILER: 0,
  GENERATE_SOURCE_MAP: 0,
  STACK_BASE: 0,
  STACK_MAX: 0,
  HEAP_BASE: 0,
  AGGRESSIVE_VARIABLE_ELIMINATION: 0,
  ALIASING_FUNCTION_POINTERS: 0,
  ASM_JS: 1,
  BINARYEN: 1,
  BINARYEN_ASYNC_COMPILATION: 1,
  BINARYEN_MEM_MAX: 2147483648,
  BINARYEN_METHOD: "native-wasm",
  BINARYEN_PASSES: "",
  BINARYEN_SCRIPTS: "",
  BINARYEN_TRAP_MODE: -1,
  BUILD_AS_SHARED_LIB: 0,
  DOUBLE_MODE: 0,
  ELIMINATE_DUPLICATE_FUNCTIONS: 0,
  ELIMINATE_DUPLICATE_FUNCTIONS_DUMP_EQUIVALENT_FUNCTIONS: 0,
  ELIMINATE_DUPLICATE_FUNCTIONS_PASSES: 5,
  EMITTING_JS: 1,
  ERROR_ON_MISSING_LIBRARIES: 1,
  EXPORT_BINDINGS: 0,
  EXPORT_FUNCTION_TABLES: 0,
  FAST_UNROLLED_MEMCPY_AND_MEMSET: 0,
  FINALIZE_ASM_JS: 0,
  FORCE_ALIGNED_MEMORY: 0,
  FUNCTION_POINTER_ALIGNMENT: 2,
  MEMFS_APPEND_TO_TYPED_ARRAYS: 1,
  MEMORY_GROWTH_STEP: -1,
  PGO: 0,
  PRECISE_F32: 0,
  PRECISE_I64_MATH: 1,
  QUANTUM_SIZE: 4,
  RESERVED_FUNCTION_POINTERS: 0,
  RUNNING_JS_OPTS: 0,
  SAFE_SPLIT_MEMORY: 0,
  SAFE_STACK: 0,
  SEPARATE_ASM: 0,
  SEPARATE_ASM_MODULE_NAME: "",
  SIMPLIFY_IFS: 1,
  SKIP_STACK_IN_SMALL: 0,
  SPLIT_MEMORY: 0,
  SWAPPABLE_ASM_MODULE: 0,
  TOTAL_MEMORY: 134217728,
  UNALIGNED_MEMORY: 0,
  WARN_UNALIGNED: 0,
  WASM_BACKEND: -1,
  WASM_MEM_MAX: 2147483648,
  WASM_OBJECT_FILES: 0,
  WORKAROUND_IOS_9_RIGHT_SHIFT_BUG: 0,
  RUNTIME_DEBUG: 0,
  STACK_ALIGN: 16,
  GL_POOL_TEMP_BUFFERS_SIZE: 288,
};
function getCompilerSetting(name) {
  if (!(name in compilerSettings)) return "invalid compiler setting: " + name;
  return compilerSettings[name];
}
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime = Module["noExitRuntime"] || true;
if (typeof WebAssembly !== "object") {
  abort("no native wasm support detected");
}
function setValue(ptr, value, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      HEAP8[ptr >> 0] = value;
      break;
    case "i8":
      HEAP8[ptr >> 0] = value;
      break;
    case "i16":
      HEAP16[ptr >> 1] = value;
      break;
    case "i32":
      HEAP32[ptr >> 2] = value;
      break;
    case "i64":
      (tempI64 = [
        value >>> 0,
        ((tempDouble = value),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[ptr >> 2] = tempI64[0]),
        (HEAP32[(ptr + 4) >> 2] = tempI64[1]);
      break;
    case "float":
      HEAPF32[ptr >> 2] = value;
      break;
    case "double":
      HEAPF64[ptr >> 3] = value;
      break;
    default:
      abort("invalid type for setValue: " + type);
  }
}
var wasmMemory;
var ABORT = false;
var EXITSTATUS;
function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}
function getCFunc(ident) {
  var func = Module["_" + ident];
  assert(
    func,
    "Cannot call unknown function " + ident + ", make sure it is exported"
  );
  return func;
}
function ccall(ident, returnType, argTypes, args, opts) {
  var toC = {
    string: function (str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    array: function (arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    },
  };
  function convertReturnValue(ret) {
    if (returnType === "string") return UTF8ToString(ret);
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  var asyncMode = opts && opts.async;
  var runningAsync = typeof Asyncify === "object" && Asyncify.currData;
  var prevRunningAsync =
    typeof Asyncify === "object" && Asyncify.asyncFinalizers.length > 0;
  if (runningAsync && !prevRunningAsync) {
    return new Promise(function (resolve) {
      Asyncify.asyncFinalizers.push(function (ret) {
        if (stack !== 0) stackRestore(stack);
        resolve(convertReturnValue(ret));
      });
    });
  }
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  if (opts && opts.async) return Promise.resolve(ret);
  return ret;
}
function cwrap(ident, returnType, argTypes, opts) {
  argTypes = argTypes || [];
  var numericArgs = argTypes.every(function (type) {
    return type === "number";
  });
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function () {
    return ccall(ident, returnType, argTypes, arguments, opts);
  };
}
var ALLOC_NORMAL = 0;
var ALLOC_STACK = 1;
function allocate(slab, allocator) {
  var ret;
  if (allocator == ALLOC_STACK) {
    ret = stackAlloc(slab.length);
  } else {
    ret = _malloc(slab.length);
  }
  if (slab.subarray || slab.slice) {
    HEAPU8.set(slab, ret);
  } else {
    HEAPU8.set(new Uint8Array(slab), ret);
  }
  return ret;
}
var UTF8Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = "";
    while (idx < endPtr) {
      var u0 = heap[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heap[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = heap[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
  return str;
}
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343)
      u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
    if (u <= 127) ++len;
    else if (u <= 2047) len += 2;
    else if (u <= 65535) len += 3;
    else len += 4;
  }
  return len;
}
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[buffer++ >> 0] = str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[buffer >> 0] = 0;
}
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module["HEAP8"] = HEAP8 = new Int8Array(buf);
  Module["HEAP16"] = HEAP16 = new Int16Array(buf);
  Module["HEAP32"] = HEAP32 = new Int32Array(buf);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}
var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 134217728;
var wasmTable;
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
  TTY.init();
  SOCKFS.root = FS.mount(SOCKFS, {}, null);
  PIPEFS.root = FS.mount(PIPEFS, {}, null);
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  runtimeExited = true;
}
function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
  return id;
}
function addRunDependency(id) {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }
  what += "";
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
  var e = new WebAssembly.RuntimeError(what);
  throw e;
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
  return filename.startsWith(dataURIPrefix);
}
var wasmBinaryFile = "index.wasm";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}
function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(file);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  } catch (err) {
    abort(err);
  }
}
function getBinaryPromise() {
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch === "function") {
      return fetch(wasmBinaryFile, { credentials: "same-origin" })
        .then(function (response) {
          if (!response["ok"]) {
            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
          }
          return response["arrayBuffer"]();
        })
        .catch(function () {
          return getBinary(wasmBinaryFile);
        });
    }
  }
  return Promise.resolve().then(function () {
    return getBinary(wasmBinaryFile);
  });
}
function createWasm() {
  var info = { a: asmLibraryArg };
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    exports = Asyncify.instrumentWasmExports(exports);
    Module["asm"] = exports;
    wasmMemory = Module["asm"]["bi"];
    updateGlobalBufferAndViews(wasmMemory.buffer);
    wasmTable = Module["asm"]["fi"];
    addOnInit(Module["asm"]["ci"]);
    removeRunDependency("wasm-instantiate");
  }
  addRunDependency("wasm-instantiate");
  function receiveInstantiationResult(result) {
    receiveInstance(result["instance"]);
  }
  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise()
      .then(function (binary) {
        var result = WebAssembly.instantiate(binary, info);
        return result;
      })
      .then(receiver, function (reason) {
        err("failed to asynchronously prepare wasm: " + reason);
        abort(reason);
      });
  }
  function instantiateAsync() {
    if (
      !wasmBinary &&
      typeof WebAssembly.instantiateStreaming === "function" &&
      !isDataURI(wasmBinaryFile) &&
      typeof fetch === "function"
    ) {
      return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(
        function (response) {
          var result = WebAssembly.instantiateStreaming(response, info);
          return result.then(receiveInstantiationResult, function (reason) {
            err("wasm streaming compile failed: " + reason);
            err("falling back to ArrayBuffer instantiation");
            return instantiateArrayBuffer(receiveInstantiationResult);
          });
        }
      );
    } else {
      return instantiateArrayBuffer(receiveInstantiationResult);
    }
  }
  if (Module["instantiateWasm"]) {
    try {
      var exports = Module["instantiateWasm"](info, receiveInstance);
      exports = Asyncify.instrumentWasmExports(exports);
      return exports;
    } catch (e) {
      err("Module.instantiateWasm callback failed with error: " + e);
      return false;
    }
  }
  instantiateAsync();
  return {};
}
var tempDouble;
var tempI64;
var ASM_CONSTS = {
  2714560: function ($0, $1, $2, $3, $4) {
    return Browser.safeSetTimeout(function () {
      dynCall("viiii", $0, [$1, $2, $3, $4]);
    }, $2);
  },
  2714655: function ($0) {
    window.clearTimeout($0);
  },
  2714684: function ($0, $1, $2, $3, $4) {
    return Browser.safeSetTimeout(function () {
      dynCall("viiii", $0, [$1, $2, $3, $4]);
    }, $2);
  },
  2714779: function ($0, $1, $2) {
    var w = $0;
    var h = $1;
    var pixels = $2;
    if (!Module["SDL2"]) Module["SDL2"] = {};
    var SDL2 = Module["SDL2"];
    if (SDL2.ctxCanvas !== Module["canvas"]) {
      SDL2.ctx = Module["createContext"](Module["canvas"], false, true);
      SDL2.ctxCanvas = Module["canvas"];
    }
    if (SDL2.w !== w || SDL2.h !== h || SDL2.imageCtx !== SDL2.ctx) {
      SDL2.image = SDL2.ctx.createImageData(w, h);
      SDL2.w = w;
      SDL2.h = h;
      SDL2.imageCtx = SDL2.ctx;
    }
    var data = SDL2.image.data;
    var src = pixels >> 2;
    var dst = 0;
    var num;
    if (
      typeof CanvasPixelArray !== "undefined" &&
      data instanceof CanvasPixelArray
    ) {
      num = data.length;
      while (dst < num) {
        var val = HEAP32[src];
        data[dst] = val & 255;
        data[dst + 1] = (val >> 8) & 255;
        data[dst + 2] = (val >> 16) & 255;
        data[dst + 3] = 255;
        src++;
        dst += 4;
      }
    } else {
      if (SDL2.data32Data !== data) {
        SDL2.data32 = new Int32Array(data.buffer);
        SDL2.data8 = new Uint8Array(data.buffer);
      }
      var data32 = SDL2.data32;
      num = data32.length;
      data32.set(HEAP32.subarray(src, src + num));
      var data8 = SDL2.data8;
      var i = 3;
      var j = i + 4 * num;
      if (num % 8 == 0) {
        while (i < j) {
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
          data8[i] = 255;
          i = (i + 4) | 0;
        }
      } else {
        while (i < j) {
          data8[i] = 255;
          i = (i + 4) | 0;
        }
      }
    }
    SDL2.ctx.putImageData(SDL2.image, 0, 0);
    return 0;
  },
  2716234: function ($0, $1, $2, $3, $4) {
    var w = $0;
    var h = $1;
    var hot_x = $2;
    var hot_y = $3;
    var pixels = $4;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    var image = ctx.createImageData(w, h);
    var data = image.data;
    var src = pixels >> 2;
    var dst = 0;
    var num;
    if (
      typeof CanvasPixelArray !== "undefined" &&
      data instanceof CanvasPixelArray
    ) {
      num = data.length;
      while (dst < num) {
        var val = HEAP32[src];
        data[dst] = val & 255;
        data[dst + 1] = (val >> 8) & 255;
        data[dst + 2] = (val >> 16) & 255;
        data[dst + 3] = (val >> 24) & 255;
        src++;
        dst += 4;
      }
    } else {
      var data32 = new Int32Array(data.buffer);
      num = data32.length;
      data32.set(HEAP32.subarray(src, src + num));
    }
    ctx.putImageData(image, 0, 0);
    var url =
      hot_x === 0 && hot_y === 0
        ? "url(" + canvas.toDataURL() + "), auto"
        : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto";
    var urlBuf = _malloc(url.length + 1);
    stringToUTF8(url, urlBuf, url.length + 1);
    return urlBuf;
  },
  2717223: function ($0) {
    if (Module["canvas"]) {
      Module["canvas"].style["cursor"] = UTF8ToString($0);
    }
    return 0;
  },
  2717316: function () {
    if (Module["canvas"]) {
      Module["canvas"].style["cursor"] = "none";
    }
  },
  2717385: function () {
    return screen.width;
  },
  2717410: function () {
    return screen.height;
  },
  2717436: function () {
    return window.innerWidth;
  },
  2717466: function () {
    return window.innerHeight;
  },
  2717497: function ($0) {
    if (typeof setWindowTitle !== "undefined") {
      setWindowTitle(UTF8ToString($0));
    }
    return 0;
  },
  2717592: function () {
    if (typeof AudioContext !== "undefined") {
      return 1;
    } else if (typeof webkitAudioContext !== "undefined") {
      return 1;
    }
    return 0;
  },
  2717729: function () {
    if (
      typeof navigator.mediaDevices !== "undefined" &&
      typeof navigator.mediaDevices.getUserMedia !== "undefined"
    ) {
      return 1;
    } else if (typeof navigator.webkitGetUserMedia !== "undefined") {
      return 1;
    }
    return 0;
  },
  2717953: function ($0) {
    if (typeof Module["SDL2"] === "undefined") {
      Module["SDL2"] = {};
    }
    var SDL2 = Module["SDL2"];
    if (!$0) {
      SDL2.audio = {};
    } else {
      SDL2.capture = {};
    }
    if (!SDL2.audioContext) {
      if (typeof AudioContext !== "undefined") {
        SDL2.audioContext = new AudioContext();
      } else if (typeof webkitAudioContext !== "undefined") {
        SDL2.audioContext = new webkitAudioContext();
      }
      if (SDL2.audioContext) {
        autoResumeAudioContext(SDL2.audioContext);
      }
    }
    return SDL2.audioContext === undefined ? -1 : 0;
  },
  2718446: function () {
    var SDL2 = Module["SDL2"];
    return SDL2.audioContext.sampleRate;
  },
  2718514: function ($0, $1, $2, $3) {
    var SDL2 = Module["SDL2"];
    var have_microphone = function (stream) {
      if (SDL2.capture.silenceTimer !== undefined) {
        clearTimeout(SDL2.capture.silenceTimer);
        SDL2.capture.silenceTimer = undefined;
      }
      SDL2.capture.mediaStreamNode =
        SDL2.audioContext.createMediaStreamSource(stream);
      SDL2.capture.scriptProcessorNode =
        SDL2.audioContext.createScriptProcessor($1, $0, 1);
      SDL2.capture.scriptProcessorNode.onaudioprocess = function (
        audioProcessingEvent
      ) {
        if (SDL2 === undefined || SDL2.capture === undefined) {
          return;
        }
        audioProcessingEvent.outputBuffer.getChannelData(0).fill(0);
        SDL2.capture.currentCaptureBuffer = audioProcessingEvent.inputBuffer;
        dynCall("vi", $2, [$3]);
      };
      SDL2.capture.mediaStreamNode.connect(SDL2.capture.scriptProcessorNode);
      SDL2.capture.scriptProcessorNode.connect(SDL2.audioContext.destination);
      SDL2.capture.stream = stream;
    };
    var no_microphone = function (error) {};
    SDL2.capture.silenceBuffer = SDL2.audioContext.createBuffer(
      $0,
      $1,
      SDL2.audioContext.sampleRate
    );
    SDL2.capture.silenceBuffer.getChannelData(0).fill(0);
    var silence_callback = function () {
      SDL2.capture.currentCaptureBuffer = SDL2.capture.silenceBuffer;
      dynCall("vi", $2, [$3]);
    };
    SDL2.capture.silenceTimer = setTimeout(
      silence_callback,
      ($1 / SDL2.audioContext.sampleRate) * 1e3
    );
    if (
      navigator.mediaDevices !== undefined &&
      navigator.mediaDevices.getUserMedia !== undefined
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(have_microphone)
        .catch(no_microphone);
    } else if (navigator.webkitGetUserMedia !== undefined) {
      navigator.webkitGetUserMedia(
        { audio: true, video: false },
        have_microphone,
        no_microphone
      );
    }
  },
  2720166: function ($0, $1, $2, $3) {
    var SDL2 = Module["SDL2"];
    SDL2.audio.scriptProcessorNode = SDL2.audioContext["createScriptProcessor"](
      $1,
      0,
      $0
    );
    SDL2.audio.scriptProcessorNode["onaudioprocess"] = function (e) {
      if (SDL2 === undefined || SDL2.audio === undefined) {
        return;
      }
      SDL2.audio.currentOutputBuffer = e["outputBuffer"];
      dynCall("vi", $2, [$3]);
    };
    SDL2.audio.scriptProcessorNode["connect"](SDL2.audioContext["destination"]);
  },
  2720576: function ($0, $1) {
    var SDL2 = Module["SDL2"];
    var numChannels = SDL2.capture.currentCaptureBuffer.numberOfChannels;
    for (var c = 0; c < numChannels; ++c) {
      var channelData = SDL2.capture.currentCaptureBuffer.getChannelData(c);
      if (channelData.length != $1) {
        throw (
          "Web Audio capture buffer length mismatch! Destination size: " +
          channelData.length +
          " samples vs expected " +
          $1 +
          " samples!"
        );
      }
      if (numChannels == 1) {
        for (var j = 0; j < $1; ++j) {
          setValue($0 + j * 4, channelData[j], "float");
        }
      } else {
        for (var j = 0; j < $1; ++j) {
          setValue($0 + (j * numChannels + c) * 4, channelData[j], "float");
        }
      }
    }
  },
  2721181: function ($0, $1) {
    var SDL2 = Module["SDL2"];
    var numChannels = SDL2.audio.currentOutputBuffer["numberOfChannels"];
    for (var c = 0; c < numChannels; ++c) {
      var channelData = SDL2.audio.currentOutputBuffer["getChannelData"](c);
      if (channelData.length != $1) {
        throw (
          "Web Audio output buffer length mismatch! Destination size: " +
          channelData.length +
          " samples vs expected " +
          $1 +
          " samples!"
        );
      }
      for (var j = 0; j < $1; ++j) {
        channelData[j] = HEAPF32[($0 + ((j * numChannels + c) << 2)) >> 2];
      }
    }
  },
  2721661: function ($0) {
    var SDL2 = Module["SDL2"];
    if ($0) {
      if (SDL2.capture.silenceTimer !== undefined) {
        clearTimeout(SDL2.capture.silenceTimer);
      }
      if (SDL2.capture.stream !== undefined) {
        var tracks = SDL2.capture.stream.getAudioTracks();
        for (var i = 0; i < tracks.length; i++) {
          SDL2.capture.stream.removeTrack(tracks[i]);
        }
        SDL2.capture.stream = undefined;
      }
      if (SDL2.capture.scriptProcessorNode !== undefined) {
        SDL2.capture.scriptProcessorNode.onaudioprocess = function (
          audioProcessingEvent
        ) {};
        SDL2.capture.scriptProcessorNode.disconnect();
        SDL2.capture.scriptProcessorNode = undefined;
      }
      if (SDL2.capture.mediaStreamNode !== undefined) {
        SDL2.capture.mediaStreamNode.disconnect();
        SDL2.capture.mediaStreamNode = undefined;
      }
      if (SDL2.capture.silenceBuffer !== undefined) {
        SDL2.capture.silenceBuffer = undefined;
      }
      SDL2.capture = undefined;
    } else {
      if (SDL2.audio.scriptProcessorNode != undefined) {
        SDL2.audio.scriptProcessorNode.disconnect();
        SDL2.audio.scriptProcessorNode = undefined;
      }
      SDL2.audio = undefined;
    }
    if (
      SDL2.audioContext !== undefined &&
      SDL2.audio === undefined &&
      SDL2.capture === undefined
    ) {
      SDL2.audioContext.close();
      SDL2.audioContext = undefined;
    }
  },
};
function listenOnce(object, event, func) {
  object.addEventListener(event, func, { once: true });
}
function autoResumeAudioContext(ctx, elements) {
  if (!elements) {
    elements = [document, document.getElementById("canvas")];
  }
  ["keydown", "mousedown", "touchstart"].forEach(function (event) {
    elements.forEach(function (element) {
      if (element) {
        listenOnce(element, event, function () {
          if (ctx.state === "suspended") ctx.resume();
        });
      }
    });
  });
}
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback(Module);
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        (function () {
          dynCall_v.call(null, func);
        })();
      } else {
        (function (a1) {
          dynCall_vi.apply(null, [func, a1]);
        })(callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
function demangle(func) {
  return func;
}
function demangleAll(text) {
  var regex = /\b_Z[\w\d_]+/g;
  return text.replace(regex, function (x) {
    var y = demangle(x);
    return x === y ? x : y + " [" + x + "]";
  });
}
function dynCallLegacy(sig, ptr, args) {
  var f = Module["dynCall_" + sig];
  return args && args.length
    ? f.apply(null, [ptr].concat(args))
    : f.call(null, ptr);
}
function dynCall(sig, ptr, args) {
  return dynCallLegacy(sig, ptr, args);
}
function jsStackTrace() {
  var error = new Error();
  if (!error.stack) {
    try {
      throw new Error();
    } catch (e) {
      error = e;
    }
    if (!error.stack) {
      return "(no stack trace available)";
    }
  }
  return error.stack.toString();
}
var runtimeKeepaliveCounter = 0;
function keepRuntimeAlive() {
  return noExitRuntime || runtimeKeepaliveCounter > 0;
}
function stackTrace() {
  var js = jsStackTrace();
  if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
  return demangleAll(js);
}
function ___assert_fail(condition, filename, line, func) {
  abort(
    "Assertion failed: " +
      UTF8ToString(condition) +
      ", at: " +
      [
        filename ? UTF8ToString(filename) : "unknown filename",
        line,
        func ? UTF8ToString(func) : "unknown function",
      ]
  );
}
var _emscripten_get_now;
_emscripten_get_now = function () {
  return performance.now();
};
var _emscripten_get_now_is_monotonic = true;
function setErrNo(value) {
  HEAP32[___errno_location() >> 2] = value;
  return value;
}
function _clock_gettime(clk_id, tp) {
  var now;
  if (clk_id === 0) {
    now = Date.now();
  } else if (
    (clk_id === 1 || clk_id === 4) &&
    _emscripten_get_now_is_monotonic
  ) {
    now = _emscripten_get_now();
  } else {
    setErrNo(28);
    return -1;
  }
  HEAP32[tp >> 2] = (now / 1e3) | 0;
  HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
  return 0;
}
function ___clock_gettime(a0, a1) {
  return _clock_gettime(a0, a1);
}
function _gmtime_r(time, tmPtr) {
  var date = new Date(HEAP32[time >> 2] * 1e3);
  HEAP32[tmPtr >> 2] = date.getUTCSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  HEAP32[(tmPtr + 36) >> 2] = 0;
  HEAP32[(tmPtr + 32) >> 2] = 0;
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  if (!_gmtime_r.GMTString) _gmtime_r.GMTString = allocateUTF8("GMT");
  HEAP32[(tmPtr + 40) >> 2] = _gmtime_r.GMTString;
  return tmPtr;
}
function ___gmtime_r(a0, a1) {
  return _gmtime_r(a0, a1);
}
function _tzset() {
  if (_tzset.called) return;
  _tzset.called = true;
  var currentYear = new Date().getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  HEAP32[__get_timezone() >> 2] = stdTimezoneOffset * 60;
  HEAP32[__get_daylight() >> 2] = Number(winterOffset != summerOffset);
  function extractZone(date) {
    var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
    return match ? match[1] : "GMT";
  }
  var winterName = extractZone(winter);
  var summerName = extractZone(summer);
  var winterNamePtr = allocateUTF8(winterName);
  var summerNamePtr = allocateUTF8(summerName);
  if (summerOffset < winterOffset) {
    HEAP32[__get_tzname() >> 2] = winterNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = summerNamePtr;
  } else {
    HEAP32[__get_tzname() >> 2] = summerNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = winterNamePtr;
  }
}
function _localtime_r(time, tmPtr) {
  _tzset();
  var date = new Date(HEAP32[time >> 2] * 1e3);
  HEAP32[tmPtr >> 2] = date.getSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getDay();
  var start = new Date(date.getFullYear(), 0, 1);
  var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst =
    (summerOffset != winterOffset &&
      date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  HEAP32[(tmPtr + 32) >> 2] = dst;
  var zonePtr = HEAP32[(__get_tzname() + (dst ? 4 : 0)) >> 2];
  HEAP32[(tmPtr + 40) >> 2] = zonePtr;
  return tmPtr;
}
function ___localtime_r(a0, a1) {
  return _localtime_r(a0, a1);
}
var PATH = {
  splitPath: function (filename) {
    var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: function (parts, allowAboveRoot) {
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: function (path) {
    var isAbsolute = path.charAt(0) === "/",
      trailingSlash = path.substr(-1) === "/";
    path = PATH.normalizeArray(
      path.split("/").filter(function (p) {
        return !!p;
      }),
      !isAbsolute
    ).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: function (path) {
    var result = PATH.splitPath(path),
      root = result[0],
      dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    if (dir) {
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  },
  basename: function (path) {
    if (path === "/") return "/";
    path = PATH.normalize(path);
    path = path.replace(/\/$/, "");
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) return path;
    return path.substr(lastSlash + 1);
  },
  extname: function (path) {
    return PATH.splitPath(path)[3];
  },
  join: function () {
    var paths = Array.prototype.slice.call(arguments, 0);
    return PATH.normalize(paths.join("/"));
  },
  join2: function (l, r) {
    return PATH.normalize(l + "/" + r);
  },
};
function getRandomDevice() {
  if (
    typeof crypto === "object" &&
    typeof crypto["getRandomValues"] === "function"
  ) {
    var randomBuffer = new Uint8Array(1);
    return function () {
      crypto.getRandomValues(randomBuffer);
      return randomBuffer[0];
    };
  } else
    return function () {
      abort("randomDevice");
    };
}
var PATH_FS = {
  resolve: function () {
    var resolvedPath = "",
      resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? arguments[i] : FS.cwd();
      if (typeof path !== "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charAt(0) === "/";
    }
    resolvedPath = PATH.normalizeArray(
      resolvedPath.split("/").filter(function (p) {
        return !!p;
      }),
      !resolvedAbsolute
    ).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  },
  relative: function (from, to) {
    from = PATH_FS.resolve(from).substr(1);
    to = PATH_FS.resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  },
};
var TTY = {
  ttys: [],
  init: function () {},
  shutdown: function () {},
  register: function (dev, ops) {
    TTY.ttys[dev] = { input: [], output: [], ops: ops };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open: function (stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close: function (stream) {
      stream.tty.ops.flush(stream.tty);
    },
    flush: function (stream) {
      stream.tty.ops.flush(stream.tty);
    },
    read: function (stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.timestamp = Date.now();
      }
      return bytesRead;
    },
    write: function (stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.timestamp = Date.now();
      }
      return i;
    },
  },
  default_tty_ops: {
    get_char: function (tty) {
      if (!tty.input.length) {
        var result = null;
        if (
          typeof window != "undefined" &&
          typeof window.prompt == "function"
        ) {
          result = window.prompt("Input: ");
          if (result !== null) {
            result += "\n";
          }
        } else if (typeof readline == "function") {
          result = readline();
          if (result !== null) {
            result += "\n";
          }
        }
        if (!result) {
          return null;
        }
        tty.input = intArrayFromString(result, true);
      }
      return tty.input.shift();
    },
    put_char: function (tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function (tty) {
      if (tty.output && tty.output.length > 0) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    },
  },
  default_tty1_ops: {
    put_char: function (tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function (tty) {
      if (tty.output && tty.output.length > 0) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    },
  },
};
function mmapAlloc(size) {
  var alignedSize = alignMemory(size, 65536);
  var ptr = _malloc(alignedSize);
  while (size < alignedSize) HEAP8[ptr + size++] = 0;
  return ptr;
}
var MEMFS = {
  ops_table: null,
  mount: function (mount) {
    return MEMFS.createNode(null, "/", 16384 | 511, 0);
  },
  createNode: function (parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      throw new FS.ErrnoError(63);
    }
    if (!MEMFS.ops_table) {
      MEMFS.ops_table = {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink,
          },
          stream: { llseek: MEMFS.stream_ops.llseek },
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync,
          },
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink,
          },
          stream: {},
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
          },
          stream: FS.chrdev_stream_ops,
        },
      };
    }
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.timestamp = Date.now();
    if (parent) {
      parent.contents[name] = node;
      parent.timestamp = node.timestamp;
    }
    return node;
  },
  getFileDataAsTypedArray: function (node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray)
      return node.contents.subarray(0, node.usedBytes);
    return new Uint8Array(node.contents);
  },
  expandFileStorage: function (node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(
      newCapacity,
      (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0
    );
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    if (node.usedBytes > 0)
      node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  },
  resizeFileStorage: function (node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      node.usedBytes = 0;
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      if (oldContents) {
        node.contents.set(
          oldContents.subarray(0, Math.min(newSize, node.usedBytes))
        );
      }
      node.usedBytes = newSize;
    }
  },
  node_ops: {
    getattr: function (node) {
      var attr = {};
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.timestamp);
      attr.mtime = new Date(node.timestamp);
      attr.ctime = new Date(node.timestamp);
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr: function (node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup: function (parent, name) {
      throw FS.genericErrors[44];
    },
    mknod: function (parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename: function (old_node, new_dir, new_name) {
      if (FS.isDir(old_node.mode)) {
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (new_node) {
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
      }
      delete old_node.parent.contents[old_node.name];
      old_node.parent.timestamp = Date.now();
      old_node.name = new_name;
      new_dir.contents[new_name] = old_node;
      new_dir.timestamp = old_node.parent.timestamp;
      old_node.parent = new_dir;
    },
    unlink: function (parent, name) {
      delete parent.contents[name];
      parent.timestamp = Date.now();
    },
    rmdir: function (parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.timestamp = Date.now();
    },
    readdir: function (node) {
      var entries = [".", ".."];
      for (var key in node.contents) {
        if (!node.contents.hasOwnProperty(key)) {
          continue;
        }
        entries.push(key);
      }
      return entries;
    },
    symlink: function (parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink: function (node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    },
  },
  stream_ops: {
    read: function (stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++)
          buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write: function (stream, buffer, offset, length, position, canOwn) {
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
        node.contents.set(buffer.subarray(offset, offset + length), position);
      } else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek: function (stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    allocate: function (stream, offset, length) {
      MEMFS.expandFileStorage(stream.node, offset + length);
      stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
    },
    mmap: function (stream, address, length, position, prot, flags) {
      if (address !== 0) {
        throw new FS.ErrnoError(28);
      }
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      if (!(flags & 2) && contents.buffer === buffer) {
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        if (position > 0 || position + length < contents.length) {
          if (contents.subarray) {
            contents = contents.subarray(position, position + length);
          } else {
            contents = Array.prototype.slice.call(
              contents,
              position,
              position + length
            );
          }
        }
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        HEAP8.set(contents, ptr);
      }
      return { ptr: ptr, allocated: allocated };
    },
    msync: function (stream, buffer, offset, length, mmapFlags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (mmapFlags & 2) {
        return 0;
      }
      var bytesWritten = MEMFS.stream_ops.write(
        stream,
        buffer,
        0,
        length,
        offset,
        false
      );
      return 0;
    },
  },
};
var IDBFS = {
  dbs: {},
  indexedDB: function () {
    if (typeof indexedDB !== "undefined") return indexedDB;
    var ret = null;
    if (typeof window === "object")
      ret =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
    assert(ret, "IDBFS used, but indexedDB not supported");
    return ret;
  },
  DB_VERSION: 21,
  DB_STORE_NAME: "FILE_DATA",
  mount: function (mount) {
    return MEMFS.mount.apply(null, arguments);
  },
  syncfs: function (mount, populate, callback) {
    IDBFS.getLocalSet(mount, function (err, local) {
      if (err) return callback(err);
      IDBFS.getRemoteSet(mount, function (err, remote) {
        if (err) return callback(err);
        var src = populate ? remote : local;
        var dst = populate ? local : remote;
        IDBFS.reconcile(src, dst, callback);
      });
    });
  },
  getDB: function (name, callback) {
    var db = IDBFS.dbs[name];
    if (db) {
      return callback(null, db);
    }
    var req;
    try {
      req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
    } catch (e) {
      return callback(e);
    }
    if (!req) {
      return callback("Unable to connect to IndexedDB");
    }
    req.onupgradeneeded = function (e) {
      var db = e.target.result;
      var transaction = e.target.transaction;
      var fileStore;
      if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
      } else {
        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
      }
      if (!fileStore.indexNames.contains("timestamp")) {
        fileStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
    req.onsuccess = function () {
      db = req.result;
      IDBFS.dbs[name] = db;
      callback(null, db);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  getLocalSet: function (mount, callback) {
    var entries = {};
    function isRealDir(p) {
      return p !== "." && p !== "..";
    }
    function toAbsolute(root) {
      return function (p) {
        return PATH.join2(root, p);
      };
    }
    var check = FS.readdir(mount.mountpoint)
      .filter(isRealDir)
      .map(toAbsolute(mount.mountpoint));
    while (check.length) {
      var path = check.pop();
      var stat;
      try {
        stat = FS.stat(path);
      } catch (e) {
        return callback(e);
      }
      if (FS.isDir(stat.mode)) {
        check.push.apply(
          check,
          FS.readdir(path).filter(isRealDir).map(toAbsolute(path))
        );
      }
      entries[path] = { timestamp: stat.mtime };
    }
    return callback(null, { type: "local", entries: entries });
  },
  getRemoteSet: function (mount, callback) {
    var entries = {};
    IDBFS.getDB(mount.mountpoint, function (err, db) {
      if (err) return callback(err);
      try {
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
        transaction.onerror = function (e) {
          callback(this.error);
          e.preventDefault();
        };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        var index = store.index("timestamp");
        index.openKeyCursor().onsuccess = function (event) {
          var cursor = event.target.result;
          if (!cursor) {
            return callback(null, { type: "remote", db: db, entries: entries });
          }
          entries[cursor.primaryKey] = { timestamp: cursor.key };
          cursor.continue();
        };
      } catch (e) {
        return callback(e);
      }
    });
  },
  loadLocalEntry: function (path, callback) {
    var stat, node;
    try {
      var lookup = FS.lookupPath(path);
      node = lookup.node;
      stat = FS.stat(path);
    } catch (e) {
      return callback(e);
    }
    if (FS.isDir(stat.mode)) {
      return callback(null, { timestamp: stat.mtime, mode: stat.mode });
    } else if (FS.isFile(stat.mode)) {
      node.contents = MEMFS.getFileDataAsTypedArray(node);
      return callback(null, {
        timestamp: stat.mtime,
        mode: stat.mode,
        contents: node.contents,
      });
    } else {
      return callback(new Error("node type not supported"));
    }
  },
  storeLocalEntry: function (path, entry, callback) {
    try {
      if (FS.isDir(entry["mode"])) {
        FS.mkdirTree(path, entry["mode"]);
      } else if (FS.isFile(entry["mode"])) {
        FS.writeFile(path, entry["contents"], { canOwn: true });
      } else {
        return callback(new Error("node type not supported"));
      }
      FS.chmod(path, entry["mode"]);
      FS.utime(path, entry["timestamp"], entry["timestamp"]);
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  removeLocalEntry: function (path, callback) {
    try {
      var lookup = FS.lookupPath(path);
      var stat = FS.stat(path);
      if (FS.isDir(stat.mode)) {
        FS.rmdir(path);
      } else if (FS.isFile(stat.mode)) {
        FS.unlink(path);
      }
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  loadRemoteEntry: function (store, path, callback) {
    var req = store.get(path);
    req.onsuccess = function (event) {
      callback(null, event.target.result);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  storeRemoteEntry: function (store, path, entry, callback) {
    var req = store.put(entry, path);
    req.onsuccess = function () {
      callback(null);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  removeRemoteEntry: function (store, path, callback) {
    var req = store.delete(path);
    req.onsuccess = function () {
      callback(null);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  reconcile: function (src, dst, callback) {
    var total = 0;
    var create = [];
    Object.keys(src.entries).forEach(function (key) {
      var e = src.entries[key];
      var e2 = dst.entries[key];
      if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
        create.push(key);
        total++;
      }
    });
    var remove = [];
    Object.keys(dst.entries).forEach(function (key) {
      if (!src.entries[key]) {
        remove.push(key);
        total++;
      }
    });
    if (!total) {
      return callback(null);
    }
    var errored = false;
    var db = src.type === "remote" ? src.db : dst.db;
    var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
    function done(err) {
      if (err && !errored) {
        errored = true;
        return callback(err);
      }
    }
    transaction.onerror = function (e) {
      done(this.error);
      e.preventDefault();
    };
    transaction.oncomplete = function (e) {
      if (!errored) {
        callback(null);
      }
    };
    create.sort().forEach(function (path) {
      if (dst.type === "local") {
        IDBFS.loadRemoteEntry(store, path, function (err, entry) {
          if (err) return done(err);
          IDBFS.storeLocalEntry(path, entry, done);
        });
      } else {
        IDBFS.loadLocalEntry(path, function (err, entry) {
          if (err) return done(err);
          IDBFS.storeRemoteEntry(store, path, entry, done);
        });
      }
    });
    remove
      .sort()
      .reverse()
      .forEach(function (path) {
        if (dst.type === "local") {
          IDBFS.removeLocalEntry(path, done);
        } else {
          IDBFS.removeRemoteEntry(store, path, done);
        }
      });
  },
};
var ERRNO_CODES = {
  EPERM: 63,
  ENOENT: 44,
  ESRCH: 71,
  EINTR: 27,
  EIO: 29,
  ENXIO: 60,
  E2BIG: 1,
  ENOEXEC: 45,
  EBADF: 8,
  ECHILD: 12,
  EAGAIN: 6,
  EWOULDBLOCK: 6,
  ENOMEM: 48,
  EACCES: 2,
  EFAULT: 21,
  ENOTBLK: 105,
  EBUSY: 10,
  EEXIST: 20,
  EXDEV: 75,
  ENODEV: 43,
  ENOTDIR: 54,
  EISDIR: 31,
  EINVAL: 28,
  ENFILE: 41,
  EMFILE: 33,
  ENOTTY: 59,
  ETXTBSY: 74,
  EFBIG: 22,
  ENOSPC: 51,
  ESPIPE: 70,
  EROFS: 69,
  EMLINK: 34,
  EPIPE: 64,
  EDOM: 18,
  ERANGE: 68,
  ENOMSG: 49,
  EIDRM: 24,
  ECHRNG: 106,
  EL2NSYNC: 156,
  EL3HLT: 107,
  EL3RST: 108,
  ELNRNG: 109,
  EUNATCH: 110,
  ENOCSI: 111,
  EL2HLT: 112,
  EDEADLK: 16,
  ENOLCK: 46,
  EBADE: 113,
  EBADR: 114,
  EXFULL: 115,
  ENOANO: 104,
  EBADRQC: 103,
  EBADSLT: 102,
  EDEADLOCK: 16,
  EBFONT: 101,
  ENOSTR: 100,
  ENODATA: 116,
  ETIME: 117,
  ENOSR: 118,
  ENONET: 119,
  ENOPKG: 120,
  EREMOTE: 121,
  ENOLINK: 47,
  EADV: 122,
  ESRMNT: 123,
  ECOMM: 124,
  EPROTO: 65,
  EMULTIHOP: 36,
  EDOTDOT: 125,
  EBADMSG: 9,
  ENOTUNIQ: 126,
  EBADFD: 127,
  EREMCHG: 128,
  ELIBACC: 129,
  ELIBBAD: 130,
  ELIBSCN: 131,
  ELIBMAX: 132,
  ELIBEXEC: 133,
  ENOSYS: 52,
  ENOTEMPTY: 55,
  ENAMETOOLONG: 37,
  ELOOP: 32,
  EOPNOTSUPP: 138,
  EPFNOSUPPORT: 139,
  ECONNRESET: 15,
  ENOBUFS: 42,
  EAFNOSUPPORT: 5,
  EPROTOTYPE: 67,
  ENOTSOCK: 57,
  ENOPROTOOPT: 50,
  ESHUTDOWN: 140,
  ECONNREFUSED: 14,
  EADDRINUSE: 3,
  ECONNABORTED: 13,
  ENETUNREACH: 40,
  ENETDOWN: 38,
  ETIMEDOUT: 73,
  EHOSTDOWN: 142,
  EHOSTUNREACH: 23,
  EINPROGRESS: 26,
  EALREADY: 7,
  EDESTADDRREQ: 17,
  EMSGSIZE: 35,
  EPROTONOSUPPORT: 66,
  ESOCKTNOSUPPORT: 137,
  EADDRNOTAVAIL: 4,
  ENETRESET: 39,
  EISCONN: 30,
  ENOTCONN: 53,
  ETOOMANYREFS: 141,
  EUSERS: 136,
  EDQUOT: 19,
  ESTALE: 72,
  ENOTSUP: 138,
  ENOMEDIUM: 148,
  EILSEQ: 25,
  EOVERFLOW: 61,
  ECANCELED: 11,
  ENOTRECOVERABLE: 56,
  EOWNERDEAD: 62,
  ESTRPIPE: 135,
};
var LZ4 = {
  DIR_MODE: 16895,
  FILE_MODE: 33279,
  CHUNK_SIZE: -1,
  codec: null,
  init: function () {
    if (LZ4.codec) return;
    LZ4.codec = (function () {
      var MiniLZ4 = (function () {
        var exports = {};
        exports.uncompress = function (input, output, sIdx, eIdx) {
          sIdx = sIdx || 0;
          eIdx = eIdx || input.length - sIdx;
          for (var i = sIdx, n = eIdx, j = 0; i < n; ) {
            var token = input[i++];
            var literals_length = token >> 4;
            if (literals_length > 0) {
              var l = literals_length + 240;
              while (l === 255) {
                l = input[i++];
                literals_length += l;
              }
              var end = i + literals_length;
              while (i < end) output[j++] = input[i++];
              if (i === n) return j;
            }
            var offset = input[i++] | (input[i++] << 8);
            if (offset === 0) return j;
            if (offset > j) return -(i - 2);
            var match_length = token & 15;
            var l = match_length + 240;
            while (l === 255) {
              l = input[i++];
              match_length += l;
            }
            var pos = j - offset;
            var end = j + match_length + 4;
            while (j < end) output[j++] = output[pos++];
          }
          return j;
        };
        var maxInputSize = 2113929216,
          minMatch = 4,
          hashLog = 16,
          hashShift = minMatch * 8 - hashLog,
          copyLength = 8,
          mfLimit = copyLength + minMatch,
          skipStrength = 6,
          mlBits = 4,
          mlMask = (1 << mlBits) - 1,
          runBits = 8 - mlBits,
          runMask = (1 << runBits) - 1,
          hasher = 2654435761;
        assert(hashShift === 16);
        var hashTable = new Int16Array(1 << 16);
        var empty = new Int16Array(hashTable.length);
        exports.compressBound = function (isize) {
          return isize > maxInputSize ? 0 : (isize + isize / 255 + 16) | 0;
        };
        exports.compress = function (src, dst, sIdx, eIdx) {
          hashTable.set(empty);
          return compressBlock(src, dst, 0, sIdx || 0, eIdx || dst.length);
        };
        function compressBlock(src, dst, pos, sIdx, eIdx) {
          var dpos = sIdx;
          var dlen = eIdx - sIdx;
          var anchor = 0;
          if (src.length >= maxInputSize) throw new Error("input too large");
          if (src.length > mfLimit) {
            var n = exports.compressBound(src.length);
            if (dlen < n) throw Error("output too small: " + dlen + " < " + n);
            var step = 1,
              findMatchAttempts = (1 << skipStrength) + 3,
              srcLength = src.length - mfLimit;
            while (pos + minMatch < srcLength) {
              var sequenceLowBits = (src[pos + 1] << 8) | src[pos];
              var sequenceHighBits = (src[pos + 3] << 8) | src[pos + 2];
              var hash =
                Math.imul(
                  sequenceLowBits | (sequenceHighBits << 16),
                  hasher
                ) >>> hashShift;
              var ref = hashTable[hash] - 1;
              hashTable[hash] = pos + 1;
              if (
                ref < 0 ||
                (pos - ref) >>> 16 > 0 ||
                ((src[ref + 3] << 8) | src[ref + 2]) != sequenceHighBits ||
                ((src[ref + 1] << 8) | src[ref]) != sequenceLowBits
              ) {
                step = findMatchAttempts++ >> skipStrength;
                pos += step;
                continue;
              }
              findMatchAttempts = (1 << skipStrength) + 3;
              var literals_length = pos - anchor;
              var offset = pos - ref;
              pos += minMatch;
              ref += minMatch;
              var match_length = pos;
              while (pos < srcLength && src[pos] == src[ref]) {
                pos++;
                ref++;
              }
              match_length = pos - match_length;
              var token = match_length < mlMask ? match_length : mlMask;
              if (literals_length >= runMask) {
                dst[dpos++] = (runMask << mlBits) + token;
                for (
                  var len = literals_length - runMask;
                  len > 254;
                  len -= 255
                ) {
                  dst[dpos++] = 255;
                }
                dst[dpos++] = len;
              } else {
                dst[dpos++] = (literals_length << mlBits) + token;
              }
              for (var i = 0; i < literals_length; i++) {
                dst[dpos++] = src[anchor + i];
              }
              dst[dpos++] = offset;
              dst[dpos++] = offset >> 8;
              if (match_length >= mlMask) {
                match_length -= mlMask;
                while (match_length >= 255) {
                  match_length -= 255;
                  dst[dpos++] = 255;
                }
                dst[dpos++] = match_length;
              }
              anchor = pos;
            }
          }
          if (anchor == 0) return 0;
          literals_length = src.length - anchor;
          if (literals_length >= runMask) {
            dst[dpos++] = runMask << mlBits;
            for (var ln = literals_length - runMask; ln > 254; ln -= 255) {
              dst[dpos++] = 255;
            }
            dst[dpos++] = ln;
          } else {
            dst[dpos++] = literals_length << mlBits;
          }
          pos = anchor;
          while (pos < src.length) {
            dst[dpos++] = src[pos++];
          }
          return dpos;
        }
        exports.CHUNK_SIZE = 2048;
        exports.compressPackage = function (data, verify) {
          if (verify) {
            var temp = new Uint8Array(exports.CHUNK_SIZE);
          }
          assert(data instanceof ArrayBuffer);
          data = new Uint8Array(data);
          console.log("compressing package of size " + data.length);
          var compressedChunks = [];
          var successes = [];
          var offset = 0;
          var total = 0;
          while (offset < data.length) {
            var chunk = data.subarray(offset, offset + exports.CHUNK_SIZE);
            offset += exports.CHUNK_SIZE;
            var bound = exports.compressBound(chunk.length);
            var compressed = new Uint8Array(bound);
            var compressedSize = exports.compress(chunk, compressed);
            if (compressedSize > 0) {
              assert(compressedSize <= bound);
              compressed = compressed.subarray(0, compressedSize);
              compressedChunks.push(compressed);
              total += compressedSize;
              successes.push(1);
              if (verify) {
                var back = exports.uncompress(compressed, temp);
                assert(back === chunk.length, [back, chunk.length]);
                for (var i = 0; i < chunk.length; i++) {
                  assert(chunk[i] === temp[i]);
                }
              }
            } else {
              assert(compressedSize === 0);
              compressedChunks.push(chunk);
              total += chunk.length;
              successes.push(0);
            }
          }
          data = null;
          var compressedData = {
            data: new Uint8Array(total + exports.CHUNK_SIZE * 2),
            cachedOffset: total,
            cachedIndexes: [-1, -1],
            cachedChunks: [null, null],
            offsets: [],
            sizes: [],
            successes: successes,
          };
          offset = 0;
          for (var i = 0; i < compressedChunks.length; i++) {
            compressedData["data"].set(compressedChunks[i], offset);
            compressedData["offsets"][i] = offset;
            compressedData["sizes"][i] = compressedChunks[i].length;
            offset += compressedChunks[i].length;
          }
          console.log(
            "compressed package into " + [compressedData["data"].length]
          );
          assert(offset === total);
          return compressedData;
        };
        assert(exports.CHUNK_SIZE < 1 << 15);
        return exports;
      })();
      return MiniLZ4;
    })();
    LZ4.CHUNK_SIZE = LZ4.codec.CHUNK_SIZE;
  },
  loadPackage: function (pack, preloadPlugin) {
    LZ4.init();
    var compressedData = pack["compressedData"];
    if (!compressedData)
      compressedData = LZ4.codec.compressPackage(pack["data"]);
    assert(
      compressedData["cachedIndexes"].length ===
        compressedData["cachedChunks"].length
    );
    for (var i = 0; i < compressedData["cachedIndexes"].length; i++) {
      compressedData["cachedIndexes"][i] = -1;
      compressedData["cachedChunks"][i] = compressedData["data"].subarray(
        compressedData["cachedOffset"] + i * LZ4.CHUNK_SIZE,
        compressedData["cachedOffset"] + (i + 1) * LZ4.CHUNK_SIZE
      );
      assert(compressedData["cachedChunks"][i].length === LZ4.CHUNK_SIZE);
    }
    pack["metadata"].files.forEach(function (file) {
      var dir = PATH.dirname(file.filename);
      var name = PATH.basename(file.filename);
      FS.createPath("", dir, true, true);
      var parent = FS.analyzePath(dir).object;
      LZ4.createNode(parent, name, LZ4.FILE_MODE, 0, {
        compressedData: compressedData,
        start: file.start,
        end: file.end,
      });
    });
    if (preloadPlugin) {
      Browser.init();
      pack["metadata"].files.forEach(function (file) {
        var handled = false;
        var fullname = file.filename;
        Module["preloadPlugins"].forEach(function (plugin) {
          if (handled) return;
          if (plugin["canHandle"](fullname)) {
            var dep = getUniqueRunDependency("fp " + fullname);
            addRunDependency(dep);
            var finish = function () {
              removeRunDependency(dep);
            };
            var byteArray = FS.readFile(fullname);
            plugin["handle"](byteArray, fullname, finish, finish);
            handled = true;
          }
        });
      });
    }
  },
  createNode: function (parent, name, mode, dev, contents, mtime) {
    var node = FS.createNode(parent, name, mode);
    node.mode = mode;
    node.node_ops = LZ4.node_ops;
    node.stream_ops = LZ4.stream_ops;
    node.timestamp = (mtime || new Date()).getTime();
    assert(LZ4.FILE_MODE !== LZ4.DIR_MODE);
    if (mode === LZ4.FILE_MODE) {
      node.size = contents.end - contents.start;
      node.contents = contents;
    } else {
      node.size = 4096;
      node.contents = {};
    }
    if (parent) {
      parent.contents[name] = node;
    }
    return node;
  },
  node_ops: {
    getattr: function (node) {
      return {
        dev: 1,
        ino: node.id,
        mode: node.mode,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: undefined,
        size: node.size,
        atime: new Date(node.timestamp),
        mtime: new Date(node.timestamp),
        ctime: new Date(node.timestamp),
        blksize: 4096,
        blocks: Math.ceil(node.size / 4096),
      };
    },
    setattr: function (node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
    },
    lookup: function (parent, name) {
      throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
    },
    mknod: function (parent, name, mode, dev) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
    rename: function (oldNode, newDir, newName) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
    unlink: function (parent, name) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
    rmdir: function (parent, name) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
    readdir: function (node) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
    symlink: function (parent, newName, oldPath) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
    readlink: function (node) {
      throw new FS.ErrnoError(ERRNO_CODES.EPERM);
    },
  },
  stream_ops: {
    read: function (stream, buffer, offset, length, position) {
      length = Math.min(length, stream.node.size - position);
      if (length <= 0) return 0;
      var contents = stream.node.contents;
      var compressedData = contents.compressedData;
      var written = 0;
      while (written < length) {
        var start = contents.start + position + written;
        var desired = length - written;
        var chunkIndex = Math.floor(start / LZ4.CHUNK_SIZE);
        var compressedStart = compressedData["offsets"][chunkIndex];
        var compressedSize = compressedData["sizes"][chunkIndex];
        var currChunk;
        if (compressedData["successes"][chunkIndex]) {
          var found = compressedData["cachedIndexes"].indexOf(chunkIndex);
          if (found >= 0) {
            currChunk = compressedData["cachedChunks"][found];
          } else {
            compressedData["cachedIndexes"].pop();
            compressedData["cachedIndexes"].unshift(chunkIndex);
            currChunk = compressedData["cachedChunks"].pop();
            compressedData["cachedChunks"].unshift(currChunk);
            if (compressedData["debug"]) {
              console.log("decompressing chunk " + chunkIndex);
              Module["decompressedChunks"] =
                (Module["decompressedChunks"] || 0) + 1;
            }
            var compressed = compressedData["data"].subarray(
              compressedStart,
              compressedStart + compressedSize
            );
            var originalSize = LZ4.codec.uncompress(compressed, currChunk);
            if (chunkIndex < compressedData["successes"].length - 1)
              assert(originalSize === LZ4.CHUNK_SIZE);
          }
        } else {
          currChunk = compressedData["data"].subarray(
            compressedStart,
            compressedStart + LZ4.CHUNK_SIZE
          );
        }
        var startInChunk = start % LZ4.CHUNK_SIZE;
        var endInChunk = Math.min(startInChunk + desired, LZ4.CHUNK_SIZE);
        buffer.set(
          currChunk.subarray(startInChunk, endInChunk),
          offset + written
        );
        var currWritten = endInChunk - startInChunk;
        written += currWritten;
      }
      return written;
    },
    write: function (stream, buffer, offset, length, position) {
      throw new FS.ErrnoError(ERRNO_CODES.EIO);
    },
    llseek: function (stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.size;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
      }
      return position;
    },
  },
};
var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  trackingDelegate: {},
  tracking: { openFlags: { READ: 1, WRITE: 2 } },
  ErrnoError: null,
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  lookupPath: function (path, opts) {
    path = PATH_FS.resolve(FS.cwd(), path);
    opts = opts || {};
    if (!path) return { path: "", node: null };
    var defaults = { follow_mount: true, recurse_count: 0 };
    for (var key in defaults) {
      if (opts[key] === undefined) {
        opts[key] = defaults[key];
      }
    }
    if (opts.recurse_count > 8) {
      throw new FS.ErrnoError(32);
    }
    var parts = PATH.normalizeArray(
      path.split("/").filter(function (p) {
        return !!p;
      }),
      false
    );
    var current = FS.root;
    var current_path = "/";
    for (var i = 0; i < parts.length; i++) {
      var islast = i === parts.length - 1;
      if (islast && opts.parent) {
        break;
      }
      current = FS.lookupNode(current, parts[i]);
      current_path = PATH.join2(current_path, parts[i]);
      if (FS.isMountpoint(current)) {
        if (!islast || (islast && opts.follow_mount)) {
          current = current.mounted.root;
        }
      }
      if (!islast || opts.follow) {
        var count = 0;
        while (FS.isLink(current.mode)) {
          var link = FS.readlink(current_path);
          current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
          var lookup = FS.lookupPath(current_path, {
            recurse_count: opts.recurse_count,
          });
          current = lookup.node;
          if (count++ > 40) {
            throw new FS.ErrnoError(32);
          }
        }
      }
    }
    return { path: current_path, node: current };
  },
  getPath: function (node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/"
          ? mount + "/" + path
          : mount + path;
      }
      path = path ? node.name + "/" + path : node.name;
      node = node.parent;
    }
  },
  hashName: function (parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode: function (node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode: function (node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode: function (parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode, parent);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    return FS.lookup(parent, name);
  },
  createNode: function (parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode: function (node) {
    FS.hashRemoveNode(node);
  },
  isRoot: function (node) {
    return node === node.parent;
  },
  isMountpoint: function (node) {
    return !!node.mounted;
  },
  isFile: function (mode) {
    return (mode & 61440) === 32768;
  },
  isDir: function (mode) {
    return (mode & 61440) === 16384;
  },
  isLink: function (mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev: function (mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev: function (mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO: function (mode) {
    return (mode & 61440) === 4096;
  },
  isSocket: function (mode) {
    return (mode & 49152) === 49152;
  },
  flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
  modeStringToFlags: function (str) {
    var flags = FS.flagModes[str];
    if (typeof flags === "undefined") {
      throw new Error("Unknown file open mode: " + str);
    }
    return flags;
  },
  flagsToPermissionString: function (flag) {
    var perms = ["r", "w", "rw"][flag & 3];
    if (flag & 512) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions: function (node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    } else if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    } else if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup: function (dir) {
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate: function (dir, name) {
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete: function (dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen: function (node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  MAX_OPEN_FDS: 4096,
  nextfd: function (fd_start, fd_end) {
    fd_start = fd_start || 0;
    fd_end = fd_end || FS.MAX_OPEN_FDS;
    for (var fd = fd_start; fd <= fd_end; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStream: function (fd) {
    return FS.streams[fd];
  },
  createStream: function (stream, fd_start, fd_end) {
    if (!FS.FSStream) {
      FS.FSStream = function () {};
      FS.FSStream.prototype = {
        object: {
          get: function () {
            return this.node;
          },
          set: function (val) {
            this.node = val;
          },
        },
        isRead: {
          get: function () {
            return (this.flags & 2097155) !== 1;
          },
        },
        isWrite: {
          get: function () {
            return (this.flags & 2097155) !== 0;
          },
        },
        isAppend: {
          get: function () {
            return this.flags & 1024;
          },
        },
      };
    }
    var newStream = new FS.FSStream();
    for (var p in stream) {
      newStream[p] = stream[p];
    }
    stream = newStream;
    var fd = FS.nextfd(fd_start, fd_end);
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream: function (fd) {
    FS.streams[fd] = null;
  },
  chrdev_stream_ops: {
    open: function (stream) {
      var device = FS.getDevice(stream.node.rdev);
      stream.stream_ops = device.stream_ops;
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
    },
    llseek: function () {
      throw new FS.ErrnoError(70);
    },
  },
  major: function (dev) {
    return dev >> 8;
  },
  minor: function (dev) {
    return dev & 255;
  },
  makedev: function (ma, mi) {
    return (ma << 8) | mi;
  },
  registerDevice: function (dev, ops) {
    FS.devices[dev] = { stream_ops: ops };
  },
  getDevice: function (dev) {
    return FS.devices[dev];
  },
  getMounts: function (mount) {
    var mounts = [];
    var check = [mount];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push.apply(check, m.mounts);
    }
    return mounts;
  },
  syncfs: function (populate, callback) {
    if (typeof populate === "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(
        "warning: " +
          FS.syncFSRequests +
          " FS.syncfs operations in flight at once, probably just doing extra work"
      );
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    mounts.forEach(function (mount) {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount: function (type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      mountpoint = lookup.path;
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] };
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      node.mounted = mount;
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount: function (mountpoint) {
    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    Object.keys(FS.nameTable).forEach(function (hash) {
      var current = FS.nameTable[hash];
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    });
    node.mounted = null;
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup: function (parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod: function (path, mode, dev) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name || name === "." || name === "..") {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  create: function (path, mode) {
    mode = mode !== undefined ? mode : 438;
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir: function (path, mode) {
    mode = mode !== undefined ? mode : 511;
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree: function (path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var i = 0; i < dirs.length; ++i) {
      if (!dirs[i]) continue;
      d += "/" + dirs[i];
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev: function (path, mode, dev) {
    if (typeof dev === "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink: function (oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename: function (old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    var lookup, old_dir, new_dir;
    lookup = FS.lookupPath(old_path, { parent: true });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, { parent: true });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    var old_node = FS.lookupNode(old_dir, old_name);
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (old_node === new_node) {
      return;
    }
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    errCode = new_node
      ? FS.mayDelete(new_dir, new_name, isdir)
      : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    try {
      if (FS.trackingDelegate["willMovePath"]) {
        FS.trackingDelegate["willMovePath"](old_path, new_path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
    FS.hashRemoveNode(old_node);
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
    } catch (e) {
      throw e;
    } finally {
      FS.hashAddNode(old_node);
    }
    try {
      if (FS.trackingDelegate["onMovePath"])
        FS.trackingDelegate["onMovePath"](old_path, new_path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  rmdir: function (path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readdir: function (path) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54);
    }
    return node.node_ops.readdir(node);
  },
  unlink: function (path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readlink: function (path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return PATH_FS.resolve(
      FS.getPath(link.parent),
      link.node_ops.readlink(link)
    );
  },
  stat: function (path, dontFollow) {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    var node = lookup.node;
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (!node.node_ops.getattr) {
      throw new FS.ErrnoError(63);
    }
    return node.node_ops.getattr(node);
  },
  lstat: function (path) {
    return FS.stat(path, true);
  },
  chmod: function (path, mode, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      timestamp: Date.now(),
    });
  },
  lchmod: function (path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod: function (fd, mode) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chmod(stream.node, mode);
  },
  chown: function (path, uid, gid, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, { timestamp: Date.now() });
  },
  lchown: function (path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown: function (fd, uid, gid) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chown(stream.node, uid, gid);
  },
  truncate: function (path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
  },
  ftruncate: function (fd, len) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.truncate(stream.node, len);
  },
  utime: function (path, atime, mtime) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
  },
  open: function (path, flags, mode, fd_start, fd_end) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
    mode = typeof mode === "undefined" ? 438 : mode;
    if (flags & 64) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    if (typeof path === "object") {
      node = path;
    } else {
      path = PATH.normalize(path);
      try {
        var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
        node = lookup.node;
      } catch (e) {}
    }
    var created = false;
    if (flags & 64) {
      if (node) {
        if (flags & 128) {
          throw new FS.ErrnoError(20);
        }
      } else {
        node = FS.mknod(path, mode, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    if (flags & 65536 && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    if (flags & 512) {
      FS.truncate(node, 0);
    }
    flags &= ~(128 | 512 | 131072);
    var stream = FS.createStream(
      {
        node: node,
        path: FS.getPath(node),
        flags: flags,
        seekable: true,
        position: 0,
        stream_ops: node.stream_ops,
        ungotten: [],
        error: false,
      },
      fd_start,
      fd_end
    );
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!FS.readFiles) FS.readFiles = {};
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
        err("FS.trackingDelegate error on read file: " + path);
      }
    }
    try {
      if (FS.trackingDelegate["onOpenFile"]) {
        var trackingFlags = 0;
        if ((flags & 2097155) !== 1) {
          trackingFlags |= FS.tracking.openFlags.READ;
        }
        if ((flags & 2097155) !== 0) {
          trackingFlags |= FS.tracking.openFlags.WRITE;
        }
        FS.trackingDelegate["onOpenFile"](path, trackingFlags);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['onOpenFile']('" +
          path +
          "', flags) threw an exception: " +
          e.message
      );
    }
    return stream;
  },
  close: function (stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed: function (stream) {
    return stream.fd === null;
  },
  llseek: function (stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read: function (stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(
      stream,
      buffer,
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: function (stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(
      stream,
      buffer,
      offset,
      length,
      position,
      canOwn
    );
    if (!seeking) stream.position += bytesWritten;
    try {
      if (stream.path && FS.trackingDelegate["onWriteToFile"])
        FS.trackingDelegate["onWriteToFile"](stream.path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onWriteToFile']('" +
          stream.path +
          "') threw an exception: " +
          e.message
      );
    }
    return bytesWritten;
  },
  allocate: function (stream, offset, length) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (offset < 0 || length <= 0) {
      throw new FS.ErrnoError(28);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (!stream.stream_ops.allocate) {
      throw new FS.ErrnoError(138);
    }
    stream.stream_ops.allocate(stream, offset, length);
  },
  mmap: function (stream, address, length, position, prot, flags) {
    if (
      (prot & 2) !== 0 &&
      (flags & 2) === 0 &&
      (stream.flags & 2097155) !== 2
    ) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    return stream.stream_ops.mmap(
      stream,
      address,
      length,
      position,
      prot,
      flags
    );
  },
  msync: function (stream, buffer, offset, length, mmapFlags) {
    if (!stream || !stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  munmap: function (stream) {
    return 0;
  },
  ioctl: function (stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile: function (path, opts) {
    opts = opts || {};
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      throw new Error('Invalid encoding type "' + opts.encoding + '"');
    }
    var ret;
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      ret = UTF8ArrayToString(buf, 0);
    } else if (opts.encoding === "binary") {
      ret = buf;
    }
    FS.close(stream);
    return ret;
  },
  writeFile: function (path, data, opts) {
    opts = opts || {};
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data === "string") {
      var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
      var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
      FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
    } else if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      throw new Error("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: function () {
    return FS.currentPath;
  },
  chdir: function (path) {
    var lookup = FS.lookupPath(path, { follow: true });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories: function () {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices: function () {
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1, 3), {
      read: function () {
        return 0;
      },
      write: function (stream, buffer, offset, length, pos) {
        return length;
      },
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    var random_device = getRandomDevice();
    FS.createDevice("/dev", "random", random_device);
    FS.createDevice("/dev", "urandom", random_device);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories: function () {
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount(
      {
        mount: function () {
          var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
          node.node_ops = {
            lookup: function (parent, name) {
              var fd = +name;
              var stream = FS.getStream(fd);
              if (!stream) throw new FS.ErrnoError(8);
              var ret = {
                parent: null,
                mount: { mountpoint: "fake" },
                node_ops: {
                  readlink: function () {
                    return stream.path;
                  },
                },
              };
              ret.parent = ret;
              return ret;
            },
          };
          return node;
        },
      },
      {},
      "/proc/self/fd"
    );
  },
  createStandardStreams: function () {
    if (Module["stdin"]) {
      FS.createDevice("/dev", "stdin", Module["stdin"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (Module["stdout"]) {
      FS.createDevice("/dev", "stdout", null, Module["stdout"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (Module["stderr"]) {
      FS.createDevice("/dev", "stderr", null, Module["stderr"]);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  ensureErrnoError: function () {
    if (FS.ErrnoError) return;
    FS.ErrnoError = function ErrnoError(errno, node) {
      this.node = node;
      this.setErrno = function (errno) {
        this.errno = errno;
      };
      this.setErrno(errno);
      this.message = "FS error";
    };
    FS.ErrnoError.prototype = new Error();
    FS.ErrnoError.prototype.constructor = FS.ErrnoError;
    [44].forEach(function (code) {
      FS.genericErrors[code] = new FS.ErrnoError(code);
      FS.genericErrors[code].stack = "<generic error, no stack>";
    });
  },
  staticInit: function () {
    FS.ensureErrnoError();
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = { MEMFS: MEMFS, IDBFS: IDBFS };
  },
  init: function (input, output, error) {
    FS.init.initialized = true;
    FS.ensureErrnoError();
    Module["stdin"] = input || Module["stdin"];
    Module["stdout"] = output || Module["stdout"];
    Module["stderr"] = error || Module["stderr"];
    FS.createStandardStreams();
  },
  quit: function () {
    FS.init.initialized = false;
    var fflush = Module["_fflush"];
    if (fflush) fflush(0);
    for (var i = 0; i < FS.streams.length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue;
      }
      FS.close(stream);
    }
  },
  getMode: function (canRead, canWrite) {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  },
  findObject: function (path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (ret.exists) {
      return ret.object;
    } else {
      return null;
    }
  },
  analyzePath: function (path, dontResolveLastLink) {
    try {
      var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null,
    };
    try {
      var lookup = FS.lookupPath(path, { parent: true });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath: function (parent, path, canRead, canWrite) {
    parent = typeof parent === "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {}
      parent = current;
    }
    return current;
  },
  createFile: function (parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
    var path = name
      ? PATH.join2(
          typeof parent === "string" ? parent : FS.getPath(parent),
          name
        )
      : parent;
    var mode = FS.getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data === "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i)
          arr[i] = data.charCodeAt(i);
        data = arr;
      }
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
    return node;
  },
  createDevice: function (parent, name, input, output) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(!!input, !!output);
    if (!FS.createDevice.major) FS.createDevice.major = 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    FS.registerDevice(dev, {
      open: function (stream) {
        stream.seekable = false;
      },
      close: function (stream) {
        if (output && output.buffer && output.buffer.length) {
          output(10);
        }
      },
      read: function (stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      },
      write: function (stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      },
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile: function (obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (typeof XMLHttpRequest !== "undefined") {
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
      );
    } else if (read_) {
      try {
        obj.contents = intArrayFromString(read_(obj.url), true);
        obj.usedBytes = obj.contents.length;
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
  },
  createLazyFile: function (parent, name, url, canRead, canWrite) {
    function LazyUint8Array() {
      this.lengthKnown = false;
      this.chunks = [];
    }
    LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
      if (idx > this.length - 1 || idx < 0) {
        return undefined;
      }
      var chunkOffset = idx % this.chunkSize;
      var chunkNum = (idx / this.chunkSize) | 0;
      return this.getter(chunkNum)[chunkOffset];
    };
    LazyUint8Array.prototype.setDataGetter =
      function LazyUint8Array_setDataGetter(getter) {
        this.getter = getter;
      };
    LazyUint8Array.prototype.cacheLength =
      function LazyUint8Array_cacheLength() {
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
          throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing =
          (header = xhr.getResponseHeader("Accept-Ranges")) &&
          header === "bytes";
        var usesGzip =
          (header = xhr.getResponseHeader("Content-Encoding")) &&
          header === "gzip";
        var chunkSize = 1024 * 1024;
        if (!hasByteServing) chunkSize = datalength;
        var doXHR = function (from, to) {
          if (from > to)
            throw new Error(
              "invalid range (" + from + ", " + to + ") or no bytes requested!"
            );
          if (to > datalength - 1)
            throw new Error(
              "only " + datalength + " bytes available! programmer error!"
            );
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          if (datalength !== chunkSize)
            xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
          if (typeof Uint8Array != "undefined")
            xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(xhr.response || []);
          } else {
            return intArrayFromString(xhr.responseText || "", true);
          }
        };
        var lazyArray = this;
        lazyArray.setDataGetter(function (chunkNum) {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          end = Math.min(end, datalength - 1);
          if (typeof lazyArray.chunks[chunkNum] === "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] === "undefined")
            throw new Error("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          chunkSize = datalength = 1;
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out(
            "LazyFiles on gzip forces download of the whole file when length is accessed"
          );
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      };
    if (typeof XMLHttpRequest !== "undefined") {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray = new LazyUint8Array();
      Object.defineProperties(lazyArray, {
        length: {
          get: function () {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          },
        },
        chunkSize: {
          get: function () {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          },
        },
      });
      var properties = { isDevice: false, contents: lazyArray };
    } else {
      var properties = { isDevice: false, url: url };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    Object.defineProperties(node, {
      usedBytes: {
        get: function () {
          return this.contents.length;
        },
      },
    });
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(function (key) {
      var fn = node.stream_ops[key];
      stream_ops[key] = function forceLoadLazyFile() {
        FS.forceLoadFile(node);
        return fn.apply(null, arguments);
      };
    });
    stream_ops.read = function stream_ops_read(
      stream,
      buffer,
      offset,
      length,
      position
    ) {
      FS.forceLoadFile(node);
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    };
    node.stream_ops = stream_ops;
    return node;
  },
  createPreloadedFile: function (
    parent,
    name,
    url,
    canRead,
    canWrite,
    onload,
    onerror,
    dontCreateFile,
    canOwn,
    preFinish
  ) {
    Browser.init();
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency("cp " + fullname);
    function processData(byteArray) {
      function finish(byteArray) {
        if (preFinish) preFinish();
        if (!dontCreateFile) {
          FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
        if (onload) onload();
        removeRunDependency(dep);
      }
      var handled = false;
      Module["preloadPlugins"].forEach(function (plugin) {
        if (handled) return;
        if (plugin["canHandle"](fullname)) {
          plugin["handle"](byteArray, fullname, finish, function () {
            if (onerror) onerror();
            removeRunDependency(dep);
          });
          handled = true;
        }
      });
      if (!handled) finish(byteArray);
    }
    addRunDependency(dep);
    if (typeof url == "string") {
      Browser.asyncLoad(
        url,
        function (byteArray) {
          processData(byteArray);
        },
        onerror
      );
    } else {
      processData(url);
    }
  },
  indexedDB: function () {
    return (
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB
    );
  },
  DB_NAME: function () {
    return "EM_FS_" + window.location.pathname;
  },
  DB_VERSION: 20,
  DB_STORE_NAME: "FILE_DATA",
  saveFilesToDB: function (paths, onload, onerror) {
    onload = onload || function () {};
    onerror = onerror || function () {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
      out("creating db");
      var db = openRequest.result;
      db.createObjectStore(FS.DB_STORE_NAME);
    };
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function (path) {
        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
        putRequest.onsuccess = function putRequest_onsuccess() {
          ok++;
          if (ok + fail == total) finish();
        };
        putRequest.onerror = function putRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  },
  loadFilesFromDB: function (paths, onload, onerror) {
    onload = onload || function () {};
    onerror = onerror || function () {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = onerror;
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      try {
        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
      } catch (e) {
        onerror(e);
        return;
      }
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function (path) {
        var getRequest = files.get(path);
        getRequest.onsuccess = function getRequest_onsuccess() {
          if (FS.analyzePath(path).exists) {
            FS.unlink(path);
          }
          FS.createDataFile(
            PATH.dirname(path),
            PATH.basename(path),
            getRequest.result,
            true,
            true,
            true
          );
          ok++;
          if (ok + fail == total) finish();
        };
        getRequest.onerror = function getRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  },
};
var SYSCALLS = {
  mappings: {},
  DEFAULT_POLLMASK: 5,
  umask: 511,
  calculateAt: function (dirfd, path, allowEmpty) {
    if (path[0] === "/") {
      return path;
    }
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = FS.getStream(dirfd);
      if (!dirstream) throw new FS.ErrnoError(8);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return PATH.join2(dir, path);
  },
  doStat: function (func, path, buf) {
    try {
      var stat = func(path);
    } catch (e) {
      if (
        e &&
        e.node &&
        PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
      ) {
        return -54;
      }
      throw e;
    }
    HEAP32[buf >> 2] = stat.dev;
    HEAP32[(buf + 4) >> 2] = 0;
    HEAP32[(buf + 8) >> 2] = stat.ino;
    HEAP32[(buf + 12) >> 2] = stat.mode;
    HEAP32[(buf + 16) >> 2] = stat.nlink;
    HEAP32[(buf + 20) >> 2] = stat.uid;
    HEAP32[(buf + 24) >> 2] = stat.gid;
    HEAP32[(buf + 28) >> 2] = stat.rdev;
    HEAP32[(buf + 32) >> 2] = 0;
    (tempI64 = [
      stat.size >>> 0,
      ((tempDouble = stat.size),
      +Math.abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0),
    ]),
      (HEAP32[(buf + 40) >> 2] = tempI64[0]),
      (HEAP32[(buf + 44) >> 2] = tempI64[1]);
    HEAP32[(buf + 48) >> 2] = 4096;
    HEAP32[(buf + 52) >> 2] = stat.blocks;
    HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
    HEAP32[(buf + 60) >> 2] = 0;
    HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
    HEAP32[(buf + 68) >> 2] = 0;
    HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
    HEAP32[(buf + 76) >> 2] = 0;
    (tempI64 = [
      stat.ino >>> 0,
      ((tempDouble = stat.ino),
      +Math.abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0),
    ]),
      (HEAP32[(buf + 80) >> 2] = tempI64[0]),
      (HEAP32[(buf + 84) >> 2] = tempI64[1]);
    return 0;
  },
  doMsync: function (addr, stream, len, flags, offset) {
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  doMkdir: function (path, mode) {
    path = PATH.normalize(path);
    if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
    FS.mkdir(path, mode, 0);
    return 0;
  },
  doMknod: function (path, mode, dev) {
    switch (mode & 61440) {
      case 32768:
      case 8192:
      case 24576:
      case 4096:
      case 49152:
        break;
      default:
        return -28;
    }
    FS.mknod(path, mode, dev);
    return 0;
  },
  doReadlink: function (path, buf, bufsize) {
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize, lengthBytesUTF8(ret));
    var endChar = HEAP8[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    HEAP8[buf + len] = endChar;
    return len;
  },
  doAccess: function (path, amode) {
    if (amode & ~7) {
      return -28;
    }
    var node;
    var lookup = FS.lookupPath(path, { follow: true });
    node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  },
  doDup: function (path, flags, suggestFD) {
    var suggest = FS.getStream(suggestFD);
    if (suggest) FS.close(suggest);
    return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
  },
  doReadv: function (stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.read(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) break;
    }
    return ret;
  },
  doWritev: function (stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.write(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
    }
    return ret;
  },
  varargs: undefined,
  get: function () {
    SYSCALLS.varargs += 4;
    var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
    return ret;
  },
  getStr: function (ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  },
  getStreamFromFD: function (fd) {
    var stream = FS.getStream(fd);
    if (!stream) throw new FS.ErrnoError(8);
    return stream;
  },
  get64: function (low, high) {
    return low;
  },
};
function ___sys__newselect(nfds, readfds, writefds, exceptfds, timeout) {
  try {
    var total = 0;
    var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0,
      srcReadHigh = readfds ? HEAP32[(readfds + 4) >> 2] : 0;
    var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0,
      srcWriteHigh = writefds ? HEAP32[(writefds + 4) >> 2] : 0;
    var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0,
      srcExceptHigh = exceptfds ? HEAP32[(exceptfds + 4) >> 2] : 0;
    var dstReadLow = 0,
      dstReadHigh = 0;
    var dstWriteLow = 0,
      dstWriteHigh = 0;
    var dstExceptLow = 0,
      dstExceptHigh = 0;
    var allLow =
      (readfds ? HEAP32[readfds >> 2] : 0) |
      (writefds ? HEAP32[writefds >> 2] : 0) |
      (exceptfds ? HEAP32[exceptfds >> 2] : 0);
    var allHigh =
      (readfds ? HEAP32[(readfds + 4) >> 2] : 0) |
      (writefds ? HEAP32[(writefds + 4) >> 2] : 0) |
      (exceptfds ? HEAP32[(exceptfds + 4) >> 2] : 0);
    var check = function (fd, low, high, val) {
      return fd < 32 ? low & val : high & val;
    };
    for (var fd = 0; fd < nfds; fd++) {
      var mask = 1 << fd % 32;
      if (!check(fd, allLow, allHigh, mask)) {
        continue;
      }
      var stream = FS.getStream(fd);
      if (!stream) throw new FS.ErrnoError(8);
      var flags = SYSCALLS.DEFAULT_POLLMASK;
      if (stream.stream_ops.poll) {
        flags = stream.stream_ops.poll(stream);
      }
      if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
        fd < 32
          ? (dstReadLow = dstReadLow | mask)
          : (dstReadHigh = dstReadHigh | mask);
        total++;
      }
      if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
        fd < 32
          ? (dstWriteLow = dstWriteLow | mask)
          : (dstWriteHigh = dstWriteHigh | mask);
        total++;
      }
      if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
        fd < 32
          ? (dstExceptLow = dstExceptLow | mask)
          : (dstExceptHigh = dstExceptHigh | mask);
        total++;
      }
    }
    if (readfds) {
      HEAP32[readfds >> 2] = dstReadLow;
      HEAP32[(readfds + 4) >> 2] = dstReadHigh;
    }
    if (writefds) {
      HEAP32[writefds >> 2] = dstWriteLow;
      HEAP32[(writefds + 4) >> 2] = dstWriteHigh;
    }
    if (exceptfds) {
      HEAP32[exceptfds >> 2] = dstExceptLow;
      HEAP32[(exceptfds + 4) >> 2] = dstExceptHigh;
    }
    return total;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
var SOCKFS = {
  mount: function (mount) {
    Module["websocket"] =
      Module["websocket"] && "object" === typeof Module["websocket"]
        ? Module["websocket"]
        : {};
    Module["websocket"]._callbacks = {};
    Module["websocket"]["on"] = function (event, callback) {
      if ("function" === typeof callback) {
        this._callbacks[event] = callback;
      }
      return this;
    };
    Module["websocket"].emit = function (event, param) {
      if ("function" === typeof this._callbacks[event]) {
        this._callbacks[event].call(this, param);
      }
    };
    return FS.createNode(null, "/", 16384 | 511, 0);
  },
  createSocket: function (family, type, protocol) {
    type &= ~526336;
    var streaming = type == 1;
    if (protocol) {
      assert(streaming == (protocol == 6));
    }
    var sock = {
      family: family,
      type: type,
      protocol: protocol,
      server: null,
      error: null,
      peers: {},
      pending: [],
      recv_queue: [],
      sock_ops: SOCKFS.websocket_sock_ops,
    };
    var name = SOCKFS.nextname();
    var node = FS.createNode(SOCKFS.root, name, 49152, 0);
    node.sock = sock;
    var stream = FS.createStream({
      path: name,
      node: node,
      flags: 2,
      seekable: false,
      stream_ops: SOCKFS.stream_ops,
    });
    sock.stream = stream;
    return sock;
  },
  getSocket: function (fd) {
    var stream = FS.getStream(fd);
    if (!stream || !FS.isSocket(stream.node.mode)) {
      return null;
    }
    return stream.node.sock;
  },
  stream_ops: {
    poll: function (stream) {
      var sock = stream.node.sock;
      return sock.sock_ops.poll(sock);
    },
    ioctl: function (stream, request, varargs) {
      var sock = stream.node.sock;
      return sock.sock_ops.ioctl(sock, request, varargs);
    },
    read: function (stream, buffer, offset, length, position) {
      var sock = stream.node.sock;
      var msg = sock.sock_ops.recvmsg(sock, length);
      if (!msg) {
        return 0;
      }
      buffer.set(msg.buffer, offset);
      return msg.buffer.length;
    },
    write: function (stream, buffer, offset, length, position) {
      var sock = stream.node.sock;
      return sock.sock_ops.sendmsg(sock, buffer, offset, length);
    },
    close: function (stream) {
      var sock = stream.node.sock;
      sock.sock_ops.close(sock);
    },
  },
  nextname: function () {
    if (!SOCKFS.nextname.current) {
      SOCKFS.nextname.current = 0;
    }
    return "socket[" + SOCKFS.nextname.current++ + "]";
  },
  websocket_sock_ops: {
    createPeer: function (sock, addr, port) {
      var ws;
      if (typeof addr === "object") {
        ws = addr;
        addr = null;
        port = null;
      }
      if (ws) {
        if (ws._socket) {
          addr = ws._socket.remoteAddress;
          port = ws._socket.remotePort;
        } else {
          var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
          if (!result) {
            throw new Error(
              "WebSocket URL must be in the format ws(s)://address:port"
            );
          }
          addr = result[1];
          port = parseInt(result[2], 10);
        }
      } else {
        try {
          var runtimeConfig =
            Module["websocket"] && "object" === typeof Module["websocket"];
          var url = "ws:#".replace("#", "//");
          if (runtimeConfig) {
            if ("string" === typeof Module["websocket"]["url"]) {
              url = Module["websocket"]["url"];
            }
          }
          if (url === "ws://" || url === "wss://") {
            var parts = addr.split("/");
            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
          }
          var subProtocols = "binary";
          if (runtimeConfig) {
            if ("string" === typeof Module["websocket"]["subprotocol"]) {
              subProtocols = Module["websocket"]["subprotocol"];
            }
          }
          var opts = undefined;
          if (subProtocols !== "null") {
            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
            opts = ENVIRONMENT_IS_NODE
              ? { protocol: subProtocols.toString() }
              : subProtocols;
          }
          if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
            subProtocols = "null";
            opts = undefined;
          }
          var WebSocketConstructor;
          {
            WebSocketConstructor = WebSocket;
          }
          ws = new WebSocketConstructor(url, opts);
          ws.binaryType = "arraybuffer";
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
        }
      }
      var peer = { addr: addr, port: port, socket: ws, dgram_send_queue: [] };
      SOCKFS.websocket_sock_ops.addPeer(sock, peer);
      SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
      if (sock.type === 2 && typeof sock.sport !== "undefined") {
        peer.dgram_send_queue.push(
          new Uint8Array([
            255,
            255,
            255,
            255,
            "p".charCodeAt(0),
            "o".charCodeAt(0),
            "r".charCodeAt(0),
            "t".charCodeAt(0),
            (sock.sport & 65280) >> 8,
            sock.sport & 255,
          ])
        );
      }
      return peer;
    },
    getPeer: function (sock, addr, port) {
      return sock.peers[addr + ":" + port];
    },
    addPeer: function (sock, peer) {
      sock.peers[peer.addr + ":" + peer.port] = peer;
    },
    removePeer: function (sock, peer) {
      delete sock.peers[peer.addr + ":" + peer.port];
    },
    handlePeerEvents: function (sock, peer) {
      var first = true;
      var handleOpen = function () {
        Module["websocket"].emit("open", sock.stream.fd);
        try {
          var queued = peer.dgram_send_queue.shift();
          while (queued) {
            peer.socket.send(queued);
            queued = peer.dgram_send_queue.shift();
          }
        } catch (e) {
          peer.socket.close();
        }
      };
      function handleMessage(data) {
        if (typeof data === "string") {
          var encoder = new TextEncoder();
          data = encoder.encode(data);
        } else {
          assert(data.byteLength !== undefined);
          if (data.byteLength == 0) {
            return;
          } else {
            data = new Uint8Array(data);
          }
        }
        var wasfirst = first;
        first = false;
        if (
          wasfirst &&
          data.length === 10 &&
          data[0] === 255 &&
          data[1] === 255 &&
          data[2] === 255 &&
          data[3] === 255 &&
          data[4] === "p".charCodeAt(0) &&
          data[5] === "o".charCodeAt(0) &&
          data[6] === "r".charCodeAt(0) &&
          data[7] === "t".charCodeAt(0)
        ) {
          var newport = (data[8] << 8) | data[9];
          SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          peer.port = newport;
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          return;
        }
        sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
        Module["websocket"].emit("message", sock.stream.fd);
      }
      if (ENVIRONMENT_IS_NODE) {
        peer.socket.on("open", handleOpen);
        peer.socket.on("message", function (data, flags) {
          if (!flags.binary) {
            return;
          }
          handleMessage(new Uint8Array(data).buffer);
        });
        peer.socket.on("close", function () {
          Module["websocket"].emit("close", sock.stream.fd);
        });
        peer.socket.on("error", function (error) {
          sock.error = ERRNO_CODES.ECONNREFUSED;
          Module["websocket"].emit("error", [
            sock.stream.fd,
            sock.error,
            "ECONNREFUSED: Connection refused",
          ]);
        });
      } else {
        peer.socket.onopen = handleOpen;
        peer.socket.onclose = function () {
          Module["websocket"].emit("close", sock.stream.fd);
        };
        peer.socket.onmessage = function peer_socket_onmessage(event) {
          handleMessage(event.data);
        };
        peer.socket.onerror = function (error) {
          sock.error = ERRNO_CODES.ECONNREFUSED;
          Module["websocket"].emit("error", [
            sock.stream.fd,
            sock.error,
            "ECONNREFUSED: Connection refused",
          ]);
        };
      }
    },
    poll: function (sock) {
      if (sock.type === 1 && sock.server) {
        return sock.pending.length ? 64 | 1 : 0;
      }
      var mask = 0;
      var dest =
        sock.type === 1
          ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport)
          : null;
      if (
        sock.recv_queue.length ||
        !dest ||
        (dest && dest.socket.readyState === dest.socket.CLOSING) ||
        (dest && dest.socket.readyState === dest.socket.CLOSED)
      ) {
        mask |= 64 | 1;
      }
      if (!dest || (dest && dest.socket.readyState === dest.socket.OPEN)) {
        mask |= 4;
      }
      if (
        (dest && dest.socket.readyState === dest.socket.CLOSING) ||
        (dest && dest.socket.readyState === dest.socket.CLOSED)
      ) {
        mask |= 16;
      }
      return mask;
    },
    ioctl: function (sock, request, arg) {
      switch (request) {
        case 21531:
          var bytes = 0;
          if (sock.recv_queue.length) {
            bytes = sock.recv_queue[0].data.length;
          }
          HEAP32[arg >> 2] = bytes;
          return 0;
        default:
          return ERRNO_CODES.EINVAL;
      }
    },
    close: function (sock) {
      if (sock.server) {
        try {
          sock.server.close();
        } catch (e) {}
        sock.server = null;
      }
      var peers = Object.keys(sock.peers);
      for (var i = 0; i < peers.length; i++) {
        var peer = sock.peers[peers[i]];
        try {
          peer.socket.close();
        } catch (e) {}
        SOCKFS.websocket_sock_ops.removePeer(sock, peer);
      }
      return 0;
    },
    bind: function (sock, addr, port) {
      if (
        typeof sock.saddr !== "undefined" ||
        typeof sock.sport !== "undefined"
      ) {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
      }
      sock.saddr = addr;
      sock.sport = port;
      if (sock.type === 2) {
        if (sock.server) {
          sock.server.close();
          sock.server = null;
        }
        try {
          sock.sock_ops.listen(sock, 0);
        } catch (e) {
          if (!(e instanceof FS.ErrnoError)) throw e;
          if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
        }
      }
    },
    connect: function (sock, addr, port) {
      if (sock.server) {
        throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
      }
      if (
        typeof sock.daddr !== "undefined" &&
        typeof sock.dport !== "undefined"
      ) {
        var dest = SOCKFS.websocket_sock_ops.getPeer(
          sock,
          sock.daddr,
          sock.dport
        );
        if (dest) {
          if (dest.socket.readyState === dest.socket.CONNECTING) {
            throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
          } else {
            throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
          }
        }
      }
      var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
      sock.daddr = peer.addr;
      sock.dport = peer.port;
      throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
    },
    listen: function (sock, backlog) {
      if (!ENVIRONMENT_IS_NODE) {
        throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
      }
    },
    accept: function (listensock) {
      if (!listensock.server) {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
      }
      var newsock = listensock.pending.shift();
      newsock.stream.flags = listensock.stream.flags;
      return newsock;
    },
    getname: function (sock, peer) {
      var addr, port;
      if (peer) {
        if (sock.daddr === undefined || sock.dport === undefined) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
        }
        addr = sock.daddr;
        port = sock.dport;
      } else {
        addr = sock.saddr || 0;
        port = sock.sport || 0;
      }
      return { addr: addr, port: port };
    },
    sendmsg: function (sock, buffer, offset, length, addr, port) {
      if (sock.type === 2) {
        if (addr === undefined || port === undefined) {
          addr = sock.daddr;
          port = sock.dport;
        }
        if (addr === undefined || port === undefined) {
          throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
        }
      } else {
        addr = sock.daddr;
        port = sock.dport;
      }
      var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
      if (sock.type === 1) {
        if (
          !dest ||
          dest.socket.readyState === dest.socket.CLOSING ||
          dest.socket.readyState === dest.socket.CLOSED
        ) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
        } else if (dest.socket.readyState === dest.socket.CONNECTING) {
          throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
        }
      }
      if (ArrayBuffer.isView(buffer)) {
        offset += buffer.byteOffset;
        buffer = buffer.buffer;
      }
      var data;
      data = buffer.slice(offset, offset + length);
      if (sock.type === 2) {
        if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
          if (
            !dest ||
            dest.socket.readyState === dest.socket.CLOSING ||
            dest.socket.readyState === dest.socket.CLOSED
          ) {
            dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          }
          dest.dgram_send_queue.push(data);
          return length;
        }
      }
      try {
        dest.socket.send(data);
        return length;
      } catch (e) {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
      }
    },
    recvmsg: function (sock, length) {
      if (sock.type === 1 && sock.server) {
        throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
      }
      var queued = sock.recv_queue.shift();
      if (!queued) {
        if (sock.type === 1) {
          var dest = SOCKFS.websocket_sock_ops.getPeer(
            sock,
            sock.daddr,
            sock.dport
          );
          if (!dest) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          } else if (
            dest.socket.readyState === dest.socket.CLOSING ||
            dest.socket.readyState === dest.socket.CLOSED
          ) {
            return null;
          } else {
            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
          }
        } else {
          throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
        }
      }
      var queuedLength = queued.data.byteLength || queued.data.length;
      var queuedOffset = queued.data.byteOffset || 0;
      var queuedBuffer = queued.data.buffer || queued.data;
      var bytesRead = Math.min(length, queuedLength);
      var res = {
        buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
        addr: queued.addr,
        port: queued.port,
      };
      if (sock.type === 1 && bytesRead < queuedLength) {
        var bytesRemaining = queuedLength - bytesRead;
        queued.data = new Uint8Array(
          queuedBuffer,
          queuedOffset + bytesRead,
          bytesRemaining
        );
        sock.recv_queue.unshift(queued);
      }
      return res;
    },
  },
};
function getSocketFromFD(fd) {
  var socket = SOCKFS.getSocket(fd);
  if (!socket) throw new FS.ErrnoError(8);
  return socket;
}
function inetPton4(str) {
  var b = str.split(".");
  for (var i = 0; i < 4; i++) {
    var tmp = Number(b[i]);
    if (isNaN(tmp)) return null;
    b[i] = tmp;
  }
  return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
}
function jstoi_q(str) {
  return parseInt(str);
}
function inetPton6(str) {
  var words;
  var w, offset, z;
  var valid6regx =
    /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
  var parts = [];
  if (!valid6regx.test(str)) {
    return null;
  }
  if (str === "::") {
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }
  if (str.startsWith("::")) {
    str = str.replace("::", "Z:");
  } else {
    str = str.replace("::", ":Z:");
  }
  if (str.indexOf(".") > 0) {
    str = str.replace(new RegExp("[.]", "g"), ":");
    words = str.split(":");
    words[words.length - 4] =
      jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
    words[words.length - 3] =
      jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
    words = words.slice(0, words.length - 2);
  } else {
    words = str.split(":");
  }
  offset = 0;
  z = 0;
  for (w = 0; w < words.length; w++) {
    if (typeof words[w] === "string") {
      if (words[w] === "Z") {
        for (z = 0; z < 8 - words.length + 1; z++) {
          parts[w + z] = 0;
        }
        offset = z - 1;
      } else {
        parts[w + offset] = _htons(parseInt(words[w], 16));
      }
    } else {
      parts[w + offset] = words[w];
    }
  }
  return [
    (parts[1] << 16) | parts[0],
    (parts[3] << 16) | parts[2],
    (parts[5] << 16) | parts[4],
    (parts[7] << 16) | parts[6],
  ];
}
function writeSockaddr(sa, family, addr, port, addrlen) {
  switch (family) {
    case 2:
      addr = inetPton4(addr);
      if (addrlen) {
        HEAP32[addrlen >> 2] = 16;
      }
      HEAP16[sa >> 1] = family;
      HEAP32[(sa + 4) >> 2] = addr;
      HEAP16[(sa + 2) >> 1] = _htons(port);
      (tempI64 = [
        0 >>> 0,
        ((tempDouble = 0),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(sa + 8) >> 2] = tempI64[0]),
        (HEAP32[(sa + 12) >> 2] = tempI64[1]);
      break;
    case 10:
      addr = inetPton6(addr);
      if (addrlen) {
        HEAP32[addrlen >> 2] = 28;
      }
      HEAP32[sa >> 2] = family;
      HEAP32[(sa + 8) >> 2] = addr[0];
      HEAP32[(sa + 12) >> 2] = addr[1];
      HEAP32[(sa + 16) >> 2] = addr[2];
      HEAP32[(sa + 20) >> 2] = addr[3];
      HEAP16[(sa + 2) >> 1] = _htons(port);
      HEAP32[(sa + 4) >> 2] = 0;
      HEAP32[(sa + 24) >> 2] = 0;
      break;
    default:
      return 5;
  }
  return 0;
}
var DNS = {
  address_map: { id: 1, addrs: {}, names: {} },
  lookup_name: function (name) {
    var res = inetPton4(name);
    if (res !== null) {
      return name;
    }
    res = inetPton6(name);
    if (res !== null) {
      return name;
    }
    var addr;
    if (DNS.address_map.addrs[name]) {
      addr = DNS.address_map.addrs[name];
    } else {
      var id = DNS.address_map.id++;
      assert(id < 65535, "exceeded max address mappings of 65535");
      addr = "172.29." + (id & 255) + "." + (id & 65280);
      DNS.address_map.names[addr] = name;
      DNS.address_map.addrs[name] = addr;
    }
    return addr;
  },
  lookup_addr: function (addr) {
    if (DNS.address_map.names[addr]) {
      return DNS.address_map.names[addr];
    }
    return null;
  },
};
function ___sys_accept4(fd, addr, addrlen, flags) {
  try {
    var sock = getSocketFromFD(fd);
    var newsock = sock.sock_ops.accept(sock);
    if (addr) {
      var errno = writeSockaddr(
        addr,
        newsock.family,
        DNS.lookup_name(newsock.daddr),
        newsock.dport,
        addrlen
      );
    }
    return newsock.stream.fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_access(path, amode) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doAccess(path, amode);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function inetNtop4(addr) {
  return (
    (addr & 255) +
    "." +
    ((addr >> 8) & 255) +
    "." +
    ((addr >> 16) & 255) +
    "." +
    ((addr >> 24) & 255)
  );
}
function inetNtop6(ints) {
  var str = "";
  var word = 0;
  var longest = 0;
  var lastzero = 0;
  var zstart = 0;
  var len = 0;
  var i = 0;
  var parts = [
    ints[0] & 65535,
    ints[0] >> 16,
    ints[1] & 65535,
    ints[1] >> 16,
    ints[2] & 65535,
    ints[2] >> 16,
    ints[3] & 65535,
    ints[3] >> 16,
  ];
  var hasipv4 = true;
  var v4part = "";
  for (i = 0; i < 5; i++) {
    if (parts[i] !== 0) {
      hasipv4 = false;
      break;
    }
  }
  if (hasipv4) {
    v4part = inetNtop4(parts[6] | (parts[7] << 16));
    if (parts[5] === -1) {
      str = "::ffff:";
      str += v4part;
      return str;
    }
    if (parts[5] === 0) {
      str = "::";
      if (v4part === "0.0.0.0") v4part = "";
      if (v4part === "0.0.0.1") v4part = "1";
      str += v4part;
      return str;
    }
  }
  for (word = 0; word < 8; word++) {
    if (parts[word] === 0) {
      if (word - lastzero > 1) {
        len = 0;
      }
      lastzero = word;
      len++;
    }
    if (len > longest) {
      longest = len;
      zstart = word - longest + 1;
    }
  }
  for (word = 0; word < 8; word++) {
    if (longest > 1) {
      if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
        if (word === zstart) {
          str += ":";
          if (zstart === 0) str += ":";
        }
        continue;
      }
    }
    str += Number(_ntohs(parts[word] & 65535)).toString(16);
    str += word < 7 ? ":" : "";
  }
  return str;
}
function readSockaddr(sa, salen) {
  var family = HEAP16[sa >> 1];
  var port = _ntohs(HEAPU16[(sa + 2) >> 1]);
  var addr;
  switch (family) {
    case 2:
      if (salen !== 16) {
        return { errno: 28 };
      }
      addr = HEAP32[(sa + 4) >> 2];
      addr = inetNtop4(addr);
      break;
    case 10:
      if (salen !== 28) {
        return { errno: 28 };
      }
      addr = [
        HEAP32[(sa + 8) >> 2],
        HEAP32[(sa + 12) >> 2],
        HEAP32[(sa + 16) >> 2],
        HEAP32[(sa + 20) >> 2],
      ];
      addr = inetNtop6(addr);
      break;
    default:
      return { errno: 5 };
  }
  return { family: family, addr: addr, port: port };
}
function getSocketAddress(addrp, addrlen, allowNull) {
  if (allowNull && addrp === 0) return null;
  var info = readSockaddr(addrp, addrlen);
  if (info.errno) throw new FS.ErrnoError(info.errno);
  info.addr = DNS.lookup_addr(info.addr) || info.addr;
  return info;
}
function ___sys_bind(fd, addr, addrlen) {
  try {
    var sock = getSocketFromFD(fd);
    var info = getSocketAddress(addr, addrlen);
    sock.sock_ops.bind(sock, info.addr, info.port);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_chdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chdir(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_chmod(path, mode) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chmod(path, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_chown32(path, owner, group) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chown(path, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_connect(fd, addr, addrlen) {
  try {
    var sock = getSocketFromFD(fd);
    var info = getSocketAddress(addr, addrlen);
    sock.sock_ops.connect(sock, info.addr, info.port);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_dup(fd) {
  try {
    var old = SYSCALLS.getStreamFromFD(fd);
    return FS.open(old.path, old.flags, 0).fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_dup2(oldfd, suggestFD) {
  try {
    var old = SYSCALLS.getStreamFromFD(oldfd);
    if (old.fd === suggestFD) return suggestFD;
    return SYSCALLS.doDup(old.path, old.flags, suggestFD);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fchdir(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.chdir(stream.path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fchmod(fd, mode) {
  try {
    FS.fchmod(fd, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fchmodat(dirfd, path, mode, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    FS.chmod(path, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fchown32(fd, owner, group) {
  try {
    FS.fchown(fd, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
      case 0: {
        var arg = SYSCALLS.get();
        if (arg < 0) {
          return -28;
        }
        var newStream;
        newStream = FS.open(stream.path, stream.flags, 0, arg);
        return newStream.fd;
      }
      case 1:
      case 2:
        return 0;
      case 3:
        return stream.flags;
      case 4: {
        var arg = SYSCALLS.get();
        stream.flags |= arg;
        return 0;
      }
      case 12: {
        var arg = SYSCALLS.get();
        var offset = 0;
        HEAP16[(arg + offset) >> 1] = 2;
        return 0;
      }
      case 13:
      case 14:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        setErrNo(28);
        return -1;
      default: {
        return -28;
      }
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fdatasync(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fstat64(fd, buf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return SYSCALLS.doStat(FS.stat, stream.path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fstatat64(dirfd, path, buf, flags) {
  try {
    path = SYSCALLS.getStr(path);
    var nofollow = flags & 256;
    var allowEmpty = flags & 4096;
    flags = flags & ~4352;
    path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
    return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fstatfs64(fd, size, buf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return ___sys_statfs64(0, size, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_ftruncate64(fd, zero, low, high) {
  try {
    var length = SYSCALLS.get64(low, high);
    FS.ftruncate(fd, length);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getcwd(buf, size) {
  try {
    if (size === 0) return -28;
    var cwd = FS.cwd();
    var cwdLengthInBytes = lengthBytesUTF8(cwd);
    if (size < cwdLengthInBytes + 1) return -68;
    stringToUTF8(cwd, buf, size);
    return buf;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getdents64(fd, dirp, count) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (!stream.getdents) {
      stream.getdents = FS.readdir(stream.path);
    }
    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);
    var idx = Math.floor(off / struct_size);
    while (idx < stream.getdents.length && pos + struct_size <= count) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name[0] === ".") {
        id = 1;
        type = 4;
      } else {
        var child = FS.lookupNode(stream.node, name);
        id = child.id;
        type = FS.isChrdev(child.mode)
          ? 2
          : FS.isDir(child.mode)
          ? 4
          : FS.isLink(child.mode)
          ? 10
          : 8;
      }
      (tempI64 = [
        id >>> 0,
        ((tempDouble = id),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
        (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
      (tempI64 = [
        ((idx + 1) * struct_size) >>> 0,
        ((tempDouble = (idx + 1) * struct_size),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
        (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
      HEAP16[(dirp + pos + 16) >> 1] = 280;
      HEAP8[(dirp + pos + 18) >> 0] = type;
      stringToUTF8(name, dirp + pos + 19, 256);
      pos += struct_size;
      idx += 1;
    }
    FS.llseek(stream, idx * struct_size, 0);
    return pos;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getegid32() {
  return 0;
}
function ___sys_geteuid32() {
  return ___sys_getegid32();
}
function ___sys_getgid32() {
  return ___sys_getegid32();
}
function ___sys_getgroups32(size, list) {
  if (size < 1) return -28;
  HEAP32[list >> 2] = 0;
  return 1;
}
function ___sys_getpeername(fd, addr, addrlen) {
  try {
    var sock = getSocketFromFD(fd);
    if (!sock.daddr) {
      return -53;
    }
    var errno = writeSockaddr(
      addr,
      sock.family,
      DNS.lookup_name(sock.daddr),
      sock.dport,
      addrlen
    );
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getpgid(pid) {
  if (pid && pid !== 42) return -71;
  return 42;
}
function ___sys_getpid() {
  return 42;
}
function ___sys_getppid() {
  return 1;
}
function ___sys_getresgid32(ruid, euid, suid) {
  HEAP32[ruid >> 2] = 0;
  HEAP32[euid >> 2] = 0;
  HEAP32[suid >> 2] = 0;
  return 0;
}
function ___sys_getresuid32(a0, a1, a2) {
  return ___sys_getresgid32(a0, a1, a2);
}
function ___sys_getsid(pid) {
  if (pid && pid !== 42) return -71;
  return 42;
}
function ___sys_getsockname(fd, addr, addrlen) {
  try {
    err("__sys_getsockname " + fd);
    var sock = getSocketFromFD(fd);
    var errno = writeSockaddr(
      addr,
      sock.family,
      DNS.lookup_name(sock.saddr || "0.0.0.0"),
      sock.sport,
      addrlen
    );
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getsockopt(fd, level, optname, optval, optlen) {
  try {
    var sock = getSocketFromFD(fd);
    if (level === 1) {
      if (optname === 4) {
        HEAP32[optval >> 2] = sock.error;
        HEAP32[optlen >> 2] = 4;
        sock.error = null;
        return 0;
      }
    }
    return -50;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getuid32() {
  return ___sys_getegid32();
}
function ___sys_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
      case 21509:
      case 21505: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21519: {
        if (!stream.tty) return -59;
        var argp = SYSCALLS.get();
        HEAP32[argp >> 2] = 0;
        return 0;
      }
      case 21520: {
        if (!stream.tty) return -59;
        return -28;
      }
      case 21531: {
        var argp = SYSCALLS.get();
        return FS.ioctl(stream, op, argp);
      }
      case 21523: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21524: {
        if (!stream.tty) return -59;
        return 0;
      }
      default:
        abort("bad ioctl syscall " + op);
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_lchown32(path, owner, group) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chown(path, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_link(oldpath, newpath) {
  return -34;
}
function ___sys_listen(fd, backlog) {
  try {
    var sock = getSocketFromFD(fd);
    sock.sock_ops.listen(sock, backlog);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_lstat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.lstat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_mkdir(path, mode) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doMkdir(path, mode);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_mknod(path, mode, dev) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doMknod(path, mode, dev);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_nice(inc) {
  return -63;
}
function ___sys_open(path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var pathname = SYSCALLS.getStr(path);
    var mode = varargs ? SYSCALLS.get() : 0;
    var stream = FS.open(pathname, flags, mode);
    return stream.fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? SYSCALLS.get() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
var PIPEFS = {
  BUCKET_BUFFER_SIZE: 8192,
  mount: function (mount) {
    return FS.createNode(null, "/", 16384 | 511, 0);
  },
  createPipe: function () {
    var pipe = { buckets: [] };
    pipe.buckets.push({
      buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
      offset: 0,
      roffset: 0,
    });
    var rName = PIPEFS.nextname();
    var wName = PIPEFS.nextname();
    var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
    var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
    rNode.pipe = pipe;
    wNode.pipe = pipe;
    var readableStream = FS.createStream({
      path: rName,
      node: rNode,
      flags: 0,
      seekable: false,
      stream_ops: PIPEFS.stream_ops,
    });
    rNode.stream = readableStream;
    var writableStream = FS.createStream({
      path: wName,
      node: wNode,
      flags: 1,
      seekable: false,
      stream_ops: PIPEFS.stream_ops,
    });
    wNode.stream = writableStream;
    return { readable_fd: readableStream.fd, writable_fd: writableStream.fd };
  },
  stream_ops: {
    poll: function (stream) {
      var pipe = stream.node.pipe;
      if ((stream.flags & 2097155) === 1) {
        return 256 | 4;
      } else {
        if (pipe.buckets.length > 0) {
          for (var i = 0; i < pipe.buckets.length; i++) {
            var bucket = pipe.buckets[i];
            if (bucket.offset - bucket.roffset > 0) {
              return 64 | 1;
            }
          }
        }
      }
      return 0;
    },
    ioctl: function (stream, request, varargs) {
      return ERRNO_CODES.EINVAL;
    },
    fsync: function (stream) {
      return ERRNO_CODES.EINVAL;
    },
    read: function (stream, buffer, offset, length, position) {
      var pipe = stream.node.pipe;
      var currentLength = 0;
      for (var i = 0; i < pipe.buckets.length; i++) {
        var bucket = pipe.buckets[i];
        currentLength += bucket.offset - bucket.roffset;
      }
      assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
      var data = buffer.subarray(offset, offset + length);
      if (length <= 0) {
        return 0;
      }
      if (currentLength == 0) {
        throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
      }
      var toRead = Math.min(currentLength, length);
      var totalRead = toRead;
      var toRemove = 0;
      for (var i = 0; i < pipe.buckets.length; i++) {
        var currBucket = pipe.buckets[i];
        var bucketSize = currBucket.offset - currBucket.roffset;
        if (toRead <= bucketSize) {
          var tmpSlice = currBucket.buffer.subarray(
            currBucket.roffset,
            currBucket.offset
          );
          if (toRead < bucketSize) {
            tmpSlice = tmpSlice.subarray(0, toRead);
            currBucket.roffset += toRead;
          } else {
            toRemove++;
          }
          data.set(tmpSlice);
          break;
        } else {
          var tmpSlice = currBucket.buffer.subarray(
            currBucket.roffset,
            currBucket.offset
          );
          data.set(tmpSlice);
          data = data.subarray(tmpSlice.byteLength);
          toRead -= tmpSlice.byteLength;
          toRemove++;
        }
      }
      if (toRemove && toRemove == pipe.buckets.length) {
        toRemove--;
        pipe.buckets[toRemove].offset = 0;
        pipe.buckets[toRemove].roffset = 0;
      }
      pipe.buckets.splice(0, toRemove);
      return totalRead;
    },
    write: function (stream, buffer, offset, length, position) {
      var pipe = stream.node.pipe;
      assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
      var data = buffer.subarray(offset, offset + length);
      var dataLen = data.byteLength;
      if (dataLen <= 0) {
        return 0;
      }
      var currBucket = null;
      if (pipe.buckets.length == 0) {
        currBucket = {
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: 0,
          roffset: 0,
        };
        pipe.buckets.push(currBucket);
      } else {
        currBucket = pipe.buckets[pipe.buckets.length - 1];
      }
      assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
      var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
      if (freeBytesInCurrBuffer >= dataLen) {
        currBucket.buffer.set(data, currBucket.offset);
        currBucket.offset += dataLen;
        return dataLen;
      } else if (freeBytesInCurrBuffer > 0) {
        currBucket.buffer.set(
          data.subarray(0, freeBytesInCurrBuffer),
          currBucket.offset
        );
        currBucket.offset += freeBytesInCurrBuffer;
        data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
      }
      var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
      var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
      for (var i = 0; i < numBuckets; i++) {
        var newBucket = {
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: PIPEFS.BUCKET_BUFFER_SIZE,
          roffset: 0,
        };
        pipe.buckets.push(newBucket);
        newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
        data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
      }
      if (remElements > 0) {
        var newBucket = {
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: data.byteLength,
          roffset: 0,
        };
        pipe.buckets.push(newBucket);
        newBucket.buffer.set(data);
      }
      return dataLen;
    },
    close: function (stream) {
      var pipe = stream.node.pipe;
      pipe.buckets = null;
    },
  },
  nextname: function () {
    if (!PIPEFS.nextname.current) {
      PIPEFS.nextname.current = 0;
    }
    return "pipe[" + PIPEFS.nextname.current++ + "]";
  },
};
function ___sys_pipe(fdPtr) {
  try {
    if (fdPtr == 0) {
      throw new FS.ErrnoError(21);
    }
    var res = PIPEFS.createPipe();
    HEAP32[fdPtr >> 2] = res.readable_fd;
    HEAP32[(fdPtr + 4) >> 2] = res.writable_fd;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_pipe2(fds, flags) {
  return -52;
}
function ___sys_poll(fds, nfds, timeout) {
  try {
    var nonzero = 0;
    for (var i = 0; i < nfds; i++) {
      var pollfd = fds + 8 * i;
      var fd = HEAP32[pollfd >> 2];
      var events = HEAP16[(pollfd + 4) >> 1];
      var mask = 32;
      var stream = FS.getStream(fd);
      if (stream) {
        mask = SYSCALLS.DEFAULT_POLLMASK;
        if (stream.stream_ops.poll) {
          mask = stream.stream_ops.poll(stream);
        }
      }
      mask &= events | 8 | 16;
      if (mask) nonzero++;
      HEAP16[(pollfd + 6) >> 1] = mask;
    }
    return nonzero;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_readlink(path, buf, bufsize) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doReadlink(path, buf, bufsize);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_recvfrom(fd, buf, len, flags, addr, addrlen) {
  try {
    var sock = getSocketFromFD(fd);
    var msg = sock.sock_ops.recvmsg(sock, len);
    if (!msg) return 0;
    if (addr) {
      var errno = writeSockaddr(
        addr,
        sock.family,
        DNS.lookup_name(msg.addr),
        msg.port,
        addrlen
      );
    }
    HEAPU8.set(msg.buffer, buf);
    return msg.buffer.byteLength;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rename(old_path, new_path) {
  try {
    old_path = SYSCALLS.getStr(old_path);
    new_path = SYSCALLS.getStr(new_path);
    FS.rename(old_path, new_path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rmdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_sendto(fd, message, length, flags, addr, addr_len) {
  try {
    var sock = getSocketFromFD(fd);
    var dest = getSocketAddress(addr, addr_len, true);
    if (!dest) {
      return FS.write(sock.stream, HEAP8, message, length);
    } else {
      return sock.sock_ops.sendmsg(
        sock,
        HEAP8,
        message,
        length,
        dest.addr,
        dest.port
      );
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_setpgid(pid, pgid) {
  if (pid && pid !== 42) return -71;
  if (pgid && pgid !== 42) return -63;
  return 0;
}
function ___sys_setsid() {
  return 0;
}
function ___sys_setsockopt(fd) {
  try {
    return -50;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_shutdown(fd, how) {
  try {
    getSocketFromFD(fd);
    return -52;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_socket(domain, type, protocol) {
  try {
    var sock = SOCKFS.createSocket(domain, type, protocol);
    return sock.stream.fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_socketpair() {
  try {
    return -52;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_stat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.stat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_statfs64(path, size, buf) {
  try {
    path = SYSCALLS.getStr(path);
    HEAP32[(buf + 4) >> 2] = 4096;
    HEAP32[(buf + 40) >> 2] = 4096;
    HEAP32[(buf + 8) >> 2] = 1e6;
    HEAP32[(buf + 12) >> 2] = 5e5;
    HEAP32[(buf + 16) >> 2] = 5e5;
    HEAP32[(buf + 20) >> 2] = FS.nextInode;
    HEAP32[(buf + 24) >> 2] = 1e6;
    HEAP32[(buf + 28) >> 2] = 42;
    HEAP32[(buf + 44) >> 2] = 2;
    HEAP32[(buf + 36) >> 2] = 255;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_symlink(target, linkpath) {
  try {
    target = SYSCALLS.getStr(target);
    linkpath = SYSCALLS.getStr(linkpath);
    FS.symlink(target, linkpath);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_umask(mask) {
  try {
    var old = SYSCALLS.umask;
    SYSCALLS.umask = mask;
    return old;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_uname(buf) {
  try {
    if (!buf) return -21;
    var layout = {
      __size__: 390,
      domainname: 325,
      machine: 260,
      nodename: 65,
      release: 130,
      sysname: 0,
      version: 195,
    };
    var copyString = function (element, value) {
      var offset = layout[element];
      writeAsciiToMemory(value, buf + offset);
    };
    copyString("sysname", "Emscripten");
    copyString("nodename", "emscripten");
    copyString("release", "1.0");
    copyString("version", "#1");
    copyString("machine", "wasm32");
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_unlink(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.unlink(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_wait4(pid, wstart, options, rusage) {
  try {
    return -52;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function _exit(status) {
  exit(status);
}
function __exit(a0) {
  return _exit(a0);
}
function _abort() {
  abort();
}
function _chroot(path) {
  setErrNo(2);
  return -1;
}
function _clock() {
  if (_clock.start === undefined) _clock.start = Date.now();
  return ((Date.now() - _clock.start) * (1e6 / 1e3)) | 0;
}
function _dlclose(handle) {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _dlerror() {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _dlopen(filename, flag) {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _dlsym(handle, symbol) {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _emscripten_set_main_loop_timing(mode, value) {
  Browser.mainLoop.timingMode = mode;
  Browser.mainLoop.timingValue = value;
  if (!Browser.mainLoop.func) {
    return 1;
  }
  if (!Browser.mainLoop.running) {
    Browser.mainLoop.running = true;
  }
  if (mode == 0) {
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_setTimeout() {
        var timeUntilNextTick =
          Math.max(
            0,
            Browser.mainLoop.tickStartTime + value - _emscripten_get_now()
          ) | 0;
        setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
      };
    Browser.mainLoop.method = "timeout";
  } else if (mode == 1) {
    Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
      Browser.requestAnimationFrame(Browser.mainLoop.runner);
    };
    Browser.mainLoop.method = "rAF";
  } else if (mode == 2) {
    if (typeof setImmediate === "undefined") {
      var setImmediates = [];
      var emscriptenMainLoopMessageId = "setimmediate";
      var Browser_setImmediate_messageHandler = function (event) {
        if (
          event.data === emscriptenMainLoopMessageId ||
          event.data.target === emscriptenMainLoopMessageId
        ) {
          event.stopPropagation();
          setImmediates.shift()();
        }
      };
      addEventListener("message", Browser_setImmediate_messageHandler, true);
      setImmediate = function Browser_emulated_setImmediate(func) {
        setImmediates.push(func);
        if (ENVIRONMENT_IS_WORKER) {
          if (Module["setImmediates"] === undefined)
            Module["setImmediates"] = [];
          Module["setImmediates"].push(func);
          postMessage({ target: emscriptenMainLoopMessageId });
        } else postMessage(emscriptenMainLoopMessageId, "*");
      };
    }
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_setImmediate() {
        setImmediate(Browser.mainLoop.runner);
      };
    Browser.mainLoop.method = "immediate";
  }
  return 0;
}
function maybeExit() {
  if (!keepRuntimeAlive()) {
    try {
      _exit(EXITSTATUS);
    } catch (e) {
      if (e instanceof ExitStatus) {
        return;
      }
      throw e;
    }
  }
}
function setMainLoop(
  browserIterationFunc,
  fps,
  simulateInfiniteLoop,
  arg,
  noSetTiming
) {
  assert(
    !Browser.mainLoop.func,
    "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
  );
  Browser.mainLoop.func = browserIterationFunc;
  Browser.mainLoop.arg = arg;
  var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  function checkIsRunning() {
    if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
      maybeExit();
      return false;
    }
    return true;
  }
  Browser.mainLoop.running = false;
  Browser.mainLoop.runner = function Browser_mainLoop_runner() {
    if (ABORT) return;
    if (Browser.mainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = Browser.mainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (Browser.mainLoop.remainingBlockers) {
        var remaining = Browser.mainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          Browser.mainLoop.remainingBlockers = next;
        } else {
          next = next + 0.5;
          Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      console.log(
        'main loop blocker "' +
          blocker.name +
          '" took ' +
          (Date.now() - start) +
          " ms"
      );
      Browser.mainLoop.updateStatus();
      if (!checkIsRunning()) return;
      setTimeout(Browser.mainLoop.runner, 0);
      return;
    }
    if (!checkIsRunning()) return;
    Browser.mainLoop.currentFrameNumber =
      (Browser.mainLoop.currentFrameNumber + 1) | 0;
    if (
      Browser.mainLoop.timingMode == 1 &&
      Browser.mainLoop.timingValue > 1 &&
      Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0
    ) {
      Browser.mainLoop.scheduler();
      return;
    } else if (Browser.mainLoop.timingMode == 0) {
      Browser.mainLoop.tickStartTime = _emscripten_get_now();
    }
    GL.newRenderingFrameStarted();
    Browser.mainLoop.runIter(browserIterationFunc);
    if (!checkIsRunning()) return;
    if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData)
      SDL.audio.queueNewAudioData();
    Browser.mainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
    else _emscripten_set_main_loop_timing(1, 1);
    Browser.mainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
}
function callUserCallback(func, synchronous) {
  if (ABORT) {
    return;
  }
  if (synchronous) {
    func();
    return;
  }
  try {
    func();
  } catch (e) {
    if (e instanceof ExitStatus) {
      return;
    } else if (e !== "unwind") {
      if (e && typeof e === "object" && e.stack)
        err("exception thrown: " + [e, e.stack]);
      throw e;
    }
  }
}
var Browser = {
  mainLoop: {
    running: false,
    scheduler: null,
    method: "",
    currentlyRunningMainloop: 0,
    func: null,
    arg: 0,
    timingMode: 0,
    timingValue: 0,
    currentFrameNumber: 0,
    queue: [],
    pause: function () {
      Browser.mainLoop.scheduler = null;
      Browser.mainLoop.currentlyRunningMainloop++;
    },
    resume: function () {
      Browser.mainLoop.currentlyRunningMainloop++;
      var timingMode = Browser.mainLoop.timingMode;
      var timingValue = Browser.mainLoop.timingValue;
      var func = Browser.mainLoop.func;
      Browser.mainLoop.func = null;
      setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
      _emscripten_set_main_loop_timing(timingMode, timingValue);
      Browser.mainLoop.scheduler();
    },
    updateStatus: function () {
      if (Module["setStatus"]) {
        var message = Module["statusMessage"] || "Please wait...";
        var remaining = Browser.mainLoop.remainingBlockers;
        var expected = Browser.mainLoop.expectedBlockers;
        if (remaining) {
          if (remaining < expected) {
            Module["setStatus"](
              message + " (" + (expected - remaining) + "/" + expected + ")"
            );
          } else {
            Module["setStatus"](message);
          }
        } else {
          Module["setStatus"]("");
        }
      }
    },
    runIter: function (func) {
      if (ABORT) return;
      if (Module["preMainLoop"]) {
        var preRet = Module["preMainLoop"]();
        if (preRet === false) {
          return;
        }
      }
      callUserCallback(func);
      if (Module["postMainLoop"]) Module["postMainLoop"]();
    },
  },
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  workers: [],
  init: function () {
    if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
    if (Browser.initted) return;
    Browser.initted = true;
    try {
      new Blob();
      Browser.hasBlobConstructor = true;
    } catch (e) {
      Browser.hasBlobConstructor = false;
      console.log(
        "warning: no blob constructor, cannot create blobs with mimetypes"
      );
    }
    Browser.BlobBuilder =
      typeof MozBlobBuilder != "undefined"
        ? MozBlobBuilder
        : typeof WebKitBlobBuilder != "undefined"
        ? WebKitBlobBuilder
        : !Browser.hasBlobConstructor
        ? console.log("warning: no BlobBuilder")
        : null;
    Browser.URLObject =
      typeof window != "undefined"
        ? window.URL
          ? window.URL
          : window.webkitURL
        : undefined;
    if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
      console.log(
        "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
      );
      Module.noImageDecoding = true;
    }
    var imagePlugin = {};
    imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
      return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
    };
    imagePlugin["handle"] = function imagePlugin_handle(
      byteArray,
      name,
      onload,
      onerror
    ) {
      var b = null;
      if (Browser.hasBlobConstructor) {
        try {
          b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) {
            b = new Blob([new Uint8Array(byteArray).buffer], {
              type: Browser.getMimetype(name),
            });
          }
        } catch (e) {
          warnOnce(
            "Blob constructor present but fails: " +
              e +
              "; falling back to blob builder"
          );
        }
      }
      if (!b) {
        var bb = new Browser.BlobBuilder();
        bb.append(new Uint8Array(byteArray).buffer);
        b = bb.getBlob();
      }
      var url = Browser.URLObject.createObjectURL(b);
      var img = new Image();
      img.onload = function img_onload() {
        assert(img.complete, "Image " + name + " could not be decoded");
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        Module["preloadedImages"][name] = canvas;
        Browser.URLObject.revokeObjectURL(url);
        if (onload) onload(byteArray);
      };
      img.onerror = function img_onerror(event) {
        console.log("Image " + url + " could not be decoded");
        if (onerror) onerror();
      };
      img.src = url;
    };
    Module["preloadPlugins"].push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
      return (
        !Module.noAudioDecoding &&
        name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 }
      );
    };
    audioPlugin["handle"] = function audioPlugin_handle(
      byteArray,
      name,
      onload,
      onerror
    ) {
      var done = false;
      function finish(audio) {
        if (done) return;
        done = true;
        Module["preloadedAudios"][name] = audio;
        if (onload) onload(byteArray);
      }
      function fail() {
        if (done) return;
        done = true;
        Module["preloadedAudios"][name] = new Audio();
        if (onerror) onerror();
      }
      if (Browser.hasBlobConstructor) {
        try {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
        } catch (e) {
          return fail();
        }
        var url = Browser.URLObject.createObjectURL(b);
        var audio = new Audio();
        audio.addEventListener(
          "canplaythrough",
          function () {
            finish(audio);
          },
          false
        );
        audio.onerror = function audio_onerror(event) {
          if (done) return;
          console.log(
            "warning: browser could not fully decode audio " +
              name +
              ", trying slower base64 approach"
          );
          function encode64(data) {
            var BASE =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var PAD = "=";
            var ret = "";
            var leftchar = 0;
            var leftbits = 0;
            for (var i = 0; i < data.length; i++) {
              leftchar = (leftchar << 8) | data[i];
              leftbits += 8;
              while (leftbits >= 6) {
                var curr = (leftchar >> (leftbits - 6)) & 63;
                leftbits -= 6;
                ret += BASE[curr];
              }
            }
            if (leftbits == 2) {
              ret += BASE[(leftchar & 3) << 4];
              ret += PAD + PAD;
            } else if (leftbits == 4) {
              ret += BASE[(leftchar & 15) << 2];
              ret += PAD;
            }
            return ret;
          }
          audio.src =
            "data:audio/x-" +
            name.substr(-3) +
            ";base64," +
            encode64(byteArray);
          finish(audio);
        };
        audio.src = url;
        Browser.safeSetTimeout(function () {
          finish(audio);
        }, 1e4);
      } else {
        return fail();
      }
    };
    Module["preloadPlugins"].push(audioPlugin);
    function pointerLockChange() {
      Browser.pointerLock =
        document["pointerLockElement"] === Module["canvas"] ||
        document["mozPointerLockElement"] === Module["canvas"] ||
        document["webkitPointerLockElement"] === Module["canvas"] ||
        document["msPointerLockElement"] === Module["canvas"];
    }
    var canvas = Module["canvas"];
    if (canvas) {
      canvas.requestPointerLock =
        canvas["requestPointerLock"] ||
        canvas["mozRequestPointerLock"] ||
        canvas["webkitRequestPointerLock"] ||
        canvas["msRequestPointerLock"] ||
        function () {};
      canvas.exitPointerLock =
        document["exitPointerLock"] ||
        document["mozExitPointerLock"] ||
        document["webkitExitPointerLock"] ||
        document["msExitPointerLock"] ||
        function () {};
      canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
      document.addEventListener("pointerlockchange", pointerLockChange, false);
      document.addEventListener(
        "mozpointerlockchange",
        pointerLockChange,
        false
      );
      document.addEventListener(
        "webkitpointerlockchange",
        pointerLockChange,
        false
      );
      document.addEventListener(
        "mspointerlockchange",
        pointerLockChange,
        false
      );
      if (Module["elementPointerLock"]) {
        canvas.addEventListener(
          "click",
          function (ev) {
            if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
              Module["canvas"].requestPointerLock();
              ev.preventDefault();
            }
          },
          false
        );
      }
    }
  },
  createContext: function (
    canvas,
    useWebGL,
    setInModule,
    webGLContextAttributes
  ) {
    if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
    var ctx;
    var contextHandle;
    if (useWebGL) {
      var contextAttributes = {
        antialias: false,
        alpha: false,
        majorVersion: typeof WebGL2RenderingContext !== "undefined" ? 2 : 1,
      };
      if (webGLContextAttributes) {
        for (var attribute in webGLContextAttributes) {
          contextAttributes[attribute] = webGLContextAttributes[attribute];
        }
      }
      if (typeof GL !== "undefined") {
        contextHandle = GL.createContext(canvas, contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(contextHandle).GLctx;
        }
      }
    } else {
      ctx = canvas.getContext("2d");
    }
    if (!ctx) return null;
    if (setInModule) {
      if (!useWebGL)
        assert(
          typeof GLctx === "undefined",
          "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
        );
      Module.ctx = ctx;
      if (useWebGL) GL.makeContextCurrent(contextHandle);
      Module.useWebGL = useWebGL;
      Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
        callback();
      });
      Browser.init();
    }
    return ctx;
  },
  destroyContext: function (canvas, useWebGL, setInModule) {},
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen: function (lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas === "undefined")
      Browser.resizeCanvas = false;
    var canvas = Module["canvas"];
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (
        (document["fullscreenElement"] ||
          document["mozFullScreenElement"] ||
          document["msFullscreenElement"] ||
          document["webkitFullscreenElement"] ||
          document["webkitCurrentFullScreenElement"]) === canvasContainer
      ) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      } else {
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      }
      if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
      if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen);
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange, false);
      document.addEventListener("mozfullscreenchange", fullscreenChange, false);
      document.addEventListener(
        "webkitfullscreenchange",
        fullscreenChange,
        false
      );
      document.addEventListener("MSFullscreenChange", fullscreenChange, false);
    }
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    canvasContainer.requestFullscreen =
      canvasContainer["requestFullscreen"] ||
      canvasContainer["mozRequestFullScreen"] ||
      canvasContainer["msRequestFullscreen"] ||
      (canvasContainer["webkitRequestFullscreen"]
        ? function () {
            canvasContainer["webkitRequestFullscreen"](
              Element["ALLOW_KEYBOARD_INPUT"]
            );
          }
        : null) ||
      (canvasContainer["webkitRequestFullScreen"]
        ? function () {
            canvasContainer["webkitRequestFullScreen"](
              Element["ALLOW_KEYBOARD_INPUT"]
            );
          }
        : null);
    canvasContainer.requestFullscreen();
  },
  exitFullscreen: function () {
    if (!Browser.isFullscreen) {
      return false;
    }
    var CFS =
      document["exitFullscreen"] ||
      document["cancelFullScreen"] ||
      document["mozCancelFullScreen"] ||
      document["msExitFullscreen"] ||
      document["webkitCancelFullScreen"] ||
      function () {};
    CFS.apply(document, []);
    return true;
  },
  nextRAF: 0,
  fakeRequestAnimationFrame: function (func) {
    var now = Date.now();
    if (Browser.nextRAF === 0) {
      Browser.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= Browser.nextRAF) {
        Browser.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(Browser.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame: function (func) {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(func);
      return;
    }
    var RAF = Browser.fakeRequestAnimationFrame;
    RAF(func);
  },
  safeRequestAnimationFrame: function (func) {
    return Browser.requestAnimationFrame(function () {
      callUserCallback(func);
    });
  },
  safeSetTimeout: function (func, timeout) {
    return setTimeout(function () {
      callUserCallback(func);
    }, timeout);
  },
  getMimetype: function (name) {
    return {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      bmp: "image/bmp",
      ogg: "audio/ogg",
      wav: "audio/wav",
      mp3: "audio/mpeg",
    }[name.substr(name.lastIndexOf(".") + 1)];
  },
  getUserMedia: function (func) {
    if (!window.getUserMedia) {
      window.getUserMedia =
        navigator["getUserMedia"] || navigator["mozGetUserMedia"];
    }
    window.getUserMedia(func);
  },
  getMovementX: function (event) {
    return (
      event["movementX"] ||
      event["mozMovementX"] ||
      event["webkitMovementX"] ||
      0
    );
  },
  getMovementY: function (event) {
    return (
      event["movementY"] ||
      event["mozMovementY"] ||
      event["webkitMovementY"] ||
      0
    );
  },
  getMouseWheelDelta: function (event) {
    var delta = 0;
    switch (event.type) {
      case "DOMMouseScroll":
        delta = event.detail / 3;
        break;
      case "mousewheel":
        delta = event.wheelDelta / 120;
        break;
      case "wheel":
        delta = event.deltaY;
        switch (event.deltaMode) {
          case 0:
            delta /= 100;
            break;
          case 1:
            delta /= 3;
            break;
          case 2:
            delta *= 80;
            break;
          default:
            throw "unrecognized mouse wheel delta mode: " + event.deltaMode;
        }
        break;
      default:
        throw "unrecognized mouse wheel event: " + event.type;
    }
    return delta;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseEvent: function (event) {
    if (Browser.pointerLock) {
      if (event.type != "mousemove" && "mozMovementX" in event) {
        Browser.mouseMovementX = Browser.mouseMovementY = 0;
      } else {
        Browser.mouseMovementX = Browser.getMovementX(event);
        Browser.mouseMovementY = Browser.getMovementY(event);
      }
      if (typeof SDL != "undefined") {
        Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
        Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
      } else {
        Browser.mouseX += Browser.mouseMovementX;
        Browser.mouseY += Browser.mouseMovementY;
      }
    } else {
      var rect = Module["canvas"].getBoundingClientRect();
      var cw = Module["canvas"].width;
      var ch = Module["canvas"].height;
      var scrollX =
        typeof window.scrollX !== "undefined"
          ? window.scrollX
          : window.pageXOffset;
      var scrollY =
        typeof window.scrollY !== "undefined"
          ? window.scrollY
          : window.pageYOffset;
      if (
        event.type === "touchstart" ||
        event.type === "touchend" ||
        event.type === "touchmove"
      ) {
        var touch = event.touch;
        if (touch === undefined) {
          return;
        }
        var adjustedX = touch.pageX - (scrollX + rect.left);
        var adjustedY = touch.pageY - (scrollY + rect.top);
        adjustedX = adjustedX * (cw / rect.width);
        adjustedY = adjustedY * (ch / rect.height);
        var coords = { x: adjustedX, y: adjustedY };
        if (event.type === "touchstart") {
          Browser.lastTouches[touch.identifier] = coords;
          Browser.touches[touch.identifier] = coords;
        } else if (event.type === "touchend" || event.type === "touchmove") {
          var last = Browser.touches[touch.identifier];
          if (!last) last = coords;
          Browser.lastTouches[touch.identifier] = last;
          Browser.touches[touch.identifier] = coords;
        }
        return;
      }
      var x = event.pageX - (scrollX + rect.left);
      var y = event.pageY - (scrollY + rect.top);
      x = x * (cw / rect.width);
      y = y * (ch / rect.height);
      Browser.mouseMovementX = x - Browser.mouseX;
      Browser.mouseMovementY = y - Browser.mouseY;
      Browser.mouseX = x;
      Browser.mouseY = y;
    }
  },
  asyncLoad: function (url, onload, onerror, noRunDep) {
    var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
    readAsync(
      url,
      function (arrayBuffer) {
        assert(
          arrayBuffer,
          'Loading data file "' + url + '" failed (no arrayBuffer).'
        );
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep);
      },
      function (event) {
        if (onerror) {
          onerror();
        } else {
          throw 'Loading data file "' + url + '" failed.';
        }
      }
    );
    if (dep) addRunDependency(dep);
  },
  resizeListeners: [],
  updateResizeListeners: function () {
    var canvas = Module["canvas"];
    Browser.resizeListeners.forEach(function (listener) {
      listener(canvas.width, canvas.height);
    });
  },
  setCanvasSize: function (width, height, noUpdates) {
    var canvas = Module["canvas"];
    Browser.updateCanvasDimensions(canvas, width, height);
    if (!noUpdates) Browser.updateResizeListeners();
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize: function () {
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[SDL.screen >> 2];
      flags = flags | 8388608;
      HEAP32[SDL.screen >> 2] = flags;
    }
    Browser.updateCanvasDimensions(Module["canvas"]);
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize: function () {
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[SDL.screen >> 2];
      flags = flags & ~8388608;
      HEAP32[SDL.screen >> 2] = flags;
    }
    Browser.updateCanvasDimensions(Module["canvas"]);
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions: function (canvas, wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
      if (w / h < Module["forcedAspectRatio"]) {
        w = Math.round(h * Module["forcedAspectRatio"]);
      } else {
        h = Math.round(w / Module["forcedAspectRatio"]);
      }
    }
    if (
      (document["fullscreenElement"] ||
        document["mozFullScreenElement"] ||
        document["msFullscreenElement"] ||
        document["webkitFullscreenElement"] ||
        document["webkitCurrentFullScreenElement"]) === canvas.parentNode &&
      typeof screen != "undefined"
    ) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas.width = w;
      if (canvas.height != h) canvas.height = h;
      if (typeof canvas.style != "undefined") {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    } else {
      if (canvas.width != wNative) canvas.width = wNative;
      if (canvas.height != hNative) canvas.height = hNative;
      if (typeof canvas.style != "undefined") {
        if (w != wNative || h != hNative) {
          canvas.style.setProperty("width", w + "px", "important");
          canvas.style.setProperty("height", h + "px", "important");
        } else {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      }
    }
  },
  wgetRequests: {},
  nextWgetRequestHandle: 0,
  getNextWgetRequestHandle: function () {
    var handle = Browser.nextWgetRequestHandle;
    Browser.nextWgetRequestHandle++;
    return handle;
  },
};
var EGL = {
  errorCode: 12288,
  defaultDisplayInitialized: false,
  currentContext: 0,
  currentReadSurface: 0,
  currentDrawSurface: 0,
  contextAttributes: {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
  },
  stringCache: {},
  setErrorCode: function (code) {
    EGL.errorCode = code;
  },
  chooseConfig: function (
    display,
    attribList,
    config,
    config_size,
    numConfigs
  ) {
    if (display != 62e3) {
      EGL.setErrorCode(12296);
      return 0;
    }
    if (attribList) {
      for (;;) {
        var param = HEAP32[attribList >> 2];
        if (param == 12321) {
          var alphaSize = HEAP32[(attribList + 4) >> 2];
          EGL.contextAttributes.alpha = alphaSize > 0;
        } else if (param == 12325) {
          var depthSize = HEAP32[(attribList + 4) >> 2];
          EGL.contextAttributes.depth = depthSize > 0;
        } else if (param == 12326) {
          var stencilSize = HEAP32[(attribList + 4) >> 2];
          EGL.contextAttributes.stencil = stencilSize > 0;
        } else if (param == 12337) {
          var samples = HEAP32[(attribList + 4) >> 2];
          EGL.contextAttributes.antialias = samples > 0;
        } else if (param == 12338) {
          var samples = HEAP32[(attribList + 4) >> 2];
          EGL.contextAttributes.antialias = samples == 1;
        } else if (param == 12544) {
          var requestedPriority = HEAP32[(attribList + 4) >> 2];
          EGL.contextAttributes.lowLatency = requestedPriority != 12547;
        } else if (param == 12344) {
          break;
        }
        attribList += 8;
      }
    }
    if ((!config || !config_size) && !numConfigs) {
      EGL.setErrorCode(12300);
      return 0;
    }
    if (numConfigs) {
      HEAP32[numConfigs >> 2] = 1;
    }
    if (config && config_size > 0) {
      HEAP32[config >> 2] = 62002;
    }
    EGL.setErrorCode(12288);
    return 1;
  },
};
function _eglBindAPI(api) {
  if (api == 12448) {
    EGL.setErrorCode(12288);
    return 1;
  } else {
    EGL.setErrorCode(12300);
    return 0;
  }
}
function _eglChooseConfig(
  display,
  attrib_list,
  configs,
  config_size,
  numConfigs
) {
  return EGL.chooseConfig(
    display,
    attrib_list,
    configs,
    config_size,
    numConfigs
  );
}
function __webgl_enable_ANGLE_instanced_arrays(ctx) {
  var ext = ctx.getExtension("ANGLE_instanced_arrays");
  if (ext) {
    ctx["vertexAttribDivisor"] = function (index, divisor) {
      ext["vertexAttribDivisorANGLE"](index, divisor);
    };
    ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
      ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
    };
    ctx["drawElementsInstanced"] = function (
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
    };
    return 1;
  }
}
function __webgl_enable_OES_vertex_array_object(ctx) {
  var ext = ctx.getExtension("OES_vertex_array_object");
  if (ext) {
    ctx["createVertexArray"] = function () {
      return ext["createVertexArrayOES"]();
    };
    ctx["deleteVertexArray"] = function (vao) {
      ext["deleteVertexArrayOES"](vao);
    };
    ctx["bindVertexArray"] = function (vao) {
      ext["bindVertexArrayOES"](vao);
    };
    ctx["isVertexArray"] = function (vao) {
      return ext["isVertexArrayOES"](vao);
    };
    return 1;
  }
}
function __webgl_enable_WEBGL_draw_buffers(ctx) {
  var ext = ctx.getExtension("WEBGL_draw_buffers");
  if (ext) {
    ctx["drawBuffers"] = function (n, bufs) {
      ext["drawBuffersWEBGL"](n, bufs);
    };
    return 1;
  }
}
function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) {
  return !!(ctx.dibvbi = ctx.getExtension(
    "WEBGL_draw_instanced_base_vertex_base_instance"
  ));
}
function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
  ctx
) {
  return !!(ctx.mdibvbi = ctx.getExtension(
    "WEBGL_multi_draw_instanced_base_vertex_base_instance"
  ));
}
function __webgl_enable_WEBGL_multi_draw(ctx) {
  return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
}
var GL = {
  counter: 1,
  buffers: [],
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: [],
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  recordError: function recordError(errorCode) {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: function (table) {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    return ret;
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: function (i) {
    return 32 - Math.clz32(i === 0 ? 0 : i - 1);
  },
  generateTempBuffers: function (quads, context) {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length =
      context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length =
      largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[
        i
      ] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0,
        v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: function getTempVertexBuffer(sizeBytes) {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] =
      (GL.currentContext.tempVertexBufferCounters1[idx] + 1) &
      (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: function getTempIndexBuffer(sizeBytes) {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: function newRenderingFrameStarted() {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 =
      GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: function (shader, count, string, length) {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? HEAP32[(length + i * 4) >> 2] : -1;
      source += UTF8ToString(
        HEAP32[(string + i * 4) >> 2],
        len < 0 ? undefined : len
      );
    }
    return source;
  },
  calcBufLength: function calcBufLength(size, type, stride, count) {
    if (stride > 0) {
      return count * stride;
    }
    var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    return size * typeSize * count;
  },
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings:
    function preDrawHandleClientVertexAttribBindings(count) {
      GL.resetBufferBinding = false;
      for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
        var cb = GL.currentContext.clientBuffers[i];
        if (!cb.clientside || !cb.enabled) continue;
        GL.resetBufferBinding = true;
        var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
        var buf = GL.getTempVertexBuffer(size);
        GLctx.bindBuffer(34962, buf);
        GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr, cb.ptr + size));
        cb.vertexAttribPointerAdaptor.call(
          GLctx,
          i,
          cb.size,
          cb.type,
          cb.normalized,
          cb.stride,
          0
        );
      }
    },
  postDrawHandleClientVertexAttribBindings:
    function postDrawHandleClientVertexAttribBindings() {
      if (GL.resetBufferBinding) {
        GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
      }
    },
  createContext: function (canvas, webGLContextAttributes) {
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
      canvas.getContext = function (ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return (ver == "webgl") == gl instanceof WebGLRenderingContext
          ? gl
          : null;
      };
    }
    var ctx =
      webGLContextAttributes.majorVersion > 1
        ? canvas.getContext("webgl2", webGLContextAttributes)
        : canvas.getContext("webgl", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: function (ctx, webGLContextAttributes) {
    var handle = GL.getNewId(GL.contexts);
    var context = {
      handle: handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx,
    };
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (
      typeof webGLContextAttributes.enableExtensionsByDefault === "undefined" ||
      webGLContextAttributes.enableExtensionsByDefault
    ) {
      GL.initExtensions(context);
    }
    context.maxVertexAttribs = context.GLctx.getParameter(34921);
    context.clientBuffers = [];
    for (var i = 0; i < context.maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null,
      };
    }
    GL.generateTempBuffers(false, context);
    return handle;
  },
  makeContextCurrent: function (contextHandle) {
    GL.currentContext = GL.contexts[contextHandle];
    Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: function (contextHandle) {
    return GL.contexts[contextHandle];
  },
  deleteContext: function (contextHandle) {
    if (GL.currentContext === GL.contexts[contextHandle])
      GL.currentContext = null;
    if (typeof JSEvents === "object")
      JSEvents.removeAllHandlersOnTarget(
        GL.contexts[contextHandle].GLctx.canvas
      );
    if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas)
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    GL.contexts[contextHandle] = null;
  },
  initExtensions: function (context) {
    if (!context) context = GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    __webgl_enable_ANGLE_instanced_arrays(GLctx);
    __webgl_enable_OES_vertex_array_object(GLctx);
    __webgl_enable_WEBGL_draw_buffers(GLctx);
    __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension(
        "EXT_disjoint_timer_query_webgl2"
      );
    }
    if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension(
        "EXT_disjoint_timer_query"
      );
    }
    __webgl_enable_WEBGL_multi_draw(GLctx);
    var exts = GLctx.getSupportedExtensions() || [];
    exts.forEach(function (ext) {
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
        GLctx.getExtension(ext);
      }
    });
  },
};
function _eglCreateContext(display, config, hmm, contextAttribs) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  var glesContextVersion = 1;
  for (;;) {
    var param = HEAP32[contextAttribs >> 2];
    if (param == 12440) {
      glesContextVersion = HEAP32[(contextAttribs + 4) >> 2];
    } else if (param == 12344) {
      break;
    } else {
      EGL.setErrorCode(12292);
      return 0;
    }
    contextAttribs += 8;
  }
  if (glesContextVersion < 2 || glesContextVersion > 3) {
    EGL.setErrorCode(12293);
    return 0;
  }
  EGL.contextAttributes.majorVersion = glesContextVersion - 1;
  EGL.contextAttributes.minorVersion = 0;
  EGL.context = GL.createContext(Module["canvas"], EGL.contextAttributes);
  if (EGL.context != 0) {
    EGL.setErrorCode(12288);
    GL.makeContextCurrent(EGL.context);
    Module.useWebGL = true;
    Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
      callback();
    });
    GL.makeContextCurrent(null);
    return 62004;
  } else {
    EGL.setErrorCode(12297);
    return 0;
  }
}
function _eglCreateWindowSurface(display, config, win, attrib_list) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (config != 62002) {
    EGL.setErrorCode(12293);
    return 0;
  }
  EGL.setErrorCode(12288);
  return 62006;
}
function _eglDestroyContext(display, context) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (context != 62004) {
    EGL.setErrorCode(12294);
    return 0;
  }
  GL.deleteContext(EGL.context);
  EGL.setErrorCode(12288);
  if (EGL.currentContext == context) {
    EGL.currentContext = 0;
  }
  return 1;
}
function _eglDestroySurface(display, surface) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (surface != 62006) {
    EGL.setErrorCode(12301);
    return 1;
  }
  if (EGL.currentReadSurface == surface) {
    EGL.currentReadSurface = 0;
  }
  if (EGL.currentDrawSurface == surface) {
    EGL.currentDrawSurface = 0;
  }
  EGL.setErrorCode(12288);
  return 1;
}
function _eglGetConfigAttrib(display, config, attribute, value) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (config != 62002) {
    EGL.setErrorCode(12293);
    return 0;
  }
  if (!value) {
    EGL.setErrorCode(12300);
    return 0;
  }
  EGL.setErrorCode(12288);
  switch (attribute) {
    case 12320:
      HEAP32[value >> 2] = EGL.contextAttributes.alpha ? 32 : 24;
      return 1;
    case 12321:
      HEAP32[value >> 2] = EGL.contextAttributes.alpha ? 8 : 0;
      return 1;
    case 12322:
      HEAP32[value >> 2] = 8;
      return 1;
    case 12323:
      HEAP32[value >> 2] = 8;
      return 1;
    case 12324:
      HEAP32[value >> 2] = 8;
      return 1;
    case 12325:
      HEAP32[value >> 2] = EGL.contextAttributes.depth ? 24 : 0;
      return 1;
    case 12326:
      HEAP32[value >> 2] = EGL.contextAttributes.stencil ? 8 : 0;
      return 1;
    case 12327:
      HEAP32[value >> 2] = 12344;
      return 1;
    case 12328:
      HEAP32[value >> 2] = 62002;
      return 1;
    case 12329:
      HEAP32[value >> 2] = 0;
      return 1;
    case 12330:
      HEAP32[value >> 2] = 4096;
      return 1;
    case 12331:
      HEAP32[value >> 2] = 16777216;
      return 1;
    case 12332:
      HEAP32[value >> 2] = 4096;
      return 1;
    case 12333:
      HEAP32[value >> 2] = 0;
      return 1;
    case 12334:
      HEAP32[value >> 2] = 0;
      return 1;
    case 12335:
      HEAP32[value >> 2] = 12344;
      return 1;
    case 12337:
      HEAP32[value >> 2] = EGL.contextAttributes.antialias ? 4 : 0;
      return 1;
    case 12338:
      HEAP32[value >> 2] = EGL.contextAttributes.antialias ? 1 : 0;
      return 1;
    case 12339:
      HEAP32[value >> 2] = 4;
      return 1;
    case 12340:
      HEAP32[value >> 2] = 12344;
      return 1;
    case 12341:
    case 12342:
    case 12343:
      HEAP32[value >> 2] = -1;
      return 1;
    case 12345:
    case 12346:
      HEAP32[value >> 2] = 0;
      return 1;
    case 12347:
      HEAP32[value >> 2] = 0;
      return 1;
    case 12348:
      HEAP32[value >> 2] = 1;
      return 1;
    case 12349:
    case 12350:
      HEAP32[value >> 2] = 0;
      return 1;
    case 12351:
      HEAP32[value >> 2] = 12430;
      return 1;
    case 12352:
      HEAP32[value >> 2] = 4;
      return 1;
    case 12354:
      HEAP32[value >> 2] = 0;
      return 1;
    default:
      EGL.setErrorCode(12292);
      return 0;
  }
}
function _eglGetDisplay(nativeDisplayType) {
  EGL.setErrorCode(12288);
  return 62e3;
}
function _eglGetError() {
  return EGL.errorCode;
}
function _eglInitialize(display, majorVersion, minorVersion) {
  if (display == 62e3) {
    if (majorVersion) {
      HEAP32[majorVersion >> 2] = 1;
    }
    if (minorVersion) {
      HEAP32[minorVersion >> 2] = 4;
    }
    EGL.defaultDisplayInitialized = true;
    EGL.setErrorCode(12288);
    return 1;
  } else {
    EGL.setErrorCode(12296);
    return 0;
  }
}
function _eglMakeCurrent(display, draw, read, context) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (context != 0 && context != 62004) {
    EGL.setErrorCode(12294);
    return 0;
  }
  if ((read != 0 && read != 62006) || (draw != 0 && draw != 62006)) {
    EGL.setErrorCode(12301);
    return 0;
  }
  GL.makeContextCurrent(context ? EGL.context : null);
  EGL.currentContext = context;
  EGL.currentDrawSurface = draw;
  EGL.currentReadSurface = read;
  EGL.setErrorCode(12288);
  return 1;
}
function _eglQueryString(display, name) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  EGL.setErrorCode(12288);
  if (EGL.stringCache[name]) return EGL.stringCache[name];
  var ret;
  switch (name) {
    case 12371:
      ret = allocateUTF8("Emscripten");
      break;
    case 12372:
      ret = allocateUTF8("1.4 Emscripten EGL");
      break;
    case 12373:
      ret = allocateUTF8("");
      break;
    case 12429:
      ret = allocateUTF8("OpenGL_ES");
      break;
    default:
      EGL.setErrorCode(12300);
      return 0;
  }
  EGL.stringCache[name] = ret;
  return ret;
}
function _eglSwapBuffers() {
  if (!EGL.defaultDisplayInitialized) {
    EGL.setErrorCode(12289);
  } else if (!Module.ctx) {
    EGL.setErrorCode(12290);
  } else if (Module.ctx.isContextLost()) {
    EGL.setErrorCode(12302);
  } else {
    EGL.setErrorCode(12288);
    return 1;
  }
  return 0;
}
function _eglSwapInterval(display, interval) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (interval == 0) _emscripten_set_main_loop_timing(0, 0);
  else _emscripten_set_main_loop_timing(1, interval);
  EGL.setErrorCode(12288);
  return 1;
}
function _eglTerminate(display) {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  EGL.currentContext = 0;
  EGL.currentReadSurface = 0;
  EGL.currentDrawSurface = 0;
  EGL.defaultDisplayInitialized = false;
  EGL.setErrorCode(12288);
  return 1;
}
function _eglWaitClient() {
  EGL.setErrorCode(12288);
  return 1;
}
function _eglWaitGL() {
  return _eglWaitClient();
}
function _eglWaitNative(nativeEngineId) {
  EGL.setErrorCode(12288);
  return 1;
}
var readAsmConstArgsArray = [];
function readAsmConstArgs(sigPtr, buf) {
  readAsmConstArgsArray.length = 0;
  var ch;
  buf >>= 2;
  while ((ch = HEAPU8[sigPtr++])) {
    var double = ch < 105;
    if (double && buf & 1) buf++;
    readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
    ++buf;
  }
  return readAsmConstArgsArray;
}
function _emscripten_asm_const_int(code, sigPtr, argbuf) {
  var args = readAsmConstArgs(sigPtr, argbuf);
  return ASM_CONSTS[code].apply(null, args);
}
function _emscripten_async_call(func, arg, millis) {
  function wrapper() {
    (function (a1) {
      dynCall_vi.apply(null, [func, a1]);
    })(arg);
  }
  if (millis >= 0) {
    Browser.safeSetTimeout(wrapper, millis);
  } else {
    Browser.safeRequestAnimationFrame(wrapper);
  }
}
function _emscripten_async_wget_data(url, arg, onload, onerror) {
  Browser.asyncLoad(
    UTF8ToString(url),
    function (byteArray) {
      var buffer = _malloc(byteArray.length);
      HEAPU8.set(byteArray, buffer);
      (function (a1, a2, a3) {
        dynCall_viii.apply(null, [onload, a1, a2, a3]);
      })(arg, buffer, byteArray.length);
      _free(buffer);
    },
    function () {
      if (onerror)
        (function (a1) {
          dynCall_vi.apply(null, [onerror, a1]);
        })(arg);
    },
    true
  );
}
function _emscripten_cancel_main_loop() {
  Browser.mainLoop.pause();
  Browser.mainLoop.func = null;
}
function _emscripten_debugger() {
  debugger;
}
var JSEvents = {
  inEventHandler: 0,
  removeAllEventListeners: function () {
    for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
      JSEvents._removeHandler(i);
    }
    JSEvents.eventHandlers = [];
    JSEvents.deferredCalls = [];
  },
  registerRemoveEventListeners: function () {
    if (!JSEvents.removeEventListenersRegistered) {
      __ATEXIT__.push(JSEvents.removeAllEventListeners);
      JSEvents.removeEventListenersRegistered = true;
    }
  },
  deferredCalls: [],
  deferCall: function (targetFunction, precedence, argsList) {
    function arraysHaveEqualContent(arrA, arrB) {
      if (arrA.length != arrB.length) return false;
      for (var i in arrA) {
        if (arrA[i] != arrB[i]) return false;
      }
      return true;
    }
    for (var i in JSEvents.deferredCalls) {
      var call = JSEvents.deferredCalls[i];
      if (
        call.targetFunction == targetFunction &&
        arraysHaveEqualContent(call.argsList, argsList)
      ) {
        return;
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction: targetFunction,
      precedence: precedence,
      argsList: argsList,
    });
    JSEvents.deferredCalls.sort(function (x, y) {
      return x.precedence < y.precedence;
    });
  },
  removeDeferredCalls: function (targetFunction) {
    for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
      if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
        JSEvents.deferredCalls.splice(i, 1);
        --i;
      }
    }
  },
  canPerformEventHandlerRequests: function () {
    return (
      JSEvents.inEventHandler &&
      JSEvents.currentEventHandler.allowsDeferredCalls
    );
  },
  runDeferredCalls: function () {
    if (!JSEvents.canPerformEventHandlerRequests()) {
      return;
    }
    for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
      var call = JSEvents.deferredCalls[i];
      JSEvents.deferredCalls.splice(i, 1);
      --i;
      call.targetFunction.apply(null, call.argsList);
    }
  },
  eventHandlers: [],
  removeAllHandlersOnTarget: function (target, eventTypeString) {
    for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
      if (
        JSEvents.eventHandlers[i].target == target &&
        (!eventTypeString ||
          eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
      ) {
        JSEvents._removeHandler(i--);
      }
    }
  },
  _removeHandler: function (i) {
    var h = JSEvents.eventHandlers[i];
    h.target.removeEventListener(
      h.eventTypeString,
      h.eventListenerFunc,
      h.useCapture
    );
    JSEvents.eventHandlers.splice(i, 1);
  },
  registerOrRemoveHandler: function (eventHandler) {
    var jsEventHandler = function jsEventHandler(event) {
      ++JSEvents.inEventHandler;
      JSEvents.currentEventHandler = eventHandler;
      JSEvents.runDeferredCalls();
      eventHandler.handlerFunc(event);
      JSEvents.runDeferredCalls();
      --JSEvents.inEventHandler;
    };
    if (eventHandler.callbackfunc) {
      eventHandler.eventListenerFunc = jsEventHandler;
      eventHandler.target.addEventListener(
        eventHandler.eventTypeString,
        jsEventHandler,
        eventHandler.useCapture
      );
      JSEvents.eventHandlers.push(eventHandler);
      JSEvents.registerRemoveEventListeners();
    } else {
      for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
        if (
          JSEvents.eventHandlers[i].target == eventHandler.target &&
          JSEvents.eventHandlers[i].eventTypeString ==
            eventHandler.eventTypeString
        ) {
          JSEvents._removeHandler(i--);
        }
      }
    }
  },
  getNodeNameForTarget: function (target) {
    if (!target) return "";
    if (target == window) return "#window";
    if (target == screen) return "#screen";
    return target && target.nodeName ? target.nodeName : "";
  },
  fullscreenEnabled: function () {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled;
  },
};
var currentFullscreenStrategy = {};
function maybeCStringToJsString(cString) {
  return cString > 2 ? UTF8ToString(cString) : cString;
}
var specialHTMLTargets = [0, document, window];
function findEventTarget(target) {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || document.querySelector(target);
  return domElement;
}
function findCanvasEventTarget(target) {
  return findEventTarget(target);
}
function _emscripten_get_canvas_element_size(target, width, height) {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  HEAP32[width >> 2] = canvas.width;
  HEAP32[height >> 2] = canvas.height;
}
function getCanvasElementSize(target) {
  var stackTop = stackSave();
  var w = stackAlloc(8);
  var h = w + 4;
  var targetInt = stackAlloc(target.id.length + 1);
  stringToUTF8(target.id, targetInt, target.id.length + 1);
  var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
  var size = [HEAP32[w >> 2], HEAP32[h >> 2]];
  stackRestore(stackTop);
  return size;
}
function _emscripten_set_canvas_element_size(target, width, height) {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  canvas.width = width;
  canvas.height = height;
  return 0;
}
function setCanvasElementSize(target, width, height) {
  if (!target.controlTransferredOffscreen) {
    target.width = width;
    target.height = height;
  } else {
    var stackTop = stackSave();
    var targetInt = stackAlloc(target.id.length + 1);
    stringToUTF8(target.id, targetInt, target.id.length + 1);
    _emscripten_set_canvas_element_size(targetInt, width, height);
    stackRestore(stackTop);
  }
}
function registerRestoreOldStyle(canvas) {
  var canvasSize = getCanvasElementSize(canvas);
  var oldWidth = canvasSize[0];
  var oldHeight = canvasSize[1];
  var oldCssWidth = canvas.style.width;
  var oldCssHeight = canvas.style.height;
  var oldBackgroundColor = canvas.style.backgroundColor;
  var oldDocumentBackgroundColor = document.body.style.backgroundColor;
  var oldPaddingLeft = canvas.style.paddingLeft;
  var oldPaddingRight = canvas.style.paddingRight;
  var oldPaddingTop = canvas.style.paddingTop;
  var oldPaddingBottom = canvas.style.paddingBottom;
  var oldMarginLeft = canvas.style.marginLeft;
  var oldMarginRight = canvas.style.marginRight;
  var oldMarginTop = canvas.style.marginTop;
  var oldMarginBottom = canvas.style.marginBottom;
  var oldDocumentBodyMargin = document.body.style.margin;
  var oldDocumentOverflow = document.documentElement.style.overflow;
  var oldDocumentScroll = document.body.scroll;
  var oldImageRendering = canvas.style.imageRendering;
  function restoreOldStyle() {
    var fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    if (!fullscreenElement) {
      document.removeEventListener("fullscreenchange", restoreOldStyle);
      document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
      setCanvasElementSize(canvas, oldWidth, oldHeight);
      canvas.style.width = oldCssWidth;
      canvas.style.height = oldCssHeight;
      canvas.style.backgroundColor = oldBackgroundColor;
      if (!oldDocumentBackgroundColor)
        document.body.style.backgroundColor = "white";
      document.body.style.backgroundColor = oldDocumentBackgroundColor;
      canvas.style.paddingLeft = oldPaddingLeft;
      canvas.style.paddingRight = oldPaddingRight;
      canvas.style.paddingTop = oldPaddingTop;
      canvas.style.paddingBottom = oldPaddingBottom;
      canvas.style.marginLeft = oldMarginLeft;
      canvas.style.marginRight = oldMarginRight;
      canvas.style.marginTop = oldMarginTop;
      canvas.style.marginBottom = oldMarginBottom;
      document.body.style.margin = oldDocumentBodyMargin;
      document.documentElement.style.overflow = oldDocumentOverflow;
      document.body.scroll = oldDocumentScroll;
      canvas.style.imageRendering = oldImageRendering;
      if (canvas.GLctxObject)
        canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
      if (currentFullscreenStrategy.canvasResizedCallback) {
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [
            currentFullscreenStrategy.canvasResizedCallback,
            a1,
            a2,
            a3,
          ]);
        })(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
      }
    }
  }
  document.addEventListener("fullscreenchange", restoreOldStyle);
  document.addEventListener("webkitfullscreenchange", restoreOldStyle);
  return restoreOldStyle;
}
function setLetterbox(element, topBottom, leftRight) {
  element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
  element.style.paddingTop = element.style.paddingBottom = topBottom + "px";
}
function getBoundingClientRect(e) {
  return specialHTMLTargets.indexOf(e) < 0
    ? e.getBoundingClientRect()
    : { left: 0, top: 0 };
}
function _JSEvents_resizeCanvasForFullscreen(target, strategy) {
  var restoreOldStyle = registerRestoreOldStyle(target);
  var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
  var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
  var rect = getBoundingClientRect(target);
  var windowedCssWidth = rect.width;
  var windowedCssHeight = rect.height;
  var canvasSize = getCanvasElementSize(target);
  var windowedRttWidth = canvasSize[0];
  var windowedRttHeight = canvasSize[1];
  if (strategy.scaleMode == 3) {
    setLetterbox(
      target,
      (cssHeight - windowedCssHeight) / 2,
      (cssWidth - windowedCssWidth) / 2
    );
    cssWidth = windowedCssWidth;
    cssHeight = windowedCssHeight;
  } else if (strategy.scaleMode == 2) {
    if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
      var desiredCssHeight = (windowedRttHeight * cssWidth) / windowedRttWidth;
      setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
      cssHeight = desiredCssHeight;
    } else {
      var desiredCssWidth = (windowedRttWidth * cssHeight) / windowedRttHeight;
      setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
      cssWidth = desiredCssWidth;
    }
  }
  if (!target.style.backgroundColor) target.style.backgroundColor = "black";
  if (!document.body.style.backgroundColor)
    document.body.style.backgroundColor = "black";
  target.style.width = cssWidth + "px";
  target.style.height = cssHeight + "px";
  if (strategy.filteringMode == 1) {
    target.style.imageRendering = "optimizeSpeed";
    target.style.imageRendering = "-moz-crisp-edges";
    target.style.imageRendering = "-o-crisp-edges";
    target.style.imageRendering = "-webkit-optimize-contrast";
    target.style.imageRendering = "optimize-contrast";
    target.style.imageRendering = "crisp-edges";
    target.style.imageRendering = "pixelated";
  }
  var dpiScale = strategy.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
  if (strategy.canvasResolutionScaleMode != 0) {
    var newWidth = (cssWidth * dpiScale) | 0;
    var newHeight = (cssHeight * dpiScale) | 0;
    setCanvasElementSize(target, newWidth, newHeight);
    if (target.GLctxObject)
      target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
  }
  return restoreOldStyle;
}
function _JSEvents_requestFullscreen(target, strategy) {
  if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
    _JSEvents_resizeCanvasForFullscreen(target, strategy);
  }
  if (target.requestFullscreen) {
    target.requestFullscreen();
  } else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    return JSEvents.fullscreenEnabled() ? -3 : -1;
  }
  currentFullscreenStrategy = strategy;
  if (strategy.canvasResizedCallback) {
    (function (a1, a2, a3) {
      return dynCall_iiii.apply(null, [
        strategy.canvasResizedCallback,
        a1,
        a2,
        a3,
      ]);
    })(37, 0, strategy.canvasResizedCallbackUserData);
  }
  return 0;
}
function _emscripten_exit_fullscreen() {
  if (!JSEvents.fullscreenEnabled()) return -1;
  JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);
  var d = specialHTMLTargets[1];
  if (d.exitFullscreen) {
    d.fullscreenElement && d.exitFullscreen();
  } else if (d.webkitExitFullscreen) {
    d.webkitFullscreenElement && d.webkitExitFullscreen();
  } else {
    return -1;
  }
  return 0;
}
function requestPointerLock(target) {
  if (target.requestPointerLock) {
    target.requestPointerLock();
  } else if (target.msRequestPointerLock) {
    target.msRequestPointerLock();
  } else {
    if (
      document.body.requestPointerLock ||
      document.body.msRequestPointerLock
    ) {
      return -3;
    } else {
      return -1;
    }
  }
  return 0;
}
function _emscripten_exit_pointerlock() {
  JSEvents.removeDeferredCalls(requestPointerLock);
  if (document.exitPointerLock) {
    document.exitPointerLock();
  } else if (document.msExitPointerLock) {
    document.msExitPointerLock();
  } else {
    return -1;
  }
  return 0;
}
function _emscripten_exit_with_live_runtime() {
  throw "unwind";
}
function fillBatteryEventData(eventStruct, e) {
  HEAPF64[eventStruct >> 3] = e.chargingTime;
  HEAPF64[(eventStruct + 8) >> 3] = e.dischargingTime;
  HEAPF64[(eventStruct + 16) >> 3] = e.level;
  HEAP32[(eventStruct + 24) >> 2] = e.charging;
}
function battery() {
  return navigator.battery || navigator.mozBattery || navigator.webkitBattery;
}
function _emscripten_get_battery_status(batteryState) {
  if (!battery()) return -1;
  fillBatteryEventData(batteryState, battery());
  return 0;
}
function traverseStack(args) {
  if (!args || !args.callee || !args.callee.name) {
    return [null, "", ""];
  }
  var funstr = args.callee.toString();
  var funcname = args.callee.name;
  var str = "(";
  var first = true;
  for (var i in args) {
    var a = args[i];
    if (!first) {
      str += ", ";
    }
    first = false;
    if (typeof a === "number" || typeof a === "string") {
      str += a;
    } else {
      str += "(" + typeof a + ")";
    }
  }
  str += ")";
  var caller = args.callee.caller;
  args = caller ? caller.arguments : [];
  if (first) str = "";
  return [args, funcname, str];
}
function _emscripten_get_callstack_js(flags) {
  var callstack = jsStackTrace();
  var iThisFunc = callstack.lastIndexOf("_emscripten_log");
  var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
  var iNextLine = callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
  callstack = callstack.slice(iNextLine);
  if (flags & 32) {
    warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring");
  }
  if (flags & 8 && typeof emscripten_source_map === "undefined") {
    warnOnce(
      'Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.'
    );
    flags ^= 8;
    flags |= 16;
  }
  var stack_args = null;
  if (flags & 128) {
    stack_args = traverseStack(arguments);
    while (stack_args[1].includes("_emscripten_"))
      stack_args = traverseStack(stack_args[0]);
  }
  var lines = callstack.split("\n");
  callstack = "";
  var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
  var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
  var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
  for (var l in lines) {
    var line = lines[l];
    var symbolName = "";
    var file = "";
    var lineno = 0;
    var column = 0;
    var parts = chromeRe.exec(line);
    if (parts && parts.length == 5) {
      symbolName = parts[1];
      file = parts[2];
      lineno = parts[3];
      column = parts[4];
    } else {
      parts = newFirefoxRe.exec(line);
      if (!parts) parts = firefoxRe.exec(line);
      if (parts && parts.length >= 4) {
        symbolName = parts[1];
        file = parts[2];
        lineno = parts[3];
        column = parts[4] | 0;
      } else {
        callstack += line + "\n";
        continue;
      }
    }
    var haveSourceMap = false;
    if (flags & 8) {
      var orig = emscripten_source_map.originalPositionFor({
        line: lineno,
        column: column,
      });
      haveSourceMap = orig && orig.source;
      if (haveSourceMap) {
        if (flags & 64) {
          orig.source = orig.source.substring(
            orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1
          );
        }
        callstack +=
          "    at " +
          symbolName +
          " (" +
          orig.source +
          ":" +
          orig.line +
          ":" +
          orig.column +
          ")\n";
      }
    }
    if (flags & 16 || !haveSourceMap) {
      if (flags & 64) {
        file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
      }
      callstack +=
        (haveSourceMap ? "     = " + symbolName : "    at " + symbolName) +
        " (" +
        file +
        ":" +
        lineno +
        ":" +
        column +
        ")\n";
    }
    if (flags & 128 && stack_args[0]) {
      if (stack_args[1] == symbolName && stack_args[2].length > 0) {
        callstack = callstack.replace(/\s+$/, "");
        callstack += " with values: " + stack_args[1] + stack_args[2] + "\n";
      }
      stack_args = traverseStack(stack_args[0]);
    }
  }
  callstack = callstack.replace(/\s+$/, "");
  return callstack;
}
function _emscripten_get_callstack(flags, str, maxbytes) {
  var callstack = _emscripten_get_callstack_js(flags);
  if (!str || maxbytes <= 0) {
    return lengthBytesUTF8(callstack) + 1;
  }
  var bytesWrittenExcludingNull = stringToUTF8(callstack, str, maxbytes);
  return bytesWrittenExcludingNull + 1;
}
function _emscripten_get_compiler_setting(name) {
  name = UTF8ToString(name);
  var ret = getCompilerSetting(name);
  if (typeof ret === "number") return ret;
  if (!_emscripten_get_compiler_setting.cache)
    _emscripten_get_compiler_setting.cache = {};
  var cache = _emscripten_get_compiler_setting.cache;
  var fullname = name + "__str";
  var fullret = cache[fullname];
  if (fullret) return fullret;
  return (cache[fullname] = allocate(
    intArrayFromString(ret + ""),
    ALLOC_NORMAL
  ));
}
function _emscripten_get_device_pixel_ratio() {
  return devicePixelRatio;
}
function _emscripten_get_element_css_size(target, width, height) {
  target = findEventTarget(target);
  if (!target) return -4;
  var rect = getBoundingClientRect(target);
  HEAPF64[width >> 3] = rect.width;
  HEAPF64[height >> 3] = rect.height;
  return 0;
}
function fillGamepadEventData(eventStruct, e) {
  HEAPF64[eventStruct >> 3] = e.timestamp;
  for (var i = 0; i < e.axes.length; ++i) {
    HEAPF64[(eventStruct + i * 8 + 16) >> 3] = e.axes[i];
  }
  for (var i = 0; i < e.buttons.length; ++i) {
    if (typeof e.buttons[i] === "object") {
      HEAPF64[(eventStruct + i * 8 + 528) >> 3] = e.buttons[i].value;
    } else {
      HEAPF64[(eventStruct + i * 8 + 528) >> 3] = e.buttons[i];
    }
  }
  for (var i = 0; i < e.buttons.length; ++i) {
    if (typeof e.buttons[i] === "object") {
      HEAP32[(eventStruct + i * 4 + 1040) >> 2] = e.buttons[i].pressed;
    } else {
      HEAP32[(eventStruct + i * 4 + 1040) >> 2] = e.buttons[i] == 1;
    }
  }
  HEAP32[(eventStruct + 1296) >> 2] = e.connected;
  HEAP32[(eventStruct + 1300) >> 2] = e.index;
  HEAP32[(eventStruct + 8) >> 2] = e.axes.length;
  HEAP32[(eventStruct + 12) >> 2] = e.buttons.length;
  stringToUTF8(e.id, eventStruct + 1304, 64);
  stringToUTF8(e.mapping, eventStruct + 1368, 64);
}
function _emscripten_get_gamepad_status(index, gamepadState) {
  if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  if (!JSEvents.lastGamepadState[index]) return -7;
  fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
  return 0;
}
function _emscripten_get_heap_max() {
  return 2147483648;
}
function _emscripten_get_num_gamepads() {
  return JSEvents.lastGamepadState.length;
}
function _emscripten_get_preloaded_image_data(path, w, h) {
  if ((path | 0) === path) path = UTF8ToString(path);
  path = PATH_FS.resolve(path);
  var canvas = Module["preloadedImages"][path];
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var buf = _malloc(canvas.width * canvas.height * 4);
    HEAPU8.set(image.data, buf);
    HEAP32[w >> 2] = canvas.width;
    HEAP32[h >> 2] = canvas.height;
    return buf;
  }
  return 0;
}
function _emscripten_get_preloaded_image_data_from_FILE(file, w, h) {
  var fd = Module["_fileno"](file);
  var stream = FS.getStream(fd);
  if (stream) {
    return _emscripten_get_preloaded_image_data(stream.path, w, h);
  }
  return 0;
}
function _emscripten_glActiveTexture(x0) {
  GLctx["activeTexture"](x0);
}
function _emscripten_glAttachShader(program, shader) {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
}
function _emscripten_glBeginQuery(target, id) {
  GLctx["beginQuery"](target, GL.queries[id]);
}
function _emscripten_glBeginQueryEXT(target, id) {
  GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
}
function _emscripten_glBeginTransformFeedback(x0) {
  GLctx["beginTransformFeedback"](x0);
}
function _emscripten_glBindAttribLocation(program, index, name) {
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}
function _emscripten_glBindBuffer(target, buffer) {
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
  } else if (target == 34963) {
    GLctx.currentElementArrayBufferBinding = buffer;
  }
  if (target == 35051) {
    GLctx.currentPixelPackBufferBinding = buffer;
  } else if (target == 35052) {
    GLctx.currentPixelUnpackBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
}
function _emscripten_glBindBufferBase(target, index, buffer) {
  GLctx["bindBufferBase"](target, index, GL.buffers[buffer]);
}
function _emscripten_glBindBufferRange(target, index, buffer, offset, ptrsize) {
  GLctx["bindBufferRange"](target, index, GL.buffers[buffer], offset, ptrsize);
}
function _emscripten_glBindFramebuffer(target, framebuffer) {
  GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
}
function _emscripten_glBindRenderbuffer(target, renderbuffer) {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
}
function _emscripten_glBindSampler(unit, sampler) {
  GLctx["bindSampler"](unit, GL.samplers[sampler]);
}
function _emscripten_glBindTexture(target, texture) {
  GLctx.bindTexture(target, GL.textures[texture]);
}
function _emscripten_glBindTransformFeedback(target, id) {
  GLctx["bindTransformFeedback"](target, GL.transformFeedbacks[id]);
}
function _emscripten_glBindVertexArray(vao) {
  GLctx["bindVertexArray"](GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0;
}
function _emscripten_glBindVertexArrayOES(vao) {
  GLctx["bindVertexArray"](GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0;
}
function _emscripten_glBlendColor(x0, x1, x2, x3) {
  GLctx["blendColor"](x0, x1, x2, x3);
}
function _emscripten_glBlendEquation(x0) {
  GLctx["blendEquation"](x0);
}
function _emscripten_glBlendEquationSeparate(x0, x1) {
  GLctx["blendEquationSeparate"](x0, x1);
}
function _emscripten_glBlendFunc(x0, x1) {
  GLctx["blendFunc"](x0, x1);
}
function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) {
  GLctx["blendFuncSeparate"](x0, x1, x2, x3);
}
function _emscripten_glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
  GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
}
function _emscripten_glBufferData(target, size, data, usage) {
  if (GL.currentContext.version >= 2) {
    if (data) {
      GLctx.bufferData(target, HEAPU8, usage, data, size);
    } else {
      GLctx.bufferData(target, size, usage);
    }
  } else {
    GLctx.bufferData(
      target,
      data ? HEAPU8.subarray(data, data + size) : size,
      usage
    );
  }
}
function _emscripten_glBufferSubData(target, offset, size, data) {
  if (GL.currentContext.version >= 2) {
    GLctx.bufferSubData(target, offset, HEAPU8, data, size);
    return;
  }
  GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
}
function _emscripten_glCheckFramebufferStatus(x0) {
  return GLctx["checkFramebufferStatus"](x0);
}
function _emscripten_glClear(x0) {
  GLctx["clear"](x0);
}
function _emscripten_glClearBufferfi(x0, x1, x2, x3) {
  GLctx["clearBufferfi"](x0, x1, x2, x3);
}
function _emscripten_glClearBufferfv(buffer, drawbuffer, value) {
  GLctx["clearBufferfv"](buffer, drawbuffer, HEAPF32, value >> 2);
}
function _emscripten_glClearBufferiv(buffer, drawbuffer, value) {
  GLctx["clearBufferiv"](buffer, drawbuffer, HEAP32, value >> 2);
}
function _emscripten_glClearBufferuiv(buffer, drawbuffer, value) {
  GLctx["clearBufferuiv"](buffer, drawbuffer, HEAPU32, value >> 2);
}
function _emscripten_glClearColor(x0, x1, x2, x3) {
  GLctx["clearColor"](x0, x1, x2, x3);
}
function _emscripten_glClearDepthf(x0) {
  GLctx["clearDepth"](x0);
}
function _emscripten_glClearStencil(x0) {
  GLctx["clearStencil"](x0);
}
function convertI32PairToI53(lo, hi) {
  return (lo >>> 0) + hi * 4294967296;
}
function _emscripten_glClientWaitSync(sync, flags, timeoutLo, timeoutHi) {
  return GLctx.clientWaitSync(
    GL.syncs[sync],
    flags,
    convertI32PairToI53(timeoutLo, timeoutHi)
  );
}
function _emscripten_glColorMask(red, green, blue, alpha) {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
}
function _emscripten_glCompileShader(shader) {
  GLctx.compileShader(GL.shaders[shader]);
}
function _emscripten_glCompressedTexImage2D(
  target,
  level,
  internalFormat,
  width,
  height,
  border,
  imageSize,
  data
) {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx["compressedTexImage2D"](
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        imageSize,
        data
      );
    } else {
      GLctx["compressedTexImage2D"](
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        HEAPU8,
        data,
        imageSize
      );
    }
    return;
  }
  GLctx["compressedTexImage2D"](
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    data ? HEAPU8.subarray(data, data + imageSize) : null
  );
}
function _emscripten_glCompressedTexImage3D(
  target,
  level,
  internalFormat,
  width,
  height,
  depth,
  border,
  imageSize,
  data
) {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx["compressedTexImage3D"](
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      imageSize,
      data
    );
  } else {
    GLctx["compressedTexImage3D"](
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      HEAPU8,
      data,
      imageSize
    );
  }
}
function _emscripten_glCompressedTexSubImage2D(
  target,
  level,
  xoffset,
  yoffset,
  width,
  height,
  format,
  imageSize,
  data
) {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx["compressedTexSubImage2D"](
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        imageSize,
        data
      );
    } else {
      GLctx["compressedTexSubImage2D"](
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        HEAPU8,
        data,
        imageSize
      );
    }
    return;
  }
  GLctx["compressedTexSubImage2D"](
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    data ? HEAPU8.subarray(data, data + imageSize) : null
  );
}
function _emscripten_glCompressedTexSubImage3D(
  target,
  level,
  xoffset,
  yoffset,
  zoffset,
  width,
  height,
  depth,
  format,
  imageSize,
  data
) {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx["compressedTexSubImage3D"](
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      imageSize,
      data
    );
  } else {
    GLctx["compressedTexSubImage3D"](
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      HEAPU8,
      data,
      imageSize
    );
  }
}
function _emscripten_glCopyBufferSubData(x0, x1, x2, x3, x4) {
  GLctx["copyBufferSubData"](x0, x1, x2, x3, x4);
}
function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
  GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
}
function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
  GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
}
function _emscripten_glCopyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8) {
  GLctx["copyTexSubImage3D"](x0, x1, x2, x3, x4, x5, x6, x7, x8);
}
function _emscripten_glCreateProgram() {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  program.name = id;
  program.maxUniformLength =
    program.maxAttributeLength =
    program.maxUniformBlockNameLength =
      0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id;
}
function _emscripten_glCreateShader(shaderType) {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
}
function _emscripten_glCullFace(x0) {
  GLctx["cullFace"](x0);
}
function _emscripten_glDeleteBuffers(n, buffers) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(buffers + i * 4) >> 2];
    var buffer = GL.buffers[id];
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentArrayBufferBinding)
      GLctx.currentArrayBufferBinding = 0;
    if (id == GLctx.currentElementArrayBufferBinding)
      GLctx.currentElementArrayBufferBinding = 0;
    if (id == GLctx.currentPixelPackBufferBinding)
      GLctx.currentPixelPackBufferBinding = 0;
    if (id == GLctx.currentPixelUnpackBufferBinding)
      GLctx.currentPixelUnpackBufferBinding = 0;
  }
}
function _emscripten_glDeleteFramebuffers(n, framebuffers) {
  for (var i = 0; i < n; ++i) {
    var id = HEAP32[(framebuffers + i * 4) >> 2];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
}
function _emscripten_glDeleteProgram(id) {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
}
function _emscripten_glDeleteQueries(n, ids) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(ids + i * 4) >> 2];
    var query = GL.queries[id];
    if (!query) continue;
    GLctx["deleteQuery"](query);
    GL.queries[id] = null;
  }
}
function _emscripten_glDeleteQueriesEXT(n, ids) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(ids + i * 4) >> 2];
    var query = GL.queries[id];
    if (!query) continue;
    GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
    GL.queries[id] = null;
  }
}
function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(renderbuffers + i * 4) >> 2];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
}
function _emscripten_glDeleteSamplers(n, samplers) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(samplers + i * 4) >> 2];
    var sampler = GL.samplers[id];
    if (!sampler) continue;
    GLctx["deleteSampler"](sampler);
    sampler.name = 0;
    GL.samplers[id] = null;
  }
}
function _emscripten_glDeleteShader(id) {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
}
function _emscripten_glDeleteSync(id) {
  if (!id) return;
  var sync = GL.syncs[id];
  if (!sync) {
    GL.recordError(1281);
    return;
  }
  GLctx.deleteSync(sync);
  sync.name = 0;
  GL.syncs[id] = null;
}
function _emscripten_glDeleteTextures(n, textures) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(textures + i * 4) >> 2];
    var texture = GL.textures[id];
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
}
function _emscripten_glDeleteTransformFeedbacks(n, ids) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(ids + i * 4) >> 2];
    var transformFeedback = GL.transformFeedbacks[id];
    if (!transformFeedback) continue;
    GLctx["deleteTransformFeedback"](transformFeedback);
    transformFeedback.name = 0;
    GL.transformFeedbacks[id] = null;
  }
}
function _emscripten_glDeleteVertexArrays(n, vaos) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(vaos + i * 4) >> 2];
    GLctx["deleteVertexArray"](GL.vaos[id]);
    GL.vaos[id] = null;
  }
}
function _emscripten_glDeleteVertexArraysOES(n, vaos) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(vaos + i * 4) >> 2];
    GLctx["deleteVertexArray"](GL.vaos[id]);
    GL.vaos[id] = null;
  }
}
function _emscripten_glDepthFunc(x0) {
  GLctx["depthFunc"](x0);
}
function _emscripten_glDepthMask(flag) {
  GLctx.depthMask(!!flag);
}
function _emscripten_glDepthRangef(x0, x1) {
  GLctx["depthRange"](x0, x1);
}
function _emscripten_glDetachShader(program, shader) {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
}
function _emscripten_glDisable(x0) {
  GLctx["disable"](x0);
}
function _emscripten_glDisableVertexAttribArray(index) {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = false;
  GLctx.disableVertexAttribArray(index);
}
function _emscripten_glDrawArrays(mode, first, count) {
  GL.preDrawHandleClientVertexAttribBindings(first + count);
  GLctx.drawArrays(mode, first, count);
  GL.postDrawHandleClientVertexAttribBindings();
}
function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
  GLctx["drawArraysInstanced"](mode, first, count, primcount);
}
function _emscripten_glDrawArraysInstancedANGLE(mode, first, count, primcount) {
  GLctx["drawArraysInstanced"](mode, first, count, primcount);
}
function _emscripten_glDrawArraysInstancedARB(mode, first, count, primcount) {
  GLctx["drawArraysInstanced"](mode, first, count, primcount);
}
function _emscripten_glDrawArraysInstancedEXT(mode, first, count, primcount) {
  GLctx["drawArraysInstanced"](mode, first, count, primcount);
}
function _emscripten_glDrawArraysInstancedNV(mode, first, count, primcount) {
  GLctx["drawArraysInstanced"](mode, first, count, primcount);
}
var tempFixedLengthArray = [];
function _emscripten_glDrawBuffers(n, bufs) {
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = HEAP32[(bufs + i * 4) >> 2];
  }
  GLctx["drawBuffers"](bufArray);
}
function _emscripten_glDrawBuffersEXT(n, bufs) {
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = HEAP32[(bufs + i * 4) >> 2];
  }
  GLctx["drawBuffers"](bufArray);
}
function _emscripten_glDrawBuffersWEBGL(n, bufs) {
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = HEAP32[(bufs + i * 4) >> 2];
  }
  GLctx["drawBuffers"](bufArray);
}
function _emscripten_glDrawElements(mode, count, type, indices) {
  var buf;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
    indices = 0;
  }
  GL.preDrawHandleClientVertexAttribBindings(count);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}
function _emscripten_glDrawElementsInstanced(
  mode,
  count,
  type,
  indices,
  primcount
) {
  GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
}
function _emscripten_glDrawElementsInstancedANGLE(
  mode,
  count,
  type,
  indices,
  primcount
) {
  GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
}
function _emscripten_glDrawElementsInstancedARB(
  mode,
  count,
  type,
  indices,
  primcount
) {
  GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
}
function _emscripten_glDrawElementsInstancedEXT(
  mode,
  count,
  type,
  indices,
  primcount
) {
  GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
}
function _emscripten_glDrawElementsInstancedNV(
  mode,
  count,
  type,
  indices,
  primcount
) {
  GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
}
function _glDrawElements(mode, count, type, indices) {
  var buf;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
    indices = 0;
  }
  GL.preDrawHandleClientVertexAttribBindings(count);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}
function _emscripten_glDrawRangeElements(
  mode,
  start,
  end,
  count,
  type,
  indices
) {
  _glDrawElements(mode, count, type, indices);
}
function _emscripten_glEnable(x0) {
  GLctx["enable"](x0);
}
function _emscripten_glEnableVertexAttribArray(index) {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = true;
  GLctx.enableVertexAttribArray(index);
}
function _emscripten_glEndQuery(x0) {
  GLctx["endQuery"](x0);
}
function _emscripten_glEndQueryEXT(target) {
  GLctx.disjointTimerQueryExt["endQueryEXT"](target);
}
function _emscripten_glEndTransformFeedback() {
  GLctx["endTransformFeedback"]();
}
function _emscripten_glFenceSync(condition, flags) {
  var sync = GLctx.fenceSync(condition, flags);
  if (sync) {
    var id = GL.getNewId(GL.syncs);
    sync.name = id;
    GL.syncs[id] = sync;
    return id;
  } else {
    return 0;
  }
}
function _emscripten_glFinish() {
  GLctx["finish"]();
}
function _emscripten_glFlush() {
  GLctx["flush"]();
}
function _emscripten_glFramebufferRenderbuffer(
  target,
  attachment,
  renderbuffertarget,
  renderbuffer
) {
  GLctx.framebufferRenderbuffer(
    target,
    attachment,
    renderbuffertarget,
    GL.renderbuffers[renderbuffer]
  );
}
function _emscripten_glFramebufferTexture2D(
  target,
  attachment,
  textarget,
  texture,
  level
) {
  GLctx.framebufferTexture2D(
    target,
    attachment,
    textarget,
    GL.textures[texture],
    level
  );
}
function _emscripten_glFramebufferTextureLayer(
  target,
  attachment,
  texture,
  level,
  layer
) {
  GLctx.framebufferTextureLayer(
    target,
    attachment,
    GL.textures[texture],
    level,
    layer
  );
}
function _emscripten_glFrontFace(x0) {
  GLctx["frontFace"](x0);
}
function __glGenObject(n, buffers, createFunction, objectTable) {
  for (var i = 0; i < n; i++) {
    var buffer = GLctx[createFunction]();
    var id = buffer && GL.getNewId(objectTable);
    if (buffer) {
      buffer.name = id;
      objectTable[id] = buffer;
    } else {
      GL.recordError(1282);
    }
    HEAP32[(buffers + i * 4) >> 2] = id;
  }
}
function _emscripten_glGenBuffers(n, buffers) {
  __glGenObject(n, buffers, "createBuffer", GL.buffers);
}
function _emscripten_glGenFramebuffers(n, ids) {
  __glGenObject(n, ids, "createFramebuffer", GL.framebuffers);
}
function _emscripten_glGenQueries(n, ids) {
  __glGenObject(n, ids, "createQuery", GL.queries);
}
function _emscripten_glGenQueriesEXT(n, ids) {
  for (var i = 0; i < n; i++) {
    var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
    if (!query) {
      GL.recordError(1282);
      while (i < n) HEAP32[(ids + i++ * 4) >> 2] = 0;
      return;
    }
    var id = GL.getNewId(GL.queries);
    query.name = id;
    GL.queries[id] = query;
    HEAP32[(ids + i * 4) >> 2] = id;
  }
}
function _emscripten_glGenRenderbuffers(n, renderbuffers) {
  __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}
function _emscripten_glGenSamplers(n, samplers) {
  __glGenObject(n, samplers, "createSampler", GL.samplers);
}
function _emscripten_glGenTextures(n, textures) {
  __glGenObject(n, textures, "createTexture", GL.textures);
}
function _emscripten_glGenTransformFeedbacks(n, ids) {
  __glGenObject(n, ids, "createTransformFeedback", GL.transformFeedbacks);
}
function _emscripten_glGenVertexArrays(n, arrays) {
  __glGenObject(n, arrays, "createVertexArray", GL.vaos);
}
function _emscripten_glGenVertexArraysOES(n, arrays) {
  __glGenObject(n, arrays, "createVertexArray", GL.vaos);
}
function _emscripten_glGenerateMipmap(x0) {
  GLctx["generateMipmap"](x0);
}
function __glGetActiveAttribOrUniform(
  funcName,
  program,
  index,
  bufSize,
  length,
  size,
  type,
  name
) {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
    var numBytesWrittenExclNull =
      name && stringToUTF8(info.name, name, bufSize);
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    if (size) HEAP32[size >> 2] = info.size;
    if (type) HEAP32[type >> 2] = info.type;
  }
}
function _emscripten_glGetActiveAttrib(
  program,
  index,
  bufSize,
  length,
  size,
  type,
  name
) {
  __glGetActiveAttribOrUniform(
    "getActiveAttrib",
    program,
    index,
    bufSize,
    length,
    size,
    type,
    name
  );
}
function _emscripten_glGetActiveUniform(
  program,
  index,
  bufSize,
  length,
  size,
  type,
  name
) {
  __glGetActiveAttribOrUniform(
    "getActiveUniform",
    program,
    index,
    bufSize,
    length,
    size,
    type,
    name
  );
}
function _emscripten_glGetActiveUniformBlockName(
  program,
  uniformBlockIndex,
  bufSize,
  length,
  uniformBlockName
) {
  program = GL.programs[program];
  var result = GLctx["getActiveUniformBlockName"](program, uniformBlockIndex);
  if (!result) return;
  if (uniformBlockName && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(
      result,
      uniformBlockName,
      bufSize
    );
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
  } else {
    if (length) HEAP32[length >> 2] = 0;
  }
}
function _emscripten_glGetActiveUniformBlockiv(
  program,
  uniformBlockIndex,
  pname,
  params
) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35393) {
    var name = GLctx["getActiveUniformBlockName"](program, uniformBlockIndex);
    HEAP32[params >> 2] = name.length + 1;
    return;
  }
  var result = GLctx["getActiveUniformBlockParameter"](
    program,
    uniformBlockIndex,
    pname
  );
  if (result === null) return;
  if (pname == 35395) {
    for (var i = 0; i < result.length; i++) {
      HEAP32[(params + i * 4) >> 2] = result[i];
    }
  } else {
    HEAP32[params >> 2] = result;
  }
}
function _emscripten_glGetActiveUniformsiv(
  program,
  uniformCount,
  uniformIndices,
  pname,
  params
) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && uniformIndices == 0) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var ids = [];
  for (var i = 0; i < uniformCount; i++) {
    ids.push(HEAP32[(uniformIndices + i * 4) >> 2]);
  }
  var result = GLctx["getActiveUniforms"](program, ids, pname);
  if (!result) return;
  var len = result.length;
  for (var i = 0; i < len; i++) {
    HEAP32[(params + i * 4) >> 2] = result[i];
  }
}
function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
  var result = GLctx.getAttachedShaders(GL.programs[program]);
  var len = result.length;
  if (len > maxCount) {
    len = maxCount;
  }
  HEAP32[count >> 2] = len;
  for (var i = 0; i < len; ++i) {
    var id = GL.shaders.indexOf(result[i]);
    HEAP32[(shaders + i * 4) >> 2] = id;
  }
}
function _emscripten_glGetAttribLocation(program, name) {
  return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
}
function writeI53ToI64(ptr, num) {
  HEAPU32[ptr >> 2] = num;
  HEAPU32[(ptr + 4) >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296;
}
function emscriptenWebGLGet(name_, p, type) {
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
    case 36346:
      ret = 1;
      break;
    case 36344:
      if (type != 0 && type != 1) {
        GL.recordError(1280);
      }
      return;
    case 34814:
    case 36345:
      ret = 0;
      break;
    case 34466:
      var formats = GLctx.getParameter(34467);
      ret = formats ? formats.length : 0;
      break;
    case 33309:
      if (GL.currentContext.version < 2) {
        GL.recordError(1282);
        return;
      }
      var exts = GLctx.getSupportedExtensions() || [];
      ret = 2 * exts.length;
      break;
    case 33307:
    case 33308:
      if (GL.currentContext.version < 2) {
        GL.recordError(1280);
        return;
      }
      ret = name_ == 33307 ? 3 : 0;
      break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
      case "number":
        ret = result;
        break;
      case "boolean":
        ret = result ? 1 : 0;
        break;
      case "string":
        GL.recordError(1280);
        return;
      case "object":
        if (result === null) {
          switch (name_) {
            case 34964:
            case 35725:
            case 34965:
            case 36006:
            case 36007:
            case 32873:
            case 34229:
            case 36662:
            case 36663:
            case 35053:
            case 35055:
            case 36010:
            case 35097:
            case 35869:
            case 32874:
            case 36389:
            case 35983:
            case 35368:
            case 34068: {
              ret = 0;
              break;
            }
            default: {
              GL.recordError(1280);
              return;
            }
          }
        } else if (
          result instanceof Float32Array ||
          result instanceof Uint32Array ||
          result instanceof Int32Array ||
          result instanceof Array
        ) {
          for (var i = 0; i < result.length; ++i) {
            switch (type) {
              case 0:
                HEAP32[(p + i * 4) >> 2] = result[i];
                break;
              case 2:
                HEAPF32[(p + i * 4) >> 2] = result[i];
                break;
              case 4:
                HEAP8[(p + i) >> 0] = result[i] ? 1 : 0;
                break;
            }
          }
          return;
        } else {
          try {
            ret = result.name | 0;
          } catch (e) {
            GL.recordError(1280);
            err(
              "GL_INVALID_ENUM in glGet" +
                type +
                "v: Unknown object returned from WebGL getParameter(" +
                name_ +
                ")! (error: " +
                e +
                ")"
            );
            return;
          }
        }
        break;
      default:
        GL.recordError(1280);
        err(
          "GL_INVALID_ENUM in glGet" +
            type +
            "v: Native code calling glGet" +
            type +
            "v(" +
            name_ +
            ") and it returns " +
            result +
            " of type " +
            typeof result +
            "!"
        );
        return;
    }
  }
  switch (type) {
    case 1:
      writeI53ToI64(p, ret);
      break;
    case 0:
      HEAP32[p >> 2] = ret;
      break;
    case 2:
      HEAPF32[p >> 2] = ret;
      break;
    case 4:
      HEAP8[p >> 0] = ret ? 1 : 0;
      break;
  }
}
function _emscripten_glGetBooleanv(name_, p) {
  emscriptenWebGLGet(name_, p, 4);
}
function _emscripten_glGetBufferParameteri64v(target, value, data) {
  if (!data) {
    GL.recordError(1281);
    return;
  }
  writeI53ToI64(data, GLctx.getBufferParameter(target, value));
}
function _emscripten_glGetBufferParameteriv(target, value, data) {
  if (!data) {
    GL.recordError(1281);
    return;
  }
  HEAP32[data >> 2] = GLctx.getBufferParameter(target, value);
}
function _emscripten_glGetError() {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
}
function _emscripten_glGetFloatv(name_, p) {
  emscriptenWebGLGet(name_, p, 2);
}
function _emscripten_glGetFragDataLocation(program, name) {
  return GLctx["getFragDataLocation"](GL.programs[program], UTF8ToString(name));
}
function _emscripten_glGetFramebufferAttachmentParameteriv(
  target,
  attachment,
  pname,
  params
) {
  var result = GLctx.getFramebufferAttachmentParameter(
    target,
    attachment,
    pname
  );
  if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
    result = result.name | 0;
  }
  HEAP32[params >> 2] = result;
}
function emscriptenWebGLGetIndexed(target, index, data, type) {
  if (!data) {
    GL.recordError(1281);
    return;
  }
  var result = GLctx["getIndexedParameter"](target, index);
  var ret;
  switch (typeof result) {
    case "boolean":
      ret = result ? 1 : 0;
      break;
    case "number":
      ret = result;
      break;
    case "object":
      if (result === null) {
        switch (target) {
          case 35983:
          case 35368:
            ret = 0;
            break;
          default: {
            GL.recordError(1280);
            return;
          }
        }
      } else if (result instanceof WebGLBuffer) {
        ret = result.name | 0;
      } else {
        GL.recordError(1280);
        return;
      }
      break;
    default:
      GL.recordError(1280);
      return;
  }
  switch (type) {
    case 1:
      writeI53ToI64(data, ret);
      break;
    case 0:
      HEAP32[data >> 2] = ret;
      break;
    case 2:
      HEAPF32[data >> 2] = ret;
      break;
    case 4:
      HEAP8[data >> 0] = ret ? 1 : 0;
      break;
    default:
      throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type;
  }
}
function _emscripten_glGetInteger64i_v(target, index, data) {
  emscriptenWebGLGetIndexed(target, index, data, 1);
}
function _emscripten_glGetInteger64v(name_, p) {
  emscriptenWebGLGet(name_, p, 1);
}
function _emscripten_glGetIntegeri_v(target, index, data) {
  emscriptenWebGLGetIndexed(target, index, data, 0);
}
function _emscripten_glGetIntegerv(name_, p) {
  emscriptenWebGLGet(name_, p, 0);
}
function _emscripten_glGetInternalformativ(
  target,
  internalformat,
  pname,
  bufSize,
  params
) {
  if (bufSize < 0) {
    GL.recordError(1281);
    return;
  }
  if (!params) {
    GL.recordError(1281);
    return;
  }
  var ret = GLctx["getInternalformatParameter"](target, internalformat, pname);
  if (ret === null) return;
  for (var i = 0; i < ret.length && i < bufSize; ++i) {
    HEAP32[(params + i) >> 2] = ret[i];
  }
}
function _emscripten_glGetProgramBinary(
  program,
  bufSize,
  length,
  binaryFormat,
  binary
) {
  GL.recordError(1282);
}
function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull =
    maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
}
function _emscripten_glGetProgramiv(program, pname, p) {
  if (!p) {
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35716) {
    var log = GLctx.getProgramInfoLog(program);
    if (log === null) log = "(unknown error)";
    HEAP32[p >> 2] = log.length + 1;
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
        program.maxUniformLength = Math.max(
          program.maxUniformLength,
          GLctx.getActiveUniform(program, i).name.length + 1
        );
      }
    }
    HEAP32[p >> 2] = program.maxUniformLength;
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
        program.maxAttributeLength = Math.max(
          program.maxAttributeLength,
          GLctx.getActiveAttrib(program, i).name.length + 1
        );
      }
    }
    HEAP32[p >> 2] = program.maxAttributeLength;
  } else if (pname == 35381) {
    if (!program.maxUniformBlockNameLength) {
      for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
        program.maxUniformBlockNameLength = Math.max(
          program.maxUniformBlockNameLength,
          GLctx.getActiveUniformBlockName(program, i).length + 1
        );
      }
    }
    HEAP32[p >> 2] = program.maxUniformBlockNameLength;
  } else {
    HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname);
  }
}
function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  } else {
    param = GLctx["getQueryParameter"](query, pname);
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  writeI53ToI64(params, ret);
}
function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  HEAP32[params >> 2] = ret;
}
function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  } else {
    param = GLctx["getQueryParameter"](query, pname);
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  writeI53ToI64(params, ret);
}
function _emscripten_glGetQueryObjectuiv(id, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx["getQueryParameter"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  HEAP32[params >> 2] = ret;
}
function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  HEAP32[params >> 2] = ret;
}
function _emscripten_glGetQueryiv(target, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAP32[params >> 2] = GLctx["getQuery"](target, pname);
}
function _emscripten_glGetQueryivEXT(target, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAP32[params >> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](
    target,
    pname
  );
}
function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname);
}
function _emscripten_glGetSamplerParameterfv(sampler, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAPF32[params >> 2] = GLctx["getSamplerParameter"](
    GL.samplers[sampler],
    pname
  );
}
function _emscripten_glGetSamplerParameteriv(sampler, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAP32[params >> 2] = GLctx["getSamplerParameter"](
    GL.samplers[sampler],
    pname
  );
}
function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull =
    maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
}
function _emscripten_glGetShaderPrecisionFormat(
  shaderType,
  precisionType,
  range,
  precision
) {
  var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
  HEAP32[range >> 2] = result.rangeMin;
  HEAP32[(range + 4) >> 2] = result.rangeMax;
  HEAP32[precision >> 2] = result.precision;
}
function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
  var result = GLctx.getShaderSource(GL.shaders[shader]);
  if (!result) return;
  var numBytesWrittenExclNull =
    bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
}
function _emscripten_glGetShaderiv(shader, pname, p) {
  if (!p) {
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    var logLength = log ? log.length + 1 : 0;
    HEAP32[p >> 2] = logLength;
  } else if (pname == 35720) {
    var source = GLctx.getShaderSource(GL.shaders[shader]);
    var sourceLength = source ? source.length + 1 : 0;
    HEAP32[p >> 2] = sourceLength;
  } else {
    HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
}
function stringToNewUTF8(jsString) {
  var length = lengthBytesUTF8(jsString) + 1;
  var cString = _malloc(length);
  stringToUTF8(jsString, cString, length);
  return cString;
}
function _emscripten_glGetString(name_) {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
      case 7939:
        var exts = GLctx.getSupportedExtensions() || [];
        exts = exts.concat(
          exts.map(function (e) {
            return "GL_" + e;
          })
        );
        ret = stringToNewUTF8(exts.join(" "));
        break;
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        var s = GLctx.getParameter(name_);
        if (!s) {
          GL.recordError(1280);
        }
        ret = s && stringToNewUTF8(s);
        break;
      case 7938:
        var glVersion = GLctx.getParameter(7938);
        if (GL.currentContext.version >= 2)
          glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
        else {
          glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
        }
        ret = stringToNewUTF8(glVersion);
        break;
      case 35724:
        var glslVersion = GLctx.getParameter(35724);
        var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
        var ver_num = glslVersion.match(ver_re);
        if (ver_num !== null) {
          if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
          glslVersion =
            "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
        }
        ret = stringToNewUTF8(glslVersion);
        break;
      default:
        GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
}
function _emscripten_glGetStringi(name, index) {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    return 0;
  }
  var stringiCache = GL.stringiCache[name];
  if (stringiCache) {
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];
  }
  switch (name) {
    case 7939:
      var exts = GLctx.getSupportedExtensions() || [];
      exts = exts.concat(
        exts.map(function (e) {
          return "GL_" + e;
        })
      );
      exts = exts.map(function (e) {
        return stringToNewUTF8(e);
      });
      stringiCache = GL.stringiCache[name] = exts;
      if (index < 0 || index >= stringiCache.length) {
        GL.recordError(1281);
        return 0;
      }
      return stringiCache[index];
    default:
      GL.recordError(1280);
      return 0;
  }
}
function _emscripten_glGetSynciv(sync, pname, bufSize, length, values) {
  if (bufSize < 0) {
    GL.recordError(1281);
    return;
  }
  if (!values) {
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
  if (ret !== null) {
    HEAP32[values >> 2] = ret;
    if (length) HEAP32[length >> 2] = 1;
  }
}
function _emscripten_glGetTexParameterfv(target, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname);
}
function _emscripten_glGetTexParameteriv(target, pname, params) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  HEAP32[params >> 2] = GLctx.getTexParameter(target, pname);
}
function _emscripten_glGetTransformFeedbackVarying(
  program,
  index,
  bufSize,
  length,
  size,
  type,
  name
) {
  program = GL.programs[program];
  var info = GLctx["getTransformFeedbackVarying"](program, index);
  if (!info) return;
  if (name && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
  } else {
    if (length) HEAP32[length >> 2] = 0;
  }
  if (size) HEAP32[size >> 2] = info.size;
  if (type) HEAP32[type >> 2] = info.type;
}
function _emscripten_glGetUniformBlockIndex(program, uniformBlockName) {
  return GLctx["getUniformBlockIndex"](
    GL.programs[program],
    UTF8ToString(uniformBlockName)
  );
}
function _emscripten_glGetUniformIndices(
  program,
  uniformCount,
  uniformNames,
  uniformIndices
) {
  if (!uniformIndices) {
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var names = [];
  for (var i = 0; i < uniformCount; i++)
    names.push(UTF8ToString(HEAP32[(uniformNames + i * 4) >> 2]));
  var result = GLctx["getUniformIndices"](program, names);
  if (!result) return;
  var len = result.length;
  for (var i = 0; i < len; i++) {
    HEAP32[(uniformIndices + i * 4) >> 2] = result[i];
  }
}
function _emscripten_glGetUniformLocation(program, name) {
  function getLeftBracePos(name) {
    return name.slice(-1) == "]" && name.lastIndexOf("[");
  }
  name = UTF8ToString(name);
  program = GL.programs[program];
  var uniformLocsById = program.uniformLocsById;
  var uniformSizeAndIdsByName = program.uniformSizeAndIdsByName;
  var i, j;
  var arrayIndex = 0;
  var uniformBaseName = name;
  var leftBrace = getLeftBracePos(name);
  if (!uniformLocsById) {
    program.uniformLocsById = uniformLocsById = {};
    program.uniformArrayNamesById = {};
    for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
      var u = GLctx.getActiveUniform(program, i);
      var nm = u.name;
      var sz = u.size;
      var lb = getLeftBracePos(nm);
      var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
      var id = program.uniformIdCounter;
      program.uniformIdCounter += sz;
      uniformSizeAndIdsByName[arrayName] = [sz, id];
      for (j = 0; j < sz; ++j) {
        uniformLocsById[id] = j;
        program.uniformArrayNamesById[id++] = arrayName;
      }
    }
  }
  if (leftBrace > 0) {
    arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
    uniformBaseName = name.slice(0, leftBrace);
  }
  var sizeAndId = uniformSizeAndIdsByName[uniformBaseName];
  if (sizeAndId && arrayIndex < sizeAndId[0]) {
    arrayIndex += sizeAndId[1];
    if (
      (uniformLocsById[arrayIndex] =
        uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))
    ) {
      return arrayIndex;
    }
  }
  return -1;
}
function emscriptenWebGLGetUniform(program, location, params, type) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var data = GLctx.getUniform(program, program.uniformLocsById[location]);
  if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
      case 0:
        HEAP32[params >> 2] = data;
        break;
      case 2:
        HEAPF32[params >> 2] = data;
        break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
        case 0:
          HEAP32[(params + i * 4) >> 2] = data[i];
          break;
        case 2:
          HEAPF32[(params + i * 4) >> 2] = data[i];
          break;
      }
    }
  }
}
function _emscripten_glGetUniformfv(program, location, params) {
  emscriptenWebGLGetUniform(program, location, params, 2);
}
function _emscripten_glGetUniformiv(program, location, params) {
  emscriptenWebGLGetUniform(program, location, params, 0);
}
function _emscripten_glGetUniformuiv(program, location, params) {
  emscriptenWebGLGetUniform(program, location, params, 0);
}
function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
  if (!params) {
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err(
      "glGetVertexAttrib*v on client-side array: not supported, bad data returned"
    );
  }
  var data = GLctx.getVertexAttrib(index, pname);
  if (pname == 34975) {
    HEAP32[params >> 2] = data && data["name"];
  } else if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
      case 0:
        HEAP32[params >> 2] = data;
        break;
      case 2:
        HEAPF32[params >> 2] = data;
        break;
      case 5:
        HEAP32[params >> 2] = Math.fround(data);
        break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
        case 0:
          HEAP32[(params + i * 4) >> 2] = data[i];
          break;
        case 2:
          HEAPF32[(params + i * 4) >> 2] = data[i];
          break;
        case 5:
          HEAP32[(params + i * 4) >> 2] = Math.fround(data[i]);
          break;
      }
    }
  }
}
function _emscripten_glGetVertexAttribIiv(index, pname, params) {
  emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
}
function _emscripten_glGetVertexAttribIuiv(index, pname, params) {
  emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
}
function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
  if (!pointer) {
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err(
      "glGetVertexAttribPointer on client-side array: not supported, bad data returned"
    );
  }
  HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname);
}
function _emscripten_glGetVertexAttribfv(index, pname, params) {
  emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
}
function _emscripten_glGetVertexAttribiv(index, pname, params) {
  emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
}
function _emscripten_glHint(x0, x1) {
  GLctx["hint"](x0, x1);
}
function _emscripten_glInvalidateFramebuffer(
  target,
  numAttachments,
  attachments
) {
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = HEAP32[(attachments + i * 4) >> 2];
  }
  GLctx["invalidateFramebuffer"](target, list);
}
function _emscripten_glInvalidateSubFramebuffer(
  target,
  numAttachments,
  attachments,
  x,
  y,
  width,
  height
) {
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = HEAP32[(attachments + i * 4) >> 2];
  }
  GLctx["invalidateSubFramebuffer"](target, list, x, y, width, height);
}
function _emscripten_glIsBuffer(buffer) {
  var b = GL.buffers[buffer];
  if (!b) return 0;
  return GLctx.isBuffer(b);
}
function _emscripten_glIsEnabled(x0) {
  return GLctx["isEnabled"](x0);
}
function _emscripten_glIsFramebuffer(framebuffer) {
  var fb = GL.framebuffers[framebuffer];
  if (!fb) return 0;
  return GLctx.isFramebuffer(fb);
}
function _emscripten_glIsProgram(program) {
  program = GL.programs[program];
  if (!program) return 0;
  return GLctx.isProgram(program);
}
function _emscripten_glIsQuery(id) {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx["isQuery"](query);
}
function _emscripten_glIsQueryEXT(id) {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
}
function _emscripten_glIsRenderbuffer(renderbuffer) {
  var rb = GL.renderbuffers[renderbuffer];
  if (!rb) return 0;
  return GLctx.isRenderbuffer(rb);
}
function _emscripten_glIsSampler(id) {
  var sampler = GL.samplers[id];
  if (!sampler) return 0;
  return GLctx["isSampler"](sampler);
}
function _emscripten_glIsShader(shader) {
  var s = GL.shaders[shader];
  if (!s) return 0;
  return GLctx.isShader(s);
}
function _emscripten_glIsSync(sync) {
  return GLctx.isSync(GL.syncs[sync]);
}
function _emscripten_glIsTexture(id) {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture);
}
function _emscripten_glIsTransformFeedback(id) {
  return GLctx["isTransformFeedback"](GL.transformFeedbacks[id]);
}
function _emscripten_glIsVertexArray(array) {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx["isVertexArray"](vao);
}
function _emscripten_glIsVertexArrayOES(array) {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx["isVertexArray"](vao);
}
function _emscripten_glLineWidth(x0) {
  GLctx["lineWidth"](x0);
}
function _emscripten_glLinkProgram(program) {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  program.uniformLocsById = 0;
  program.uniformSizeAndIdsByName = {};
}
function _emscripten_glPauseTransformFeedback() {
  GLctx["pauseTransformFeedback"]();
}
function _emscripten_glPixelStorei(pname, param) {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  }
  GLctx.pixelStorei(pname, param);
}
function _emscripten_glPolygonOffset(x0, x1) {
  GLctx["polygonOffset"](x0, x1);
}
function _emscripten_glProgramBinary(program, binaryFormat, binary, length) {
  GL.recordError(1280);
}
function _emscripten_glProgramParameteri(program, pname, value) {
  GL.recordError(1280);
}
function _emscripten_glQueryCounterEXT(id, target) {
  GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
}
function _emscripten_glReadBuffer(x0) {
  GLctx["readBuffer"](x0);
}
function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = width * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
  return height * alignedRowSize;
}
function __colorChannelsInGlTextureFormat(format) {
  var colorChannels = {
    5: 3,
    6: 4,
    8: 2,
    29502: 3,
    29504: 4,
    26917: 2,
    26918: 2,
    29846: 3,
    29847: 4,
  };
  return colorChannels[format - 6402] || 1;
}
function heapObjectForWebGLType(type) {
  type -= 5120;
  if (type == 0) return HEAP8;
  if (type == 1) return HEAPU8;
  if (type == 2) return HEAP16;
  if (type == 4) return HEAP32;
  if (type == 6) return HEAPF32;
  if (
    type == 5 ||
    type == 28922 ||
    type == 28520 ||
    type == 30779 ||
    type == 30782
  )
    return HEAPU32;
  return HEAPU16;
}
function heapAccessShiftForWebGLHeap(heap) {
  return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
}
function emscriptenWebGLGetTexPixelData(
  type,
  format,
  width,
  height,
  pixels,
  internalFormat
) {
  var heap = heapObjectForWebGLType(type);
  var shift = heapAccessShiftForWebGLHeap(heap);
  var byteSize = 1 << shift;
  var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
  var bytes = computeUnpackAlignedImageSize(
    width,
    height,
    sizePerPixel,
    GL.unpackAlignment
  );
  return heap.subarray(pixels >> shift, (pixels + bytes) >> shift);
}
function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelPackBufferBinding) {
      GLctx.readPixels(x, y, width, height, format, type, pixels);
    } else {
      var heap = heapObjectForWebGLType(type);
      GLctx.readPixels(
        x,
        y,
        width,
        height,
        format,
        type,
        heap,
        pixels >> heapAccessShiftForWebGLHeap(heap)
      );
    }
    return;
  }
  var pixelData = emscriptenWebGLGetTexPixelData(
    type,
    format,
    width,
    height,
    pixels,
    format
  );
  if (!pixelData) {
    GL.recordError(1280);
    return;
  }
  GLctx.readPixels(x, y, width, height, format, type, pixelData);
}
function _emscripten_glReleaseShaderCompiler() {}
function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
  GLctx["renderbufferStorage"](x0, x1, x2, x3);
}
function _emscripten_glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
  GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4);
}
function _emscripten_glResumeTransformFeedback() {
  GLctx["resumeTransformFeedback"]();
}
function _emscripten_glSampleCoverage(value, invert) {
  GLctx.sampleCoverage(value, !!invert);
}
function _emscripten_glSamplerParameterf(sampler, pname, param) {
  GLctx["samplerParameterf"](GL.samplers[sampler], pname, param);
}
function _emscripten_glSamplerParameterfv(sampler, pname, params) {
  var param = HEAPF32[params >> 2];
  GLctx["samplerParameterf"](GL.samplers[sampler], pname, param);
}
function _emscripten_glSamplerParameteri(sampler, pname, param) {
  GLctx["samplerParameteri"](GL.samplers[sampler], pname, param);
}
function _emscripten_glSamplerParameteriv(sampler, pname, params) {
  var param = HEAP32[params >> 2];
  GLctx["samplerParameteri"](GL.samplers[sampler], pname, param);
}
function _emscripten_glScissor(x0, x1, x2, x3) {
  GLctx["scissor"](x0, x1, x2, x3);
}
function _emscripten_glShaderBinary() {
  GL.recordError(1280);
}
function _emscripten_glShaderSource(shader, count, string, length) {
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
}
function _emscripten_glStencilFunc(x0, x1, x2) {
  GLctx["stencilFunc"](x0, x1, x2);
}
function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
  GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
}
function _emscripten_glStencilMask(x0) {
  GLctx["stencilMask"](x0);
}
function _emscripten_glStencilMaskSeparate(x0, x1) {
  GLctx["stencilMaskSeparate"](x0, x1);
}
function _emscripten_glStencilOp(x0, x1, x2) {
  GLctx["stencilOp"](x0, x1, x2);
}
function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
  GLctx["stencilOpSeparate"](x0, x1, x2, x3);
}
function _emscripten_glTexImage2D(
  target,
  level,
  internalFormat,
  width,
  height,
  border,
  format,
  type,
  pixels
) {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        format,
        type,
        pixels
      );
    } else if (pixels) {
      var heap = heapObjectForWebGLType(type);
      GLctx.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        format,
        type,
        heap,
        pixels >> heapAccessShiftForWebGLHeap(heap)
      );
    } else {
      GLctx.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        format,
        type,
        null
      );
    }
    return;
  }
  GLctx.texImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    pixels
      ? emscriptenWebGLGetTexPixelData(
          type,
          format,
          width,
          height,
          pixels,
          internalFormat
        )
      : null
  );
}
function _emscripten_glTexImage3D(
  target,
  level,
  internalFormat,
  width,
  height,
  depth,
  border,
  format,
  type,
  pixels
) {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx["texImage3D"](
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      format,
      type,
      pixels
    );
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx["texImage3D"](
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      format,
      type,
      heap,
      pixels >> heapAccessShiftForWebGLHeap(heap)
    );
  } else {
    GLctx["texImage3D"](
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      format,
      type,
      null
    );
  }
}
function _emscripten_glTexParameterf(x0, x1, x2) {
  GLctx["texParameterf"](x0, x1, x2);
}
function _emscripten_glTexParameterfv(target, pname, params) {
  var param = HEAPF32[params >> 2];
  GLctx.texParameterf(target, pname, param);
}
function _emscripten_glTexParameteri(x0, x1, x2) {
  GLctx["texParameteri"](x0, x1, x2);
}
function _emscripten_glTexParameteriv(target, pname, params) {
  var param = HEAP32[params >> 2];
  GLctx.texParameteri(target, pname, param);
}
function _emscripten_glTexStorage2D(x0, x1, x2, x3, x4) {
  GLctx["texStorage2D"](x0, x1, x2, x3, x4);
}
function _emscripten_glTexStorage3D(x0, x1, x2, x3, x4, x5) {
  GLctx["texStorage3D"](x0, x1, x2, x3, x4, x5);
}
function _emscripten_glTexSubImage2D(
  target,
  level,
  xoffset,
  yoffset,
  width,
  height,
  format,
  type,
  pixels
) {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texSubImage2D(
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        type,
        pixels
      );
    } else if (pixels) {
      var heap = heapObjectForWebGLType(type);
      GLctx.texSubImage2D(
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        type,
        heap,
        pixels >> heapAccessShiftForWebGLHeap(heap)
      );
    } else {
      GLctx.texSubImage2D(
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        type,
        null
      );
    }
    return;
  }
  var pixelData = null;
  if (pixels)
    pixelData = emscriptenWebGLGetTexPixelData(
      type,
      format,
      width,
      height,
      pixels,
      0
    );
  GLctx.texSubImage2D(
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    type,
    pixelData
  );
}
function _emscripten_glTexSubImage3D(
  target,
  level,
  xoffset,
  yoffset,
  zoffset,
  width,
  height,
  depth,
  format,
  type,
  pixels
) {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx["texSubImage3D"](
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      pixels
    );
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx["texSubImage3D"](
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      heap,
      pixels >> heapAccessShiftForWebGLHeap(heap)
    );
  } else {
    GLctx["texSubImage3D"](
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      null
    );
  }
}
function _emscripten_glTransformFeedbackVaryings(
  program,
  count,
  varyings,
  bufferMode
) {
  program = GL.programs[program];
  var vars = [];
  for (var i = 0; i < count; i++)
    vars.push(UTF8ToString(HEAP32[(varyings + i * 4) >> 2]));
  GLctx["transformFeedbackVaryings"](program, vars, bufferMode);
}
function webglGetUniformLocation(location) {
  var p = GLctx.currentProgram;
  var webglLoc = p.uniformLocsById[location];
  if (webglLoc >= 0) {
    p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(
      p,
      p.uniformArrayNamesById[location] +
        (webglLoc > 0 ? "[" + webglLoc + "]" : "")
    );
  }
  return webglLoc;
}
function _emscripten_glUniform1f(location, v0) {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
}
var miniTempWebGLFloatBuffers = [];
function _emscripten_glUniform1fv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform1fv(
      webglGetUniformLocation(location),
      HEAPF32,
      value >> 2,
      count
    );
    return;
  }
  if (count <= 288) {
    var view = miniTempWebGLFloatBuffers[count - 1];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 4) >> 2);
  }
  GLctx.uniform1fv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform1i(location, v0) {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
}
var __miniTempWebGLIntBuffers = [];
function _emscripten_glUniform1iv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform1iv(
      webglGetUniformLocation(location),
      HEAP32,
      value >> 2,
      count
    );
    return;
  }
  if (count <= 288) {
    var view = __miniTempWebGLIntBuffers[count - 1];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 4) >> 2);
  }
  GLctx.uniform1iv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform1ui(location, v0) {
  GLctx.uniform1ui(webglGetUniformLocation(location), v0);
}
function _emscripten_glUniform1uiv(location, count, value) {
  GLctx.uniform1uiv(
    webglGetUniformLocation(location),
    HEAPU32,
    value >> 2,
    count
  );
}
function _emscripten_glUniform2f(location, v0, v1) {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
}
function _emscripten_glUniform2fv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform2fv(
      webglGetUniformLocation(location),
      HEAPF32,
      value >> 2,
      count * 2
    );
    return;
  }
  if (count <= 144) {
    var view = miniTempWebGLFloatBuffers[2 * count - 1];
    for (var i = 0; i < 2 * count; i += 2) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
      view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 8) >> 2);
  }
  GLctx.uniform2fv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform2i(location, v0, v1) {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
}
function _emscripten_glUniform2iv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform2iv(
      webglGetUniformLocation(location),
      HEAP32,
      value >> 2,
      count * 2
    );
    return;
  }
  if (count <= 144) {
    var view = __miniTempWebGLIntBuffers[2 * count - 1];
    for (var i = 0; i < 2 * count; i += 2) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
      view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 8) >> 2);
  }
  GLctx.uniform2iv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform2ui(location, v0, v1) {
  GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1);
}
function _emscripten_glUniform2uiv(location, count, value) {
  GLctx.uniform2uiv(
    webglGetUniformLocation(location),
    HEAPU32,
    value >> 2,
    count * 2
  );
}
function _emscripten_glUniform3f(location, v0, v1, v2) {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
}
function _emscripten_glUniform3fv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform3fv(
      webglGetUniformLocation(location),
      HEAPF32,
      value >> 2,
      count * 3
    );
    return;
  }
  if (count <= 96) {
    var view = miniTempWebGLFloatBuffers[3 * count - 1];
    for (var i = 0; i < 3 * count; i += 3) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
      view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 12) >> 2);
  }
  GLctx.uniform3fv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform3i(location, v0, v1, v2) {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
}
function _emscripten_glUniform3iv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform3iv(
      webglGetUniformLocation(location),
      HEAP32,
      value >> 2,
      count * 3
    );
    return;
  }
  if (count <= 96) {
    var view = __miniTempWebGLIntBuffers[3 * count - 1];
    for (var i = 0; i < 3 * count; i += 3) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
      view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 12) >> 2);
  }
  GLctx.uniform3iv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform3ui(location, v0, v1, v2) {
  GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2);
}
function _emscripten_glUniform3uiv(location, count, value) {
  GLctx.uniform3uiv(
    webglGetUniformLocation(location),
    HEAPU32,
    value >> 2,
    count * 3
  );
}
function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
}
function _emscripten_glUniform4fv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform4fv(
      webglGetUniformLocation(location),
      HEAPF32,
      value >> 2,
      count * 4
    );
    return;
  }
  if (count <= 72) {
    var view = miniTempWebGLFloatBuffers[4 * count - 1];
    var heap = HEAPF32;
    value >>= 2;
    for (var i = 0; i < 4 * count; i += 4) {
      var dst = value + i;
      view[i] = heap[dst];
      view[i + 1] = heap[dst + 1];
      view[i + 2] = heap[dst + 2];
      view[i + 3] = heap[dst + 3];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2);
  }
  GLctx.uniform4fv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
}
function _emscripten_glUniform4iv(location, count, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniform4iv(
      webglGetUniformLocation(location),
      HEAP32,
      value >> 2,
      count * 4
    );
    return;
  }
  if (count <= 72) {
    var view = __miniTempWebGLIntBuffers[4 * count - 1];
    for (var i = 0; i < 4 * count; i += 4) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
      view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2];
      view[i + 3] = HEAP32[(value + (4 * i + 12)) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 16) >> 2);
  }
  GLctx.uniform4iv(webglGetUniformLocation(location), view);
}
function _emscripten_glUniform4ui(location, v0, v1, v2, v3) {
  GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3);
}
function _emscripten_glUniform4uiv(location, count, value) {
  GLctx.uniform4uiv(
    webglGetUniformLocation(location),
    HEAPU32,
    value >> 2,
    count * 4
  );
}
function _emscripten_glUniformBlockBinding(
  program,
  uniformBlockIndex,
  uniformBlockBinding
) {
  program = GL.programs[program];
  GLctx["uniformBlockBinding"](program, uniformBlockIndex, uniformBlockBinding);
}
function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniformMatrix2fv(
      webglGetUniformLocation(location),
      !!transpose,
      HEAPF32,
      value >> 2,
      count * 4
    );
    return;
  }
  if (count <= 72) {
    var view = miniTempWebGLFloatBuffers[4 * count - 1];
    for (var i = 0; i < 4 * count; i += 4) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
      view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2];
      view[i + 3] = HEAPF32[(value + (4 * i + 12)) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2);
  }
  GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
}
function _emscripten_glUniformMatrix2x3fv(location, count, transpose, value) {
  GLctx.uniformMatrix2x3fv(
    webglGetUniformLocation(location),
    !!transpose,
    HEAPF32,
    value >> 2,
    count * 6
  );
}
function _emscripten_glUniformMatrix2x4fv(location, count, transpose, value) {
  GLctx.uniformMatrix2x4fv(
    webglGetUniformLocation(location),
    !!transpose,
    HEAPF32,
    value >> 2,
    count * 8
  );
}
function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniformMatrix3fv(
      webglGetUniformLocation(location),
      !!transpose,
      HEAPF32,
      value >> 2,
      count * 9
    );
    return;
  }
  if (count <= 32) {
    var view = miniTempWebGLFloatBuffers[9 * count - 1];
    for (var i = 0; i < 9 * count; i += 9) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
      view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2];
      view[i + 3] = HEAPF32[(value + (4 * i + 12)) >> 2];
      view[i + 4] = HEAPF32[(value + (4 * i + 16)) >> 2];
      view[i + 5] = HEAPF32[(value + (4 * i + 20)) >> 2];
      view[i + 6] = HEAPF32[(value + (4 * i + 24)) >> 2];
      view[i + 7] = HEAPF32[(value + (4 * i + 28)) >> 2];
      view[i + 8] = HEAPF32[(value + (4 * i + 32)) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 36) >> 2);
  }
  GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
}
function _emscripten_glUniformMatrix3x2fv(location, count, transpose, value) {
  GLctx.uniformMatrix3x2fv(
    webglGetUniformLocation(location),
    !!transpose,
    HEAPF32,
    value >> 2,
    count * 6
  );
}
function _emscripten_glUniformMatrix3x4fv(location, count, transpose, value) {
  GLctx.uniformMatrix3x4fv(
    webglGetUniformLocation(location),
    !!transpose,
    HEAPF32,
    value >> 2,
    count * 12
  );
}
function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
  if (GL.currentContext.version >= 2) {
    GLctx.uniformMatrix4fv(
      webglGetUniformLocation(location),
      !!transpose,
      HEAPF32,
      value >> 2,
      count * 16
    );
    return;
  }
  if (count <= 18) {
    var view = miniTempWebGLFloatBuffers[16 * count - 1];
    var heap = HEAPF32;
    value >>= 2;
    for (var i = 0; i < 16 * count; i += 16) {
      var dst = value + i;
      view[i] = heap[dst];
      view[i + 1] = heap[dst + 1];
      view[i + 2] = heap[dst + 2];
      view[i + 3] = heap[dst + 3];
      view[i + 4] = heap[dst + 4];
      view[i + 5] = heap[dst + 5];
      view[i + 6] = heap[dst + 6];
      view[i + 7] = heap[dst + 7];
      view[i + 8] = heap[dst + 8];
      view[i + 9] = heap[dst + 9];
      view[i + 10] = heap[dst + 10];
      view[i + 11] = heap[dst + 11];
      view[i + 12] = heap[dst + 12];
      view[i + 13] = heap[dst + 13];
      view[i + 14] = heap[dst + 14];
      view[i + 15] = heap[dst + 15];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 64) >> 2);
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
}
function _emscripten_glUniformMatrix4x2fv(location, count, transpose, value) {
  GLctx.uniformMatrix4x2fv(
    webglGetUniformLocation(location),
    !!transpose,
    HEAPF32,
    value >> 2,
    count * 8
  );
}
function _emscripten_glUniformMatrix4x3fv(location, count, transpose, value) {
  GLctx.uniformMatrix4x3fv(
    webglGetUniformLocation(location),
    !!transpose,
    HEAPF32,
    value >> 2,
    count * 12
  );
}
function _emscripten_glUseProgram(program) {
  program = GL.programs[program];
  GLctx.useProgram(program);
  GLctx.currentProgram = program;
}
function _emscripten_glValidateProgram(program) {
  GLctx.validateProgram(GL.programs[program]);
}
function _emscripten_glVertexAttrib1f(x0, x1) {
  GLctx["vertexAttrib1f"](x0, x1);
}
function _emscripten_glVertexAttrib1fv(index, v) {
  GLctx.vertexAttrib1f(index, HEAPF32[v >> 2]);
}
function _emscripten_glVertexAttrib2f(x0, x1, x2) {
  GLctx["vertexAttrib2f"](x0, x1, x2);
}
function _emscripten_glVertexAttrib2fv(index, v) {
  GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[(v + 4) >> 2]);
}
function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) {
  GLctx["vertexAttrib3f"](x0, x1, x2, x3);
}
function _emscripten_glVertexAttrib3fv(index, v) {
  GLctx.vertexAttrib3f(
    index,
    HEAPF32[v >> 2],
    HEAPF32[(v + 4) >> 2],
    HEAPF32[(v + 8) >> 2]
  );
}
function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) {
  GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4);
}
function _emscripten_glVertexAttrib4fv(index, v) {
  GLctx.vertexAttrib4f(
    index,
    HEAPF32[v >> 2],
    HEAPF32[(v + 4) >> 2],
    HEAPF32[(v + 8) >> 2],
    HEAPF32[(v + 12) >> 2]
  );
}
function _emscripten_glVertexAttribDivisor(index, divisor) {
  GLctx["vertexAttribDivisor"](index, divisor);
}
function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
  GLctx["vertexAttribDivisor"](index, divisor);
}
function _emscripten_glVertexAttribDivisorARB(index, divisor) {
  GLctx["vertexAttribDivisor"](index, divisor);
}
function _emscripten_glVertexAttribDivisorEXT(index, divisor) {
  GLctx["vertexAttribDivisor"](index, divisor);
}
function _emscripten_glVertexAttribDivisorNV(index, divisor) {
  GLctx["vertexAttribDivisor"](index, divisor);
}
function _emscripten_glVertexAttribI4i(x0, x1, x2, x3, x4) {
  GLctx["vertexAttribI4i"](x0, x1, x2, x3, x4);
}
function _emscripten_glVertexAttribI4iv(index, v) {
  GLctx.vertexAttribI4i(
    index,
    HEAP32[v >> 2],
    HEAP32[(v + 4) >> 2],
    HEAP32[(v + 8) >> 2],
    HEAP32[(v + 12) >> 2]
  );
}
function _emscripten_glVertexAttribI4ui(x0, x1, x2, x3, x4) {
  GLctx["vertexAttribI4ui"](x0, x1, x2, x3, x4);
}
function _emscripten_glVertexAttribI4uiv(index, v) {
  GLctx.vertexAttribI4ui(
    index,
    HEAPU32[v >> 2],
    HEAPU32[(v + 4) >> 2],
    HEAPU32[(v + 8) >> 2],
    HEAPU32[(v + 12) >> 2]
  );
}
function _emscripten_glVertexAttribIPointer(index, size, type, stride, ptr) {
  GLctx["vertexAttribIPointer"](index, size, type, stride, ptr);
}
function _emscripten_glVertexAttribPointer(
  index,
  size,
  type,
  normalized,
  stride,
  ptr
) {
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = normalized;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function (
      index,
      size,
      type,
      normalized,
      stride,
      ptr
    ) {
      this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}
function _emscripten_glViewport(x0, x1, x2, x3) {
  GLctx["viewport"](x0, x1, x2, x3);
}
function _emscripten_glWaitSync(sync, flags, timeoutLo, timeoutHi) {
  GLctx.waitSync(
    GL.syncs[sync],
    flags,
    convertI32PairToI53(timeoutLo, timeoutHi)
  );
}
function _emscripten_has_asyncify() {
  return 1;
}
function reallyNegative(x) {
  return x < 0 || (x === 0 && 1 / x === -Infinity);
}
function convertU32PairToI53(lo, hi) {
  return (lo >>> 0) + (hi >>> 0) * 4294967296;
}
function reSign(value, bits) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits - 1)) : Math.pow(2, bits - 1);
  if (value >= half && (bits <= 32 || value > half)) {
    value = -2 * half + value;
  }
  return value;
}
function unSign(value, bits) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32
    ? 2 * Math.abs(1 << (bits - 1)) + value
    : Math.pow(2, bits) + value;
}
function formatString(format, varargs) {
  var textIndex = format;
  var argIndex = varargs;
  function prepVararg(ptr, type) {
    if (type === "double" || type === "i64") {
      if (ptr & 7) {
        ptr += 4;
      }
    } else {
    }
    return ptr;
  }
  function getNextArg(type) {
    var ret;
    argIndex = prepVararg(argIndex, type);
    if (type === "double") {
      ret = HEAPF64[argIndex >> 3];
      argIndex += 8;
    } else if (type == "i64") {
      ret = [HEAP32[argIndex >> 2], HEAP32[(argIndex + 4) >> 2]];
      argIndex += 8;
    } else {
      type = "i32";
      ret = HEAP32[argIndex >> 2];
      argIndex += 4;
    }
    return ret;
  }
  var ret = [];
  var curr, next, currArg;
  while (1) {
    var startTextIndex = textIndex;
    curr = HEAP8[textIndex >> 0];
    if (curr === 0) break;
    next = HEAP8[(textIndex + 1) >> 0];
    if (curr == 37) {
      var flagAlwaysSigned = false;
      var flagLeftAlign = false;
      var flagAlternative = false;
      var flagZeroPad = false;
      var flagPadSign = false;
      flagsLoop: while (1) {
        switch (next) {
          case 43:
            flagAlwaysSigned = true;
            break;
          case 45:
            flagLeftAlign = true;
            break;
          case 35:
            flagAlternative = true;
            break;
          case 48:
            if (flagZeroPad) {
              break flagsLoop;
            } else {
              flagZeroPad = true;
              break;
            }
          case 32:
            flagPadSign = true;
            break;
          default:
            break flagsLoop;
        }
        textIndex++;
        next = HEAP8[(textIndex + 1) >> 0];
      }
      var width = 0;
      if (next == 42) {
        width = getNextArg("i32");
        textIndex++;
        next = HEAP8[(textIndex + 1) >> 0];
      } else {
        while (next >= 48 && next <= 57) {
          width = width * 10 + (next - 48);
          textIndex++;
          next = HEAP8[(textIndex + 1) >> 0];
        }
      }
      var precisionSet = false,
        precision = -1;
      if (next == 46) {
        precision = 0;
        precisionSet = true;
        textIndex++;
        next = HEAP8[(textIndex + 1) >> 0];
        if (next == 42) {
          precision = getNextArg("i32");
          textIndex++;
        } else {
          while (1) {
            var precisionChr = HEAP8[(textIndex + 1) >> 0];
            if (precisionChr < 48 || precisionChr > 57) break;
            precision = precision * 10 + (precisionChr - 48);
            textIndex++;
          }
        }
        next = HEAP8[(textIndex + 1) >> 0];
      }
      if (precision < 0) {
        precision = 6;
        precisionSet = false;
      }
      var argSize;
      switch (String.fromCharCode(next)) {
        case "h":
          var nextNext = HEAP8[(textIndex + 2) >> 0];
          if (nextNext == 104) {
            textIndex++;
            argSize = 1;
          } else {
            argSize = 2;
          }
          break;
        case "l":
          var nextNext = HEAP8[(textIndex + 2) >> 0];
          if (nextNext == 108) {
            textIndex++;
            argSize = 8;
          } else {
            argSize = 4;
          }
          break;
        case "L":
        case "q":
        case "j":
          argSize = 8;
          break;
        case "z":
        case "t":
        case "I":
          argSize = 4;
          break;
        default:
          argSize = null;
      }
      if (argSize) textIndex++;
      next = HEAP8[(textIndex + 1) >> 0];
      switch (String.fromCharCode(next)) {
        case "d":
        case "i":
        case "u":
        case "o":
        case "x":
        case "X":
        case "p": {
          var signed = next == 100 || next == 105;
          argSize = argSize || 4;
          currArg = getNextArg("i" + argSize * 8);
          var argText;
          if (argSize == 8) {
            currArg =
              next == 117
                ? convertU32PairToI53(currArg[0], currArg[1])
                : convertI32PairToI53(currArg[0], currArg[1]);
          }
          if (argSize <= 4) {
            var limit = Math.pow(256, argSize) - 1;
            currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
          }
          var currAbsArg = Math.abs(currArg);
          var prefix = "";
          if (next == 100 || next == 105) {
            argText = reSign(currArg, 8 * argSize, 1).toString(10);
          } else if (next == 117) {
            argText = unSign(currArg, 8 * argSize, 1).toString(10);
            currArg = Math.abs(currArg);
          } else if (next == 111) {
            argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8);
          } else if (next == 120 || next == 88) {
            prefix = flagAlternative && currArg != 0 ? "0x" : "";
            if (currArg < 0) {
              currArg = -currArg;
              argText = (currAbsArg - 1).toString(16);
              var buffer = [];
              for (var i = 0; i < argText.length; i++) {
                buffer.push((15 - parseInt(argText[i], 16)).toString(16));
              }
              argText = buffer.join("");
              while (argText.length < argSize * 2) argText = "f" + argText;
            } else {
              argText = currAbsArg.toString(16);
            }
            if (next == 88) {
              prefix = prefix.toUpperCase();
              argText = argText.toUpperCase();
            }
          } else if (next == 112) {
            if (currAbsArg === 0) {
              argText = "(nil)";
            } else {
              prefix = "0x";
              argText = currAbsArg.toString(16);
            }
          }
          if (precisionSet) {
            while (argText.length < precision) {
              argText = "0" + argText;
            }
          }
          if (currArg >= 0) {
            if (flagAlwaysSigned) {
              prefix = "+" + prefix;
            } else if (flagPadSign) {
              prefix = " " + prefix;
            }
          }
          if (argText.charAt(0) == "-") {
            prefix = "-" + prefix;
            argText = argText.substr(1);
          }
          while (prefix.length + argText.length < width) {
            if (flagLeftAlign) {
              argText += " ";
            } else {
              if (flagZeroPad) {
                argText = "0" + argText;
              } else {
                prefix = " " + prefix;
              }
            }
          }
          argText = prefix + argText;
          argText.split("").forEach(function (chr) {
            ret.push(chr.charCodeAt(0));
          });
          break;
        }
        case "f":
        case "F":
        case "e":
        case "E":
        case "g":
        case "G": {
          currArg = getNextArg("double");
          var argText;
          if (isNaN(currArg)) {
            argText = "nan";
            flagZeroPad = false;
          } else if (!isFinite(currArg)) {
            argText = (currArg < 0 ? "-" : "") + "inf";
            flagZeroPad = false;
          } else {
            var isGeneral = false;
            var effectivePrecision = Math.min(precision, 20);
            if (next == 103 || next == 71) {
              isGeneral = true;
              precision = precision || 1;
              var exponent = parseInt(
                currArg.toExponential(effectivePrecision).split("e")[1],
                10
              );
              if (precision > exponent && exponent >= -4) {
                next = (next == 103 ? "f" : "F").charCodeAt(0);
                precision -= exponent + 1;
              } else {
                next = (next == 103 ? "e" : "E").charCodeAt(0);
                precision--;
              }
              effectivePrecision = Math.min(precision, 20);
            }
            if (next == 101 || next == 69) {
              argText = currArg.toExponential(effectivePrecision);
              if (/[eE][-+]\d$/.test(argText)) {
                argText = argText.slice(0, -1) + "0" + argText.slice(-1);
              }
            } else if (next == 102 || next == 70) {
              argText = currArg.toFixed(effectivePrecision);
              if (currArg === 0 && reallyNegative(currArg)) {
                argText = "-" + argText;
              }
            }
            var parts = argText.split("e");
            if (isGeneral && !flagAlternative) {
              while (
                parts[0].length > 1 &&
                parts[0].includes(".") &&
                (parts[0].slice(-1) == "0" || parts[0].slice(-1) == ".")
              ) {
                parts[0] = parts[0].slice(0, -1);
              }
            } else {
              if (flagAlternative && argText.indexOf(".") == -1)
                parts[0] += ".";
              while (precision > effectivePrecision++) parts[0] += "0";
            }
            argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
            if (next == 69) argText = argText.toUpperCase();
            if (currArg >= 0) {
              if (flagAlwaysSigned) {
                argText = "+" + argText;
              } else if (flagPadSign) {
                argText = " " + argText;
              }
            }
          }
          while (argText.length < width) {
            if (flagLeftAlign) {
              argText += " ";
            } else {
              if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
                argText = argText[0] + "0" + argText.slice(1);
              } else {
                argText = (flagZeroPad ? "0" : " ") + argText;
              }
            }
          }
          if (next < 97) argText = argText.toUpperCase();
          argText.split("").forEach(function (chr) {
            ret.push(chr.charCodeAt(0));
          });
          break;
        }
        case "s": {
          var arg = getNextArg("i8*");
          var argLength = arg ? _strlen(arg) : "(null)".length;
          if (precisionSet) argLength = Math.min(argLength, precision);
          if (!flagLeftAlign) {
            while (argLength < width--) {
              ret.push(32);
            }
          }
          if (arg) {
            for (var i = 0; i < argLength; i++) {
              ret.push(HEAPU8[arg++ >> 0]);
            }
          } else {
            ret = ret.concat(
              intArrayFromString("(null)".substr(0, argLength), true)
            );
          }
          if (flagLeftAlign) {
            while (argLength < width--) {
              ret.push(32);
            }
          }
          break;
        }
        case "c": {
          if (flagLeftAlign) ret.push(getNextArg("i8"));
          while (--width > 0) {
            ret.push(32);
          }
          if (!flagLeftAlign) ret.push(getNextArg("i8"));
          break;
        }
        case "n": {
          var ptr = getNextArg("i32*");
          HEAP32[ptr >> 2] = ret.length;
          break;
        }
        case "%": {
          ret.push(curr);
          break;
        }
        default: {
          for (var i = startTextIndex; i < textIndex + 2; i++) {
            ret.push(HEAP8[i >> 0]);
          }
        }
      }
      textIndex += 2;
    } else {
      ret.push(curr);
      textIndex += 1;
    }
  }
  return ret;
}
function _emscripten_log_js(flags, str) {
  if (flags & 24) {
    str = str.replace(/\s+$/, "");
    str += (str.length > 0 ? "\n" : "") + _emscripten_get_callstack_js(flags);
  }
  if (flags & 1) {
    if (flags & 4) {
      console.error(str);
    } else if (flags & 2) {
      console.warn(str);
    } else if (flags & 512) {
      console.info(str);
    } else if (flags & 256) {
      console.debug(str);
    } else {
      console.log(str);
    }
  } else if (flags & 6) {
    err(str);
  } else {
    out(str);
  }
}
function _emscripten_log(flags, format, varargs) {
  var result = formatString(format, varargs);
  var str = UTF8ArrayToString(result, 0);
  _emscripten_log_js(flags, str);
}
function _longjmp(env, value) {
  _setThrew(env, value || 1);
  throw "longjmp";
}
function _emscripten_longjmp(a0, a1) {
  return _longjmp(a0, a1);
}
function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.copyWithin(dest, src, src + num);
}
function doRequestFullscreen(target, strategy) {
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
    return -3;
  }
  var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  if (!canPerformRequests) {
    if (strategy.deferUntilInEventHandler) {
      JSEvents.deferCall(_JSEvents_requestFullscreen, 1, [target, strategy]);
      return 1;
    } else {
      return -2;
    }
  }
  return _JSEvents_requestFullscreen(target, strategy);
}
function _emscripten_request_fullscreen_strategy(
  target,
  deferUntilInEventHandler,
  fullscreenStrategy
) {
  var strategy = {
    scaleMode: HEAP32[fullscreenStrategy >> 2],
    canvasResolutionScaleMode: HEAP32[(fullscreenStrategy + 4) >> 2],
    filteringMode: HEAP32[(fullscreenStrategy + 8) >> 2],
    deferUntilInEventHandler: deferUntilInEventHandler,
    canvasResizedCallback: HEAP32[(fullscreenStrategy + 12) >> 2],
    canvasResizedCallbackUserData: HEAP32[(fullscreenStrategy + 16) >> 2],
  };
  return doRequestFullscreen(target, strategy);
}
function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestPointerLock && !target.msRequestPointerLock) {
    return -1;
  }
  var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  if (!canPerformRequests) {
    if (deferUntilInEventHandler) {
      JSEvents.deferCall(requestPointerLock, 2, [target]);
      return 1;
    } else {
      return -2;
    }
  }
  return requestPointerLock(target);
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
    updateGlobalBufferAndViews(wasmMemory.buffer);
    return 1;
  } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
  var oldSize = HEAPU8.length;
  requestedSize = requestedSize >>> 0;
  var maxHeapSize = 2147483648;
  if (requestedSize > maxHeapSize) {
    return false;
  }
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(
      maxHeapSize,
      alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
    );
    var replacement = emscripten_realloc_buffer(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}
function _emscripten_run_script(ptr) {
  eval(UTF8ToString(ptr));
}
function _emscripten_run_script_int(ptr) {
  return eval(UTF8ToString(ptr)) | 0;
}
function _emscripten_run_script_string(ptr) {
  var s = eval(UTF8ToString(ptr));
  if (s == null) {
    return 0;
  }
  s += "";
  var me = _emscripten_run_script_string;
  var len = lengthBytesUTF8(s);
  if (!me.bufferSize || me.bufferSize < len + 1) {
    if (me.bufferSize) _free(me.buffer);
    me.bufferSize = len + 1;
    me.buffer = _malloc(me.bufferSize);
  }
  stringToUTF8(s, me.buffer, me.bufferSize);
  return me.buffer;
}
function _emscripten_sample_gamepad_data() {
  return (JSEvents.lastGamepadState = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads()
    : null)
    ? 0
    : -1;
}
function registerBeforeUnloadEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString
) {
  var beforeUnloadEventHandlerFunc = function (ev) {
    var e = ev || event;
    var confirmationMessage = (function (a1, a2, a3) {
      return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
    })(eventTypeId, 0, userData);
    if (confirmationMessage) {
      confirmationMessage = UTF8ToString(confirmationMessage);
    }
    if (confirmationMessage) {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: beforeUnloadEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_beforeunload_callback_on_thread(
  userData,
  callbackfunc,
  targetThread
) {
  if (typeof onbeforeunload === "undefined") return -1;
  if (targetThread !== 1) return -5;
  registerBeforeUnloadEventCallback(
    2,
    userData,
    true,
    callbackfunc,
    28,
    "beforeunload"
  );
  return 0;
}
function registerFocusEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);
  var focusEventHandlerFunc = function (ev) {
    var e = ev || event;
    var nodeName = JSEvents.getNodeNameForTarget(e.target);
    var id = e.target.id ? e.target.id : "";
    var focusEvent = JSEvents.focusEvent;
    stringToUTF8(nodeName, focusEvent + 0, 128);
    stringToUTF8(id, focusEvent + 128, 128);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, focusEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: focusEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_blur_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerFocusEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    12,
    "blur",
    targetThread
  );
  return 0;
}
function _emscripten_set_element_css_size(target, width, height) {
  target = findEventTarget(target);
  if (!target) return -4;
  target.style.width = width + "px";
  target.style.height = height + "px";
  return 0;
}
function _emscripten_set_focus_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerFocusEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    13,
    "focus",
    targetThread
  );
  return 0;
}
function fillFullscreenChangeEventData(eventStruct) {
  var fullscreenElement =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;
  var isFullscreen = !!fullscreenElement;
  HEAP32[eventStruct >> 2] = isFullscreen;
  HEAP32[(eventStruct + 4) >> 2] = JSEvents.fullscreenEnabled();
  var reportedElement = isFullscreen
    ? fullscreenElement
    : JSEvents.previousFullscreenElement;
  var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
  var id = reportedElement && reportedElement.id ? reportedElement.id : "";
  stringToUTF8(nodeName, eventStruct + 8, 128);
  stringToUTF8(id, eventStruct + 136, 128);
  HEAP32[(eventStruct + 264) >> 2] = reportedElement
    ? reportedElement.clientWidth
    : 0;
  HEAP32[(eventStruct + 268) >> 2] = reportedElement
    ? reportedElement.clientHeight
    : 0;
  HEAP32[(eventStruct + 272) >> 2] = screen.width;
  HEAP32[(eventStruct + 276) >> 2] = screen.height;
  if (isFullscreen) {
    JSEvents.previousFullscreenElement = fullscreenElement;
  }
}
function registerFullscreenChangeEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.fullscreenChangeEvent)
    JSEvents.fullscreenChangeEvent = _malloc(280);
  var fullscreenChangeEventhandlerFunc = function (ev) {
    var e = ev || event;
    var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
    fillFullscreenChangeEventData(fullscreenChangeEvent);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, fullscreenChangeEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: fullscreenChangeEventhandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_fullscreenchange_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  registerFullscreenChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    19,
    "fullscreenchange",
    targetThread
  );
  registerFullscreenChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    19,
    "webkitfullscreenchange",
    targetThread
  );
  return 0;
}
function registerGamepadEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1432);
  var gamepadEventHandlerFunc = function (ev) {
    var e = ev || event;
    var gamepadEvent = JSEvents.gamepadEvent;
    fillGamepadEventData(gamepadEvent, e["gamepad"]);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, gamepadEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    allowsDeferredCalls: true,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: gamepadEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_gamepadconnected_callback_on_thread(
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
  registerGamepadEventCallback(
    2,
    userData,
    useCapture,
    callbackfunc,
    26,
    "gamepadconnected",
    targetThread
  );
  return 0;
}
function _emscripten_set_gamepaddisconnected_callback_on_thread(
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
  registerGamepadEventCallback(
    2,
    userData,
    useCapture,
    callbackfunc,
    27,
    "gamepaddisconnected",
    targetThread
  );
  return 0;
}
function registerKeyEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(164);
  var keyEventHandlerFunc = function (e) {
    var keyEventData = JSEvents.keyEvent;
    var idx = keyEventData >> 2;
    HEAP32[idx + 0] = e.location;
    HEAP32[idx + 1] = e.ctrlKey;
    HEAP32[idx + 2] = e.shiftKey;
    HEAP32[idx + 3] = e.altKey;
    HEAP32[idx + 4] = e.metaKey;
    HEAP32[idx + 5] = e.repeat;
    HEAP32[idx + 6] = e.charCode;
    HEAP32[idx + 7] = e.keyCode;
    HEAP32[idx + 8] = e.which;
    stringToUTF8(e.key || "", keyEventData + 36, 32);
    stringToUTF8(e.code || "", keyEventData + 68, 32);
    stringToUTF8(e.char || "", keyEventData + 100, 32);
    stringToUTF8(e.locale || "", keyEventData + 132, 32);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, keyEventData, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    allowsDeferredCalls: true,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: keyEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_keydown_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerKeyEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    2,
    "keydown",
    targetThread
  );
  return 0;
}
function _emscripten_set_keypress_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerKeyEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    1,
    "keypress",
    targetThread
  );
  return 0;
}
function _emscripten_set_keyup_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerKeyEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    3,
    "keyup",
    targetThread
  );
  return 0;
}
function _emscripten_set_main_loop_arg(func, arg, fps, simulateInfiniteLoop) {
  var browserIterationFunc = function () {
    (function (a1) {
      dynCall_vi.apply(null, [func, a1]);
    })(arg);
  };
  setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg);
}
function fillMouseEventData(eventStruct, e, target) {
  var idx = eventStruct >> 2;
  HEAP32[idx + 0] = e.screenX;
  HEAP32[idx + 1] = e.screenY;
  HEAP32[idx + 2] = e.clientX;
  HEAP32[idx + 3] = e.clientY;
  HEAP32[idx + 4] = e.ctrlKey;
  HEAP32[idx + 5] = e.shiftKey;
  HEAP32[idx + 6] = e.altKey;
  HEAP32[idx + 7] = e.metaKey;
  HEAP16[idx * 2 + 16] = e.button;
  HEAP16[idx * 2 + 17] = e.buttons;
  HEAP32[idx + 9] = e["movementX"];
  HEAP32[idx + 10] = e["movementY"];
  var rect = getBoundingClientRect(target);
  HEAP32[idx + 11] = e.clientX - rect.left;
  HEAP32[idx + 12] = e.clientY - rect.top;
}
function registerMouseEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(64);
  target = findEventTarget(target);
  var mouseEventHandlerFunc = function (ev) {
    var e = ev || event;
    fillMouseEventData(JSEvents.mouseEvent, e, target);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, JSEvents.mouseEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    allowsDeferredCalls:
      eventTypeString != "mousemove" &&
      eventTypeString != "mouseenter" &&
      eventTypeString != "mouseleave",
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: mouseEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_mousedown_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    5,
    "mousedown",
    targetThread
  );
  return 0;
}
function _emscripten_set_mouseenter_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    33,
    "mouseenter",
    targetThread
  );
  return 0;
}
function _emscripten_set_mouseleave_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    34,
    "mouseleave",
    targetThread
  );
  return 0;
}
function _emscripten_set_mousemove_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    8,
    "mousemove",
    targetThread
  );
  return 0;
}
function _emscripten_set_mouseup_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    6,
    "mouseup",
    targetThread
  );
  return 0;
}
function fillPointerlockChangeEventData(eventStruct) {
  var pointerLockElement =
    document.pointerLockElement ||
    document.mozPointerLockElement ||
    document.webkitPointerLockElement ||
    document.msPointerLockElement;
  var isPointerlocked = !!pointerLockElement;
  HEAP32[eventStruct >> 2] = isPointerlocked;
  var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
  var id =
    pointerLockElement && pointerLockElement.id ? pointerLockElement.id : "";
  stringToUTF8(nodeName, eventStruct + 4, 128);
  stringToUTF8(id, eventStruct + 132, 128);
}
function registerPointerlockChangeEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.pointerlockChangeEvent)
    JSEvents.pointerlockChangeEvent = _malloc(260);
  var pointerlockChangeEventHandlerFunc = function (ev) {
    var e = ev || event;
    var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
    fillPointerlockChangeEventData(pointerlockChangeEvent);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, pointerlockChangeEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: pointerlockChangeEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_pointerlockchange_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  if (
    !document ||
    !document.body ||
    (!document.body.requestPointerLock &&
      !document.body.mozRequestPointerLock &&
      !document.body.webkitRequestPointerLock &&
      !document.body.msRequestPointerLock)
  ) {
    return -1;
  }
  target = findEventTarget(target);
  if (!target) return -4;
  registerPointerlockChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    20,
    "pointerlockchange",
    targetThread
  );
  registerPointerlockChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    20,
    "mozpointerlockchange",
    targetThread
  );
  registerPointerlockChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    20,
    "webkitpointerlockchange",
    targetThread
  );
  registerPointerlockChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    20,
    "mspointerlockchange",
    targetThread
  );
  return 0;
}
function registerUiEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36);
  target = findEventTarget(target);
  var uiEventHandlerFunc = function (ev) {
    var e = ev || event;
    if (e.target != target) {
      return;
    }
    var b = document.body;
    if (!b) {
      return;
    }
    var uiEvent = JSEvents.uiEvent;
    HEAP32[uiEvent >> 2] = e.detail;
    HEAP32[(uiEvent + 4) >> 2] = b.clientWidth;
    HEAP32[(uiEvent + 8) >> 2] = b.clientHeight;
    HEAP32[(uiEvent + 12) >> 2] = innerWidth;
    HEAP32[(uiEvent + 16) >> 2] = innerHeight;
    HEAP32[(uiEvent + 20) >> 2] = outerWidth;
    HEAP32[(uiEvent + 24) >> 2] = outerHeight;
    HEAP32[(uiEvent + 28) >> 2] = pageXOffset;
    HEAP32[(uiEvent + 32) >> 2] = pageYOffset;
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, uiEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: uiEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_resize_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerUiEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    10,
    "resize",
    targetThread
  );
  return 0;
}
function registerTouchEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1684);
  target = findEventTarget(target);
  var touchEventHandlerFunc = function (e) {
    var touches = {};
    var et = e.touches;
    for (var i = 0; i < et.length; ++i) {
      var touch = et[i];
      touches[touch.identifier] = touch;
    }
    et = e.changedTouches;
    for (var i = 0; i < et.length; ++i) {
      var touch = et[i];
      touch.isChanged = 1;
      touches[touch.identifier] = touch;
    }
    et = e.targetTouches;
    for (var i = 0; i < et.length; ++i) {
      touches[et[i].identifier].onTarget = 1;
    }
    var touchEvent = JSEvents.touchEvent;
    var idx = touchEvent >> 2;
    HEAP32[idx + 1] = e.ctrlKey;
    HEAP32[idx + 2] = e.shiftKey;
    HEAP32[idx + 3] = e.altKey;
    HEAP32[idx + 4] = e.metaKey;
    idx += 5;
    var targetRect = getBoundingClientRect(target);
    var numTouches = 0;
    for (var i in touches) {
      var t = touches[i];
      HEAP32[idx + 0] = t.identifier;
      HEAP32[idx + 1] = t.screenX;
      HEAP32[idx + 2] = t.screenY;
      HEAP32[idx + 3] = t.clientX;
      HEAP32[idx + 4] = t.clientY;
      HEAP32[idx + 5] = t.pageX;
      HEAP32[idx + 6] = t.pageY;
      HEAP32[idx + 7] = t.isChanged;
      HEAP32[idx + 8] = t.onTarget;
      HEAP32[idx + 9] = t.clientX - targetRect.left;
      HEAP32[idx + 10] = t.clientY - targetRect.top;
      idx += 13;
      if (++numTouches > 31) {
        break;
      }
    }
    HEAP32[touchEvent >> 2] = numTouches;
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, touchEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    allowsDeferredCalls:
      eventTypeString == "touchstart" || eventTypeString == "touchend",
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: touchEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_touchcancel_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    25,
    "touchcancel",
    targetThread
  );
  return 0;
}
function _emscripten_set_touchend_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    23,
    "touchend",
    targetThread
  );
  return 0;
}
function _emscripten_set_touchmove_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    24,
    "touchmove",
    targetThread
  );
  return 0;
}
function _emscripten_set_touchstart_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    22,
    "touchstart",
    targetThread
  );
  return 0;
}
function fillVisibilityChangeEventData(eventStruct) {
  var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
  var visibilityState = visibilityStates.indexOf(document.visibilityState);
  HEAP32[eventStruct >> 2] = document.hidden;
  HEAP32[(eventStruct + 4) >> 2] = visibilityState;
}
function registerVisibilityChangeEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.visibilityChangeEvent)
    JSEvents.visibilityChangeEvent = _malloc(8);
  var visibilityChangeEventHandlerFunc = function (ev) {
    var e = ev || event;
    var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
    fillVisibilityChangeEventData(visibilityChangeEvent);
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, visibilityChangeEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: visibilityChangeEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_visibilitychange_callback_on_thread(
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  registerVisibilityChangeEventCallback(
    specialHTMLTargets[1],
    userData,
    useCapture,
    callbackfunc,
    21,
    "visibilitychange",
    targetThread
  );
  return 0;
}
function registerWheelEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(96);
  var wheelHandlerFunc = function (ev) {
    var e = ev || event;
    var wheelEvent = JSEvents.wheelEvent;
    fillMouseEventData(wheelEvent, e, target);
    HEAPF64[(wheelEvent + 64) >> 3] = e["deltaX"];
    HEAPF64[(wheelEvent + 72) >> 3] = e["deltaY"];
    HEAPF64[(wheelEvent + 80) >> 3] = e["deltaZ"];
    HEAP32[(wheelEvent + 88) >> 2] = e["deltaMode"];
    if (
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
      })(eventTypeId, wheelEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    allowsDeferredCalls: true,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: wheelHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_wheel_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  target = findEventTarget(target);
  if (typeof target.onwheel !== "undefined") {
    registerWheelEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      9,
      "wheel",
      targetThread
    );
    return 0;
  } else {
    return -1;
  }
}
function _emscripten_sleep(ms) {
  Asyncify.handleSleep(function (wakeUp) {
    Browser.safeSetTimeout(wakeUp, ms);
  });
}
function _emscripten_thread_sleep(msecs) {
  var start = _emscripten_get_now();
  while (_emscripten_get_now() - start < msecs) {}
}
function _emscripten_wget(url, file) {
  Asyncify.handleSleep(function (wakeUp) {
    var _url = UTF8ToString(url);
    var _file = UTF8ToString(file);
    _file = PATH_FS.resolve(FS.cwd(), _file);
    var destinationDirectory = PATH.dirname(_file);
    FS.createPreloadedFile(
      destinationDirectory,
      PATH.basename(_file),
      _url,
      true,
      true,
      wakeUp,
      wakeUp,
      undefined,
      undefined,
      function () {
        FS.mkdirTree(destinationDirectory);
      }
    );
  });
}
function _emscripten_wget_data(url, pbuffer, pnum, perror) {
  Asyncify.handleSleep(function (wakeUp) {
    Browser.asyncLoad(
      UTF8ToString(url),
      function (byteArray) {
        var buffer = _malloc(byteArray.length);
        HEAPU8.set(byteArray, buffer);
        HEAP32[pbuffer >> 2] = buffer;
        HEAP32[pnum >> 2] = byteArray.length;
        HEAP32[perror >> 2] = 0;
        wakeUp();
      },
      function () {
        HEAP32[perror >> 2] = 1;
        wakeUp();
      },
      true
    );
  });
}
function _endpwent() {
  throw "endpwent: TODO";
}
var ENV = {};
function getExecutableName() {
  return thisProgram || "./this.program";
}
function getEnvStrings() {
  if (!getEnvStrings.strings) {
    var lang =
      (
        (typeof navigator === "object" &&
          navigator.languages &&
          navigator.languages[0]) ||
        "C"
      ).replace("-", "_") + ".UTF-8";
    var env = {
      USER: "web_user",
      LOGNAME: "web_user",
      PATH: "/",
      PWD: "/",
      HOME: "/home/web_user",
      LANG: lang,
      _: getExecutableName(),
    };
    for (var x in ENV) {
      env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(x + "=" + env[x]);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
}
function _environ_get(__environ, environ_buf) {
  try {
    var bufSize = 0;
    getEnvStrings().forEach(function (string, i) {
      var ptr = environ_buf + bufSize;
      HEAP32[(__environ + i * 4) >> 2] = ptr;
      writeAsciiToMemory(string, ptr);
      bufSize += string.length + 1;
    });
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _environ_sizes_get(penviron_count, penviron_buf_size) {
  try {
    var strings = getEnvStrings();
    HEAP32[penviron_count >> 2] = strings.length;
    var bufSize = 0;
    strings.forEach(function (string) {
      bufSize += string.length + 1;
    });
    HEAP32[penviron_buf_size >> 2] = bufSize;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _execve(path, argv, envp) {
  setErrNo(45);
  return -1;
}
function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_fdstat_get(fd, pbuf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var type = stream.tty
      ? 2
      : FS.isDir(stream.mode)
      ? 3
      : FS.isLink(stream.mode)
      ? 7
      : 4;
    HEAP8[pbuf >> 0] = type;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_read(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doReadv(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var HIGH_OFFSET = 4294967296;
    var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
    var DOUBLE_LIMIT = 9007199254740992;
    if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
      return -61;
    }
    FS.llseek(stream, offset, whence);
    (tempI64 = [
      stream.position >>> 0,
      ((tempDouble = stream.position),
      +Math.abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0),
    ]),
      (HEAP32[newOffset >> 2] = tempI64[0]),
      (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_sync(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return Asyncify.handleSleep(function (wakeUp) {
      var mount = stream.node.mount;
      if (!mount.type.syncfs) {
        wakeUp(0);
        return;
      }
      mount.type.syncfs(mount, false, function (err) {
        if (err) {
          wakeUp(function () {
            return 29;
          });
          return;
        }
        wakeUp(0);
      });
    });
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_write(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doWritev(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fork() {
  setErrNo(6);
  return -1;
}
function _ftime(p) {
  var millis = Date.now();
  HEAP32[p >> 2] = (millis / 1e3) | 0;
  HEAP16[(p + 4) >> 1] = millis % 1e3;
  HEAP16[(p + 6) >> 1] = 0;
  HEAP16[(p + 8) >> 1] = 0;
  return 0;
}
var GAI_ERRNO_MESSAGES = {};
function _gai_strerror(val) {
  var buflen = 256;
  if (!_gai_strerror.buffer) {
    _gai_strerror.buffer = _malloc(buflen);
    GAI_ERRNO_MESSAGES["0"] = "Success";
    GAI_ERRNO_MESSAGES["" + -1] = "Invalid value for 'ai_flags' field";
    GAI_ERRNO_MESSAGES["" + -2] = "NAME or SERVICE is unknown";
    GAI_ERRNO_MESSAGES["" + -3] = "Temporary failure in name resolution";
    GAI_ERRNO_MESSAGES["" + -4] = "Non-recoverable failure in name res";
    GAI_ERRNO_MESSAGES["" + -6] = "'ai_family' not supported";
    GAI_ERRNO_MESSAGES["" + -7] = "'ai_socktype' not supported";
    GAI_ERRNO_MESSAGES["" + -8] = "SERVICE not supported for 'ai_socktype'";
    GAI_ERRNO_MESSAGES["" + -10] = "Memory allocation failure";
    GAI_ERRNO_MESSAGES["" + -11] = "System error returned in 'errno'";
    GAI_ERRNO_MESSAGES["" + -12] = "Argument buffer overflow";
  }
  var msg = "Unknown error";
  if (val in GAI_ERRNO_MESSAGES) {
    if (GAI_ERRNO_MESSAGES[val].length > buflen - 1) {
      msg = "Message too long";
    } else {
      msg = GAI_ERRNO_MESSAGES[val];
    }
  }
  writeAsciiToMemory(msg, _gai_strerror.buffer);
  return _gai_strerror.buffer;
}
function _getTempRet0() {
  return getTempRet0();
}
function _getaddrinfo(node, service, hint, out) {
  var addr = 0;
  var port = 0;
  var flags = 0;
  var family = 0;
  var type = 0;
  var proto = 0;
  var ai;
  function allocaddrinfo(family, type, proto, canon, addr, port) {
    var sa, salen, ai;
    var errno;
    salen = family === 10 ? 28 : 16;
    addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
    sa = _malloc(salen);
    errno = writeSockaddr(sa, family, addr, port);
    assert(!errno);
    ai = _malloc(32);
    HEAP32[(ai + 4) >> 2] = family;
    HEAP32[(ai + 8) >> 2] = type;
    HEAP32[(ai + 12) >> 2] = proto;
    HEAP32[(ai + 24) >> 2] = canon;
    HEAP32[(ai + 20) >> 2] = sa;
    if (family === 10) {
      HEAP32[(ai + 16) >> 2] = 28;
    } else {
      HEAP32[(ai + 16) >> 2] = 16;
    }
    HEAP32[(ai + 28) >> 2] = 0;
    return ai;
  }
  if (hint) {
    flags = HEAP32[hint >> 2];
    family = HEAP32[(hint + 4) >> 2];
    type = HEAP32[(hint + 8) >> 2];
    proto = HEAP32[(hint + 12) >> 2];
  }
  if (type && !proto) {
    proto = type === 2 ? 17 : 6;
  }
  if (!type && proto) {
    type = proto === 17 ? 2 : 1;
  }
  if (proto === 0) {
    proto = 6;
  }
  if (type === 0) {
    type = 1;
  }
  if (!node && !service) {
    return -2;
  }
  if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
    return -1;
  }
  if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) {
    return -1;
  }
  if (flags & 32) {
    return -2;
  }
  if (type !== 0 && type !== 1 && type !== 2) {
    return -7;
  }
  if (family !== 0 && family !== 2 && family !== 10) {
    return -6;
  }
  if (service) {
    service = UTF8ToString(service);
    port = parseInt(service, 10);
    if (isNaN(port)) {
      if (flags & 1024) {
        return -2;
      }
      return -8;
    }
  }
  if (!node) {
    if (family === 0) {
      family = 2;
    }
    if ((flags & 1) === 0) {
      if (family === 2) {
        addr = _htonl(2130706433);
      } else {
        addr = [0, 0, 0, 1];
      }
    }
    ai = allocaddrinfo(family, type, proto, null, addr, port);
    HEAP32[out >> 2] = ai;
    return 0;
  }
  node = UTF8ToString(node);
  addr = inetPton4(node);
  if (addr !== null) {
    if (family === 0 || family === 2) {
      family = 2;
    } else if (family === 10 && flags & 8) {
      addr = [0, 0, _htonl(65535), addr];
      family = 10;
    } else {
      return -2;
    }
  } else {
    addr = inetPton6(node);
    if (addr !== null) {
      if (family === 0 || family === 10) {
        family = 10;
      } else {
        return -2;
      }
    }
  }
  if (addr != null) {
    ai = allocaddrinfo(family, type, proto, node, addr, port);
    HEAP32[out >> 2] = ai;
    return 0;
  }
  if (flags & 4) {
    return -2;
  }
  node = DNS.lookup_name(node);
  addr = inetPton4(node);
  if (family === 0) {
    family = 2;
  } else if (family === 10) {
    addr = [0, 0, _htonl(65535), addr];
  }
  ai = allocaddrinfo(family, type, proto, null, addr, port);
  HEAP32[out >> 2] = ai;
  return 0;
}
function _getentropy(buffer, size) {
  if (!_getentropy.randomDevice) {
    _getentropy.randomDevice = getRandomDevice();
  }
  for (var i = 0; i < size; i++) {
    HEAP8[(buffer + i) >> 0] = _getentropy.randomDevice();
  }
  return 0;
}
function getHostByName(name) {
  var ret = _malloc(20);
  var nameBuf = _malloc(name.length + 1);
  stringToUTF8(name, nameBuf, name.length + 1);
  HEAP32[ret >> 2] = nameBuf;
  var aliasesBuf = _malloc(4);
  HEAP32[aliasesBuf >> 2] = 0;
  HEAP32[(ret + 4) >> 2] = aliasesBuf;
  var afinet = 2;
  HEAP32[(ret + 8) >> 2] = afinet;
  HEAP32[(ret + 12) >> 2] = 4;
  var addrListBuf = _malloc(12);
  HEAP32[addrListBuf >> 2] = addrListBuf + 8;
  HEAP32[(addrListBuf + 4) >> 2] = 0;
  HEAP32[(addrListBuf + 8) >> 2] = inetPton4(DNS.lookup_name(name));
  HEAP32[(ret + 16) >> 2] = addrListBuf;
  return ret;
}
function _gethostbyaddr(addr, addrlen, type) {
  if (type !== 2) {
    setErrNo(5);
    return null;
  }
  addr = HEAP32[addr >> 2];
  var host = inetNtop4(addr);
  var lookup = DNS.lookup_addr(host);
  if (lookup) {
    host = lookup;
  }
  return getHostByName(host);
}
function _gethostbyname(name) {
  return getHostByName(UTF8ToString(name));
}
function _getloadavg(loadavg, nelem) {
  var limit = Math.min(nelem, 3);
  var doubleSize = 8;
  for (var i = 0; i < limit; i++) {
    HEAPF64[(loadavg + i * doubleSize) >> 3] = 0.1;
  }
  return limit;
}
function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
  var info = readSockaddr(sa, salen);
  if (info.errno) {
    return -6;
  }
  var port = info.port;
  var addr = info.addr;
  var overflowed = false;
  if (node && nodelen) {
    var lookup;
    if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
      if (flags & 8) {
        return -2;
      }
    } else {
      addr = lookup;
    }
    var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
    if (numBytesWrittenExclNull + 1 >= nodelen) {
      overflowed = true;
    }
  }
  if (serv && servlen) {
    port = "" + port;
    var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
    if (numBytesWrittenExclNull + 1 >= servlen) {
      overflowed = true;
    }
  }
  if (overflowed) {
    return -12;
  }
  return 0;
}
var Protocols = { list: [], map: {} };
function _setprotoent(stayopen) {
  function allocprotoent(name, proto, aliases) {
    var nameBuf = _malloc(name.length + 1);
    writeAsciiToMemory(name, nameBuf);
    var j = 0;
    var length = aliases.length;
    var aliasListBuf = _malloc((length + 1) * 4);
    for (var i = 0; i < length; i++, j += 4) {
      var alias = aliases[i];
      var aliasBuf = _malloc(alias.length + 1);
      writeAsciiToMemory(alias, aliasBuf);
      HEAP32[(aliasListBuf + j) >> 2] = aliasBuf;
    }
    HEAP32[(aliasListBuf + j) >> 2] = 0;
    var pe = _malloc(12);
    HEAP32[pe >> 2] = nameBuf;
    HEAP32[(pe + 4) >> 2] = aliasListBuf;
    HEAP32[(pe + 8) >> 2] = proto;
    return pe;
  }
  var list = Protocols.list;
  var map = Protocols.map;
  if (list.length === 0) {
    var entry = allocprotoent("tcp", 6, ["TCP"]);
    list.push(entry);
    map["tcp"] = map["6"] = entry;
    entry = allocprotoent("udp", 17, ["UDP"]);
    list.push(entry);
    map["udp"] = map["17"] = entry;
  }
  _setprotoent.index = 0;
}
function _getprotobyname(name) {
  name = UTF8ToString(name);
  _setprotoent(true);
  var result = Protocols.map[name];
  return result;
}
function _getpwent() {
  throw "getpwent: TODO";
}
function _getpwnam() {
  throw "getpwnam: TODO";
}
function _getpwuid() {
  throw "getpwuid: TODO";
}
function _gettimeofday(ptr) {
  var now = Date.now();
  HEAP32[ptr >> 2] = (now / 1e3) | 0;
  HEAP32[(ptr + 4) >> 2] = ((now % 1e3) * 1e3) | 0;
  return 0;
}
function _kill(pid, sig) {
  setErrNo(ERRNO_CODES.EPERM);
  return -1;
}
function _killpg() {
  setErrNo(ERRNO_CODES.EPERM);
  return -1;
}
function _mktime(tmPtr) {
  _tzset();
  var date = new Date(
    HEAP32[(tmPtr + 20) >> 2] + 1900,
    HEAP32[(tmPtr + 16) >> 2],
    HEAP32[(tmPtr + 12) >> 2],
    HEAP32[(tmPtr + 8) >> 2],
    HEAP32[(tmPtr + 4) >> 2],
    HEAP32[tmPtr >> 2],
    0
  );
  var dst = HEAP32[(tmPtr + 32) >> 2];
  var guessedOffset = date.getTimezoneOffset();
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dstOffset = Math.min(winterOffset, summerOffset);
  if (dst < 0) {
    HEAP32[(tmPtr + 32) >> 2] = Number(
      summerOffset != winterOffset && dstOffset == guessedOffset
    );
  } else if (dst > 0 != (dstOffset == guessedOffset)) {
    var nonDstOffset = Math.max(winterOffset, summerOffset);
    var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
    date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
  }
  HEAP32[(tmPtr + 24) >> 2] = date.getDay();
  var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[tmPtr >> 2] = date.getSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
  return (date.getTime() / 1e3) | 0;
}
function _pthread_sigmask(how, set, oldset) {
  err("pthread_sigmask() is not supported: this is a no-op.");
  return 0;
}
function _setTempRet0(val) {
  setTempRet0(val);
}
function _setgroups(ngroups, gidset) {
  if (ngroups < 1 || ngroups > _sysconf(3)) {
    setErrNo(28);
    return -1;
  } else {
    setErrNo(63);
    return -1;
  }
}
function _setpwent() {
  throw "setpwent: TODO";
}
function _sigaction(signum, act, oldact) {
  return 0;
}
function _sigemptyset(set) {
  HEAP32[set >> 2] = 0;
  return 0;
}
function _sigfillset(set) {
  HEAP32[set >> 2] = -1 >>> 0;
  return 0;
}
var __sigalrm_handler = 0;
function _signal(sig, func) {
  if (sig == 14) {
    __sigalrm_handler = func;
  } else {
  }
  return 0;
}
function __isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function __arraySum(array, index) {
  var sum = 0;
  for (var i = 0; i <= index; sum += array[i++]) {}
  return sum;
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(date, days) {
  var newDate = new Date(date.getTime());
  while (days > 0) {
    var leap = __isLeapYear(newDate.getFullYear());
    var currentMonth = newDate.getMonth();
    var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[
      currentMonth
    ];
    if (days > daysInCurrentMonth - newDate.getDate()) {
      days -= daysInCurrentMonth - newDate.getDate() + 1;
      newDate.setDate(1);
      if (currentMonth < 11) {
        newDate.setMonth(currentMonth + 1);
      } else {
        newDate.setMonth(0);
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
    } else {
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
  }
  return newDate;
}
function _strftime(s, maxsize, format, tm) {
  var tm_zone = HEAP32[(tm + 40) >> 2];
  var date = {
    tm_sec: HEAP32[tm >> 2],
    tm_min: HEAP32[(tm + 4) >> 2],
    tm_hour: HEAP32[(tm + 8) >> 2],
    tm_mday: HEAP32[(tm + 12) >> 2],
    tm_mon: HEAP32[(tm + 16) >> 2],
    tm_year: HEAP32[(tm + 20) >> 2],
    tm_wday: HEAP32[(tm + 24) >> 2],
    tm_yday: HEAP32[(tm + 28) >> 2],
    tm_isdst: HEAP32[(tm + 32) >> 2],
    tm_gmtoff: HEAP32[(tm + 36) >> 2],
    tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
  };
  var pattern = UTF8ToString(format);
  var EXPANSION_RULES_1 = {
    "%c": "%a %b %d %H:%M:%S %Y",
    "%D": "%m/%d/%y",
    "%F": "%Y-%m-%d",
    "%h": "%b",
    "%r": "%I:%M:%S %p",
    "%R": "%H:%M",
    "%T": "%H:%M:%S",
    "%x": "%m/%d/%y",
    "%X": "%H:%M:%S",
    "%Ec": "%c",
    "%EC": "%C",
    "%Ex": "%m/%d/%y",
    "%EX": "%H:%M:%S",
    "%Ey": "%y",
    "%EY": "%Y",
    "%Od": "%d",
    "%Oe": "%e",
    "%OH": "%H",
    "%OI": "%I",
    "%Om": "%m",
    "%OM": "%M",
    "%OS": "%S",
    "%Ou": "%u",
    "%OU": "%U",
    "%OV": "%V",
    "%Ow": "%w",
    "%OW": "%W",
    "%Oy": "%y",
  };
  for (var rule in EXPANSION_RULES_1) {
    pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
  }
  var WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function leadingSomething(value, digits, character) {
    var str = typeof value === "number" ? value.toString() : value || "";
    while (str.length < digits) {
      str = character[0] + str;
    }
    return str;
  }
  function leadingNulls(value, digits) {
    return leadingSomething(value, digits, "0");
  }
  function compareByDay(date1, date2) {
    function sgn(value) {
      return value < 0 ? -1 : value > 0 ? 1 : 0;
    }
    var compare;
    if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
      if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
        compare = sgn(date1.getDate() - date2.getDate());
      }
    }
    return compare;
  }
  function getFirstWeekStartDate(janFourth) {
    switch (janFourth.getDay()) {
      case 0:
        return new Date(janFourth.getFullYear() - 1, 11, 29);
      case 1:
        return janFourth;
      case 2:
        return new Date(janFourth.getFullYear(), 0, 3);
      case 3:
        return new Date(janFourth.getFullYear(), 0, 2);
      case 4:
        return new Date(janFourth.getFullYear(), 0, 1);
      case 5:
        return new Date(janFourth.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(janFourth.getFullYear() - 1, 11, 30);
    }
  }
  function getWeekBasedYear(date) {
    var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
    var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
    var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
    var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
    var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
    if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
      if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
        return thisDate.getFullYear() + 1;
      } else {
        return thisDate.getFullYear();
      }
    } else {
      return thisDate.getFullYear() - 1;
    }
  }
  var EXPANSION_RULES_2 = {
    "%a": function (date) {
      return WEEKDAYS[date.tm_wday].substring(0, 3);
    },
    "%A": function (date) {
      return WEEKDAYS[date.tm_wday];
    },
    "%b": function (date) {
      return MONTHS[date.tm_mon].substring(0, 3);
    },
    "%B": function (date) {
      return MONTHS[date.tm_mon];
    },
    "%C": function (date) {
      var year = date.tm_year + 1900;
      return leadingNulls((year / 100) | 0, 2);
    },
    "%d": function (date) {
      return leadingNulls(date.tm_mday, 2);
    },
    "%e": function (date) {
      return leadingSomething(date.tm_mday, 2, " ");
    },
    "%g": function (date) {
      return getWeekBasedYear(date).toString().substring(2);
    },
    "%G": function (date) {
      return getWeekBasedYear(date);
    },
    "%H": function (date) {
      return leadingNulls(date.tm_hour, 2);
    },
    "%I": function (date) {
      var twelveHour = date.tm_hour;
      if (twelveHour == 0) twelveHour = 12;
      else if (twelveHour > 12) twelveHour -= 12;
      return leadingNulls(twelveHour, 2);
    },
    "%j": function (date) {
      return leadingNulls(
        date.tm_mday +
          __arraySum(
            __isLeapYear(date.tm_year + 1900)
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            date.tm_mon - 1
          ),
        3
      );
    },
    "%m": function (date) {
      return leadingNulls(date.tm_mon + 1, 2);
    },
    "%M": function (date) {
      return leadingNulls(date.tm_min, 2);
    },
    "%n": function () {
      return "\n";
    },
    "%p": function (date) {
      if (date.tm_hour >= 0 && date.tm_hour < 12) {
        return "AM";
      } else {
        return "PM";
      }
    },
    "%S": function (date) {
      return leadingNulls(date.tm_sec, 2);
    },
    "%t": function () {
      return "\t";
    },
    "%u": function (date) {
      return date.tm_wday || 7;
    },
    "%U": function (date) {
      var janFirst = new Date(date.tm_year + 1900, 0, 1);
      var firstSunday =
        janFirst.getDay() === 0
          ? janFirst
          : __addDays(janFirst, 7 - janFirst.getDay());
      var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
      if (compareByDay(firstSunday, endDate) < 0) {
        var februaryFirstUntilEndMonth =
          __arraySum(
            __isLeapYear(endDate.getFullYear())
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            endDate.getMonth() - 1
          ) - 31;
        var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
        var days =
          firstSundayUntilEndJanuary +
          februaryFirstUntilEndMonth +
          endDate.getDate();
        return leadingNulls(Math.ceil(days / 7), 2);
      }
      return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
    },
    "%V": function (date) {
      var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
      var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
      var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
      var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
      var endDate = __addDays(
        new Date(date.tm_year + 1900, 0, 1),
        date.tm_yday
      );
      if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
        return "53";
      }
      if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
        return "01";
      }
      var daysDifference;
      if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
        daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
      } else {
        daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
      }
      return leadingNulls(Math.ceil(daysDifference / 7), 2);
    },
    "%w": function (date) {
      return date.tm_wday;
    },
    "%W": function (date) {
      var janFirst = new Date(date.tm_year, 0, 1);
      var firstMonday =
        janFirst.getDay() === 1
          ? janFirst
          : __addDays(
              janFirst,
              janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1
            );
      var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
      if (compareByDay(firstMonday, endDate) < 0) {
        var februaryFirstUntilEndMonth =
          __arraySum(
            __isLeapYear(endDate.getFullYear())
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            endDate.getMonth() - 1
          ) - 31;
        var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
        var days =
          firstMondayUntilEndJanuary +
          februaryFirstUntilEndMonth +
          endDate.getDate();
        return leadingNulls(Math.ceil(days / 7), 2);
      }
      return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
    },
    "%y": function (date) {
      return (date.tm_year + 1900).toString().substring(2);
    },
    "%Y": function (date) {
      return date.tm_year + 1900;
    },
    "%z": function (date) {
      var off = date.tm_gmtoff;
      var ahead = off >= 0;
      off = Math.abs(off) / 60;
      off = (off / 60) * 100 + (off % 60);
      return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
    },
    "%Z": function (date) {
      return date.tm_zone;
    },
    "%%": function () {
      return "%";
    },
  };
  for (var rule in EXPANSION_RULES_2) {
    if (pattern.includes(rule)) {
      pattern = pattern.replace(
        new RegExp(rule, "g"),
        EXPANSION_RULES_2[rule](date)
      );
    }
  }
  var bytes = intArrayFromString(pattern, false);
  if (bytes.length > maxsize) {
    return 0;
  }
  writeArrayToMemory(bytes, s);
  return bytes.length - 1;
}
function _system(command) {
  if (!command) return 0;
  setErrNo(6);
  return -1;
}
function _time(ptr) {
  var ret = (Date.now() / 1e3) | 0;
  if (ptr) {
    HEAP32[ptr >> 2] = ret;
  }
  return ret;
}
function _times(buffer) {
  if (buffer !== 0) {
    _memset(buffer, 0, 16);
  }
  return 0;
}
function setFileTime(path, time) {
  path = UTF8ToString(path);
  try {
    FS.utime(path, time, time);
    return 0;
  } catch (e) {
    if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
    setErrNo(e.errno);
    return -1;
  }
}
function _utime(path, times) {
  var time;
  if (times) {
    time = HEAP32[(times + 4) >> 2] * 1e3;
  } else {
    time = Date.now();
  }
  return setFileTime(path, time);
}
function _utimes(path, times) {
  var time;
  if (times) {
    var mtime = times + 8;
    time = HEAP32[mtime >> 2] * 1e3;
    time += HEAP32[(mtime + 4) >> 2] / 1e3;
  } else {
    time = Date.now();
  }
  return setFileTime(path, time);
}
function _wait(stat_loc) {
  setErrNo(12);
  return -1;
}
function _wait3(a0) {
  return _wait(a0);
}
function _wait4(a0) {
  return _wait(a0);
}
function runAndAbortIfError(func) {
  try {
    return func();
  } catch (e) {
    abort(e);
  }
}
var Asyncify = {
  State: { Normal: 0, Unwinding: 1, Rewinding: 2 },
  state: 0,
  StackSize: 65535,
  currData: null,
  handleSleepReturnValue: 0,
  exportCallStack: [],
  callStackNameToId: {},
  callStackIdToName: {},
  callStackId: 0,
  afterUnwind: null,
  asyncFinalizers: [],
  sleepCallbacks: [],
  getCallStackId: function (funcName) {
    var id = Asyncify.callStackNameToId[funcName];
    if (id === undefined) {
      id = Asyncify.callStackId++;
      Asyncify.callStackNameToId[funcName] = id;
      Asyncify.callStackIdToName[id] = funcName;
    }
    return id;
  },
  instrumentWasmExports: function (exports) {
    var ret = {};
    for (var x in exports) {
      (function (x) {
        var original = exports[x];
        if (typeof original === "function") {
          ret[x] = function () {
            Asyncify.exportCallStack.push(x);
            try {
              return original.apply(null, arguments);
            } finally {
              if (ABORT) return;
              var y = Asyncify.exportCallStack.pop();
              assert(y === x);
              Asyncify.maybeStopUnwind();
            }
          };
        } else {
          ret[x] = original;
        }
      })(x);
    }
    return ret;
  },
  maybeStopUnwind: function () {
    if (
      Asyncify.currData &&
      Asyncify.state === Asyncify.State.Unwinding &&
      Asyncify.exportCallStack.length === 0
    ) {
      Asyncify.state = Asyncify.State.Normal;
      runAndAbortIfError(Module["_asyncify_stop_unwind"]);
      if (typeof Fibers !== "undefined") {
        Fibers.trampoline();
      }
      if (Asyncify.afterUnwind) {
        Asyncify.afterUnwind();
        Asyncify.afterUnwind = null;
      }
    }
  },
  allocateData: function () {
    var ptr = _malloc(12 + Asyncify.StackSize);
    Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
    Asyncify.setDataRewindFunc(ptr);
    return ptr;
  },
  setDataHeader: function (ptr, stack, stackSize) {
    HEAP32[ptr >> 2] = stack;
    HEAP32[(ptr + 4) >> 2] = stack + stackSize;
  },
  setDataRewindFunc: function (ptr) {
    var bottomOfCallStack = Asyncify.exportCallStack[0];
    var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
    HEAP32[(ptr + 8) >> 2] = rewindId;
  },
  getDataRewindFunc: function (ptr) {
    var id = HEAP32[(ptr + 8) >> 2];
    var name = Asyncify.callStackIdToName[id];
    var func = Module["asm"][name];
    return func;
  },
  handleSleep: function (startAsync) {
    if (ABORT) return;
    noExitRuntime = true;
    if (Asyncify.state === Asyncify.State.Normal) {
      var reachedCallback = false;
      var reachedAfterCallback = false;
      startAsync(function (handleSleepReturnValue) {
        if (ABORT) return;
        Asyncify.handleSleepReturnValue = handleSleepReturnValue || 0;
        reachedCallback = true;
        if (!reachedAfterCallback) {
          return;
        }
        Asyncify.state = Asyncify.State.Rewinding;
        runAndAbortIfError(function () {
          Module["_asyncify_start_rewind"](Asyncify.currData);
        });
        if (typeof Browser !== "undefined" && Browser.mainLoop.func) {
          Browser.mainLoop.resume();
        }
        var start = Asyncify.getDataRewindFunc(Asyncify.currData);
        var asyncWasmReturnValue = start();
        if (!Asyncify.currData) {
          var asyncFinalizers = Asyncify.asyncFinalizers;
          Asyncify.asyncFinalizers = [];
          asyncFinalizers.forEach(function (func) {
            func(asyncWasmReturnValue);
          });
        }
      });
      reachedAfterCallback = true;
      if (!reachedCallback) {
        Asyncify.state = Asyncify.State.Unwinding;
        Asyncify.currData = Asyncify.allocateData();
        runAndAbortIfError(function () {
          Module["_asyncify_start_unwind"](Asyncify.currData);
        });
        if (typeof Browser !== "undefined" && Browser.mainLoop.func) {
          Browser.mainLoop.pause();
        }
      }
    } else if (Asyncify.state === Asyncify.State.Rewinding) {
      Asyncify.state = Asyncify.State.Normal;
      runAndAbortIfError(Module["_asyncify_stop_rewind"]);
      _free(Asyncify.currData);
      Asyncify.currData = null;
      Asyncify.sleepCallbacks.forEach(function (func) {
        func();
      });
    } else {
      abort("invalid state: " + Asyncify.state);
    }
    return Asyncify.handleSleepReturnValue;
  },
  handleAsync: function (startAsync) {
    return Asyncify.handleSleep(function (wakeUp) {
      startAsync().then(wakeUp);
    });
  },
};
var FSNode = function (parent, name, mode, rdev) {
  if (!parent) {
    parent = this;
  }
  this.parent = parent;
  this.mount = parent.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = name;
  this.mode = mode;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = rdev;
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
  read: {
    get: function () {
      return (this.mode & readMode) === readMode;
    },
    set: function (val) {
      val ? (this.mode |= readMode) : (this.mode &= ~readMode);
    },
  },
  write: {
    get: function () {
      return (this.mode & writeMode) === writeMode;
    },
    set: function (val) {
      val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
    },
  },
  isFolder: {
    get: function () {
      return FS.isDir(this.mode);
    },
  },
  isDevice: {
    get: function () {
      return FS.isChrdev(this.mode);
    },
  },
});
FS.FSNode = FSNode;
FS.staticInit();
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["requestFullscreen"] = function Module_requestFullscreen(
  lockPointer,
  resizeCanvas
) {
  Browser.requestFullscreen(lockPointer, resizeCanvas);
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
  Browser.requestAnimationFrame(func);
};
Module["setCanvasSize"] = function Module_setCanvasSize(
  width,
  height,
  noUpdates
) {
  Browser.setCanvasSize(width, height, noUpdates);
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
  Browser.mainLoop.pause();
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
  Browser.mainLoop.resume();
};
Module["getUserMedia"] = function Module_getUserMedia() {
  Browser.getUserMedia();
};
Module["createContext"] = function Module_createContext(
  canvas,
  useWebGL,
  setInModule,
  webGLContextAttributes
) {
  return Browser.createContext(
    canvas,
    useWebGL,
    setInModule,
    webGLContextAttributes
  );
};
var GLctx;
for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
for (var i = 0; i < 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(
    0,
    i + 1
  );
}
var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
for (var i = 0; i < 288; ++i) {
  __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(
    0,
    i + 1
  );
}
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
var asmLibraryArg = {
  t: ___assert_fail,
  ai: ___clock_gettime,
  $h: ___gmtime_r,
  _h: ___localtime_r,
  Vh: ___sys__newselect,
  th: ___sys_accept4,
  zh: ___sys_access,
  wh: ___sys_bind,
  Ma: ___sys_chdir,
  Ka: ___sys_chmod,
  Ia: ___sys_chown32,
  vh: ___sys_connect,
  jh: ___sys_dup,
  fh: ___sys_dup2,
  Xh: ___sys_fchdir,
  ah: ___sys_fchmod,
  Ah: ___sys_fchmodat,
  Hh: ___sys_fchown32,
  i: ___sys_fcntl64,
  Th: ___sys_fdatasync,
  Ph: ___sys_fstat64,
  Ha: ___sys_fstatat64,
  Ch: ___sys_fstatfs64,
  Qh: ___sys_ftruncate64,
  Rh: ___sys_getcwd,
  Eh: ___sys_getdents64,
  Jh: ___sys_getegid32,
  Kh: ___sys_geteuid32,
  Lh: ___sys_getgid32,
  Ih: ___sys_getgroups32,
  ph: ___sys_getpeername,
  La: ___sys_getpgid,
  Mh: ___sys_getpid,
  eh: ___sys_getppid,
  Fh: ___sys_getresgid32,
  Gh: ___sys_getresuid32,
  Uh: ___sys_getsid,
  qh: ___sys_getsockname,
  sh: ___sys_getsockopt,
  Nh: ___sys_getuid32,
  Da: ___sys_ioctl,
  Oh: ___sys_lchown32,
  bh: ___sys_link,
  uh: ___sys_listen,
  M: ___sys_lstat64,
  kh: ___sys_mkdir,
  Wh: ___sys_mknod,
  xh: ___sys_nice,
  y: ___sys_open,
  Bh: ___sys_openat,
  ih: ___sys_pipe,
  yh: ___sys_pipe2,
  Sh: ___sys_poll,
  ch: ___sys_readlink,
  nh: ___sys_recvfrom,
  lh: ___sys_rename,
  Ea: ___sys_rmdir,
  oh: ___sys_sendto,
  hh: ___sys_setpgid,
  Ca: ___sys_setsid,
  rh: ___sys_setsockopt,
  mh: ___sys_shutdown,
  Ga: ___sys_socket,
  Fa: ___sys_socketpair,
  Ja: ___sys_stat64,
  Dh: ___sys_statfs64,
  dh: ___sys_symlink,
  gh: ___sys_umask,
  Yh: ___sys_uname,
  N: ___sys_unlink,
  Zh: ___sys_wait4,
  za: __exit,
  c: _abort,
  Yg: _chroot,
  F: _clock,
  E: _clock_gettime,
  Xg: _dlclose,
  Wg: _dlerror,
  Vg: _dlopen,
  ya: _dlsym,
  Ug: _eglBindAPI,
  Tg: _eglChooseConfig,
  Sg: _eglCreateContext,
  Rg: _eglCreateWindowSurface,
  Qg: _eglDestroyContext,
  Pg: _eglDestroySurface,
  Og: _eglGetConfigAttrib,
  xa: _eglGetDisplay,
  Ng: _eglGetError,
  Mg: _eglInitialize,
  Lg: _eglMakeCurrent,
  Kg: _eglQueryString,
  Jg: _eglSwapBuffers,
  Ig: _eglSwapInterval,
  Hg: _eglTerminate,
  Gg: _eglWaitGL,
  Fg: _eglWaitNative,
  e: _emscripten_asm_const_int,
  Eg: _emscripten_async_call,
  Dg: _emscripten_async_wget_data,
  Cg: _emscripten_cancel_main_loop,
  Bg: _emscripten_debugger,
  Ag: _emscripten_exit_fullscreen,
  zg: _emscripten_exit_pointerlock,
  yg: _emscripten_exit_with_live_runtime,
  xg: _emscripten_get_battery_status,
  wa: _emscripten_get_callstack,
  wg: _emscripten_get_compiler_setting,
  D: _emscripten_get_device_pixel_ratio,
  s: _emscripten_get_element_css_size,
  va: _emscripten_get_gamepad_status,
  vg: _emscripten_get_heap_max,
  ug: _emscripten_get_num_gamepads,
  tg: _emscripten_get_preloaded_image_data_from_FILE,
  sg: _emscripten_glActiveTexture,
  rg: _emscripten_glAttachShader,
  qg: _emscripten_glBeginQuery,
  pg: _emscripten_glBeginQueryEXT,
  og: _emscripten_glBeginTransformFeedback,
  ng: _emscripten_glBindAttribLocation,
  mg: _emscripten_glBindBuffer,
  lg: _emscripten_glBindBufferBase,
  kg: _emscripten_glBindBufferRange,
  jg: _emscripten_glBindFramebuffer,
  ig: _emscripten_glBindRenderbuffer,
  hg: _emscripten_glBindSampler,
  gg: _emscripten_glBindTexture,
  fg: _emscripten_glBindTransformFeedback,
  eg: _emscripten_glBindVertexArray,
  dg: _emscripten_glBindVertexArrayOES,
  cg: _emscripten_glBlendColor,
  bg: _emscripten_glBlendEquation,
  ag: _emscripten_glBlendEquationSeparate,
  $f: _emscripten_glBlendFunc,
  _f: _emscripten_glBlendFuncSeparate,
  Zf: _emscripten_glBlitFramebuffer,
  Yf: _emscripten_glBufferData,
  Xf: _emscripten_glBufferSubData,
  Wf: _emscripten_glCheckFramebufferStatus,
  Vf: _emscripten_glClear,
  Uf: _emscripten_glClearBufferfi,
  Tf: _emscripten_glClearBufferfv,
  Sf: _emscripten_glClearBufferiv,
  Rf: _emscripten_glClearBufferuiv,
  Qf: _emscripten_glClearColor,
  Pf: _emscripten_glClearDepthf,
  Of: _emscripten_glClearStencil,
  Nf: _emscripten_glClientWaitSync,
  Mf: _emscripten_glColorMask,
  Lf: _emscripten_glCompileShader,
  Kf: _emscripten_glCompressedTexImage2D,
  Jf: _emscripten_glCompressedTexImage3D,
  If: _emscripten_glCompressedTexSubImage2D,
  Hf: _emscripten_glCompressedTexSubImage3D,
  Gf: _emscripten_glCopyBufferSubData,
  Ff: _emscripten_glCopyTexImage2D,
  Ef: _emscripten_glCopyTexSubImage2D,
  Df: _emscripten_glCopyTexSubImage3D,
  Cf: _emscripten_glCreateProgram,
  Bf: _emscripten_glCreateShader,
  Af: _emscripten_glCullFace,
  zf: _emscripten_glDeleteBuffers,
  yf: _emscripten_glDeleteFramebuffers,
  xf: _emscripten_glDeleteProgram,
  wf: _emscripten_glDeleteQueries,
  vf: _emscripten_glDeleteQueriesEXT,
  uf: _emscripten_glDeleteRenderbuffers,
  tf: _emscripten_glDeleteSamplers,
  sf: _emscripten_glDeleteShader,
  rf: _emscripten_glDeleteSync,
  qf: _emscripten_glDeleteTextures,
  pf: _emscripten_glDeleteTransformFeedbacks,
  of: _emscripten_glDeleteVertexArrays,
  nf: _emscripten_glDeleteVertexArraysOES,
  mf: _emscripten_glDepthFunc,
  lf: _emscripten_glDepthMask,
  kf: _emscripten_glDepthRangef,
  jf: _emscripten_glDetachShader,
  hf: _emscripten_glDisable,
  gf: _emscripten_glDisableVertexAttribArray,
  ff: _emscripten_glDrawArrays,
  ef: _emscripten_glDrawArraysInstanced,
  df: _emscripten_glDrawArraysInstancedANGLE,
  cf: _emscripten_glDrawArraysInstancedARB,
  bf: _emscripten_glDrawArraysInstancedEXT,
  af: _emscripten_glDrawArraysInstancedNV,
  $e: _emscripten_glDrawBuffers,
  _e: _emscripten_glDrawBuffersEXT,
  Ze: _emscripten_glDrawBuffersWEBGL,
  Ye: _emscripten_glDrawElements,
  Xe: _emscripten_glDrawElementsInstanced,
  We: _emscripten_glDrawElementsInstancedANGLE,
  Ve: _emscripten_glDrawElementsInstancedARB,
  Ue: _emscripten_glDrawElementsInstancedEXT,
  Te: _emscripten_glDrawElementsInstancedNV,
  Se: _emscripten_glDrawRangeElements,
  Re: _emscripten_glEnable,
  Qe: _emscripten_glEnableVertexAttribArray,
  Pe: _emscripten_glEndQuery,
  Oe: _emscripten_glEndQueryEXT,
  Ne: _emscripten_glEndTransformFeedback,
  Me: _emscripten_glFenceSync,
  Le: _emscripten_glFinish,
  Ke: _emscripten_glFlush,
  Je: _emscripten_glFramebufferRenderbuffer,
  Ie: _emscripten_glFramebufferTexture2D,
  He: _emscripten_glFramebufferTextureLayer,
  Ge: _emscripten_glFrontFace,
  Fe: _emscripten_glGenBuffers,
  Ee: _emscripten_glGenFramebuffers,
  De: _emscripten_glGenQueries,
  Ce: _emscripten_glGenQueriesEXT,
  Be: _emscripten_glGenRenderbuffers,
  Ae: _emscripten_glGenSamplers,
  ze: _emscripten_glGenTextures,
  ye: _emscripten_glGenTransformFeedbacks,
  xe: _emscripten_glGenVertexArrays,
  we: _emscripten_glGenVertexArraysOES,
  ve: _emscripten_glGenerateMipmap,
  ue: _emscripten_glGetActiveAttrib,
  te: _emscripten_glGetActiveUniform,
  se: _emscripten_glGetActiveUniformBlockName,
  re: _emscripten_glGetActiveUniformBlockiv,
  qe: _emscripten_glGetActiveUniformsiv,
  pe: _emscripten_glGetAttachedShaders,
  oe: _emscripten_glGetAttribLocation,
  ne: _emscripten_glGetBooleanv,
  me: _emscripten_glGetBufferParameteri64v,
  le: _emscripten_glGetBufferParameteriv,
  ke: _emscripten_glGetError,
  je: _emscripten_glGetFloatv,
  ie: _emscripten_glGetFragDataLocation,
  he: _emscripten_glGetFramebufferAttachmentParameteriv,
  ge: _emscripten_glGetInteger64i_v,
  fe: _emscripten_glGetInteger64v,
  ee: _emscripten_glGetIntegeri_v,
  de: _emscripten_glGetIntegerv,
  ce: _emscripten_glGetInternalformativ,
  be: _emscripten_glGetProgramBinary,
  ae: _emscripten_glGetProgramInfoLog,
  $d: _emscripten_glGetProgramiv,
  _d: _emscripten_glGetQueryObjecti64vEXT,
  Zd: _emscripten_glGetQueryObjectivEXT,
  Yd: _emscripten_glGetQueryObjectui64vEXT,
  Xd: _emscripten_glGetQueryObjectuiv,
  Wd: _emscripten_glGetQueryObjectuivEXT,
  Vd: _emscripten_glGetQueryiv,
  Ud: _emscripten_glGetQueryivEXT,
  Td: _emscripten_glGetRenderbufferParameteriv,
  Sd: _emscripten_glGetSamplerParameterfv,
  Rd: _emscripten_glGetSamplerParameteriv,
  Qd: _emscripten_glGetShaderInfoLog,
  Pd: _emscripten_glGetShaderPrecisionFormat,
  Od: _emscripten_glGetShaderSource,
  Nd: _emscripten_glGetShaderiv,
  Md: _emscripten_glGetString,
  Ld: _emscripten_glGetStringi,
  Kd: _emscripten_glGetSynciv,
  Jd: _emscripten_glGetTexParameterfv,
  Id: _emscripten_glGetTexParameteriv,
  Hd: _emscripten_glGetTransformFeedbackVarying,
  Gd: _emscripten_glGetUniformBlockIndex,
  Fd: _emscripten_glGetUniformIndices,
  Ed: _emscripten_glGetUniformLocation,
  Dd: _emscripten_glGetUniformfv,
  Cd: _emscripten_glGetUniformiv,
  Bd: _emscripten_glGetUniformuiv,
  Ad: _emscripten_glGetVertexAttribIiv,
  zd: _emscripten_glGetVertexAttribIuiv,
  yd: _emscripten_glGetVertexAttribPointerv,
  xd: _emscripten_glGetVertexAttribfv,
  wd: _emscripten_glGetVertexAttribiv,
  vd: _emscripten_glHint,
  ud: _emscripten_glInvalidateFramebuffer,
  td: _emscripten_glInvalidateSubFramebuffer,
  sd: _emscripten_glIsBuffer,
  rd: _emscripten_glIsEnabled,
  qd: _emscripten_glIsFramebuffer,
  pd: _emscripten_glIsProgram,
  od: _emscripten_glIsQuery,
  nd: _emscripten_glIsQueryEXT,
  md: _emscripten_glIsRenderbuffer,
  ld: _emscripten_glIsSampler,
  kd: _emscripten_glIsShader,
  jd: _emscripten_glIsSync,
  id: _emscripten_glIsTexture,
  hd: _emscripten_glIsTransformFeedback,
  gd: _emscripten_glIsVertexArray,
  fd: _emscripten_glIsVertexArrayOES,
  ed: _emscripten_glLineWidth,
  dd: _emscripten_glLinkProgram,
  cd: _emscripten_glPauseTransformFeedback,
  bd: _emscripten_glPixelStorei,
  ad: _emscripten_glPolygonOffset,
  $c: _emscripten_glProgramBinary,
  _c: _emscripten_glProgramParameteri,
  Zc: _emscripten_glQueryCounterEXT,
  Yc: _emscripten_glReadBuffer,
  Xc: _emscripten_glReadPixels,
  Wc: _emscripten_glReleaseShaderCompiler,
  Vc: _emscripten_glRenderbufferStorage,
  Uc: _emscripten_glRenderbufferStorageMultisample,
  Tc: _emscripten_glResumeTransformFeedback,
  Sc: _emscripten_glSampleCoverage,
  Rc: _emscripten_glSamplerParameterf,
  Qc: _emscripten_glSamplerParameterfv,
  Pc: _emscripten_glSamplerParameteri,
  Oc: _emscripten_glSamplerParameteriv,
  Nc: _emscripten_glScissor,
  Mc: _emscripten_glShaderBinary,
  Lc: _emscripten_glShaderSource,
  Kc: _emscripten_glStencilFunc,
  Jc: _emscripten_glStencilFuncSeparate,
  Ic: _emscripten_glStencilMask,
  Hc: _emscripten_glStencilMaskSeparate,
  Gc: _emscripten_glStencilOp,
  Fc: _emscripten_glStencilOpSeparate,
  Ec: _emscripten_glTexImage2D,
  Dc: _emscripten_glTexImage3D,
  Cc: _emscripten_glTexParameterf,
  Bc: _emscripten_glTexParameterfv,
  Ac: _emscripten_glTexParameteri,
  zc: _emscripten_glTexParameteriv,
  yc: _emscripten_glTexStorage2D,
  xc: _emscripten_glTexStorage3D,
  wc: _emscripten_glTexSubImage2D,
  vc: _emscripten_glTexSubImage3D,
  uc: _emscripten_glTransformFeedbackVaryings,
  tc: _emscripten_glUniform1f,
  sc: _emscripten_glUniform1fv,
  rc: _emscripten_glUniform1i,
  qc: _emscripten_glUniform1iv,
  pc: _emscripten_glUniform1ui,
  oc: _emscripten_glUniform1uiv,
  nc: _emscripten_glUniform2f,
  mc: _emscripten_glUniform2fv,
  lc: _emscripten_glUniform2i,
  kc: _emscripten_glUniform2iv,
  jc: _emscripten_glUniform2ui,
  ic: _emscripten_glUniform2uiv,
  hc: _emscripten_glUniform3f,
  gc: _emscripten_glUniform3fv,
  fc: _emscripten_glUniform3i,
  ec: _emscripten_glUniform3iv,
  dc: _emscripten_glUniform3ui,
  cc: _emscripten_glUniform3uiv,
  bc: _emscripten_glUniform4f,
  ac: _emscripten_glUniform4fv,
  $b: _emscripten_glUniform4i,
  _b: _emscripten_glUniform4iv,
  Zb: _emscripten_glUniform4ui,
  Yb: _emscripten_glUniform4uiv,
  Xb: _emscripten_glUniformBlockBinding,
  Wb: _emscripten_glUniformMatrix2fv,
  Vb: _emscripten_glUniformMatrix2x3fv,
  Ub: _emscripten_glUniformMatrix2x4fv,
  Tb: _emscripten_glUniformMatrix3fv,
  Sb: _emscripten_glUniformMatrix3x2fv,
  Rb: _emscripten_glUniformMatrix3x4fv,
  Qb: _emscripten_glUniformMatrix4fv,
  Pb: _emscripten_glUniformMatrix4x2fv,
  Ob: _emscripten_glUniformMatrix4x3fv,
  Nb: _emscripten_glUseProgram,
  Mb: _emscripten_glValidateProgram,
  Lb: _emscripten_glVertexAttrib1f,
  Kb: _emscripten_glVertexAttrib1fv,
  Jb: _emscripten_glVertexAttrib2f,
  Ib: _emscripten_glVertexAttrib2fv,
  Hb: _emscripten_glVertexAttrib3f,
  Gb: _emscripten_glVertexAttrib3fv,
  Fb: _emscripten_glVertexAttrib4f,
  Eb: _emscripten_glVertexAttrib4fv,
  Db: _emscripten_glVertexAttribDivisor,
  Cb: _emscripten_glVertexAttribDivisorANGLE,
  Bb: _emscripten_glVertexAttribDivisorARB,
  Ab: _emscripten_glVertexAttribDivisorEXT,
  zb: _emscripten_glVertexAttribDivisorNV,
  yb: _emscripten_glVertexAttribI4i,
  xb: _emscripten_glVertexAttribI4iv,
  wb: _emscripten_glVertexAttribI4ui,
  vb: _emscripten_glVertexAttribI4uiv,
  ub: _emscripten_glVertexAttribIPointer,
  tb: _emscripten_glVertexAttribPointer,
  sb: _emscripten_glViewport,
  rb: _emscripten_glWaitSync,
  K: _emscripten_has_asyncify,
  u: _emscripten_log,
  d: _emscripten_longjmp,
  qb: _emscripten_memcpy_big,
  pb: _emscripten_request_fullscreen_strategy,
  ua: _emscripten_request_pointerlock,
  ob: _emscripten_resize_heap,
  ta: _emscripten_run_script,
  nb: _emscripten_run_script_int,
  mb: _emscripten_run_script_string,
  sa: _emscripten_sample_gamepad_data,
  ra: _emscripten_set_beforeunload_callback_on_thread,
  qa: _emscripten_set_blur_callback_on_thread,
  x: _emscripten_set_canvas_element_size,
  J: _emscripten_set_element_css_size,
  pa: _emscripten_set_focus_callback_on_thread,
  oa: _emscripten_set_fullscreenchange_callback_on_thread,
  na: _emscripten_set_gamepadconnected_callback_on_thread,
  ma: _emscripten_set_gamepaddisconnected_callback_on_thread,
  la: _emscripten_set_keydown_callback_on_thread,
  ka: _emscripten_set_keypress_callback_on_thread,
  ja: _emscripten_set_keyup_callback_on_thread,
  lb: _emscripten_set_main_loop_arg,
  ia: _emscripten_set_mousedown_callback_on_thread,
  ha: _emscripten_set_mouseenter_callback_on_thread,
  ga: _emscripten_set_mouseleave_callback_on_thread,
  fa: _emscripten_set_mousemove_callback_on_thread,
  ea: _emscripten_set_mouseup_callback_on_thread,
  da: _emscripten_set_pointerlockchange_callback_on_thread,
  ca: _emscripten_set_resize_callback_on_thread,
  ba: _emscripten_set_touchcancel_callback_on_thread,
  aa: _emscripten_set_touchend_callback_on_thread,
  $: _emscripten_set_touchmove_callback_on_thread,
  _: _emscripten_set_touchstart_callback_on_thread,
  Z: _emscripten_set_visibilitychange_callback_on_thread,
  Y: _emscripten_set_wheel_callback_on_thread,
  C: _emscripten_sleep,
  kb: _emscripten_thread_sleep,
  jb: _emscripten_wget,
  ib: _emscripten_wget_data,
  hb: _endpwent,
  $g: _environ_get,
  _g: _environ_sizes_get,
  X: _execve,
  r: _exit,
  p: _fd_close,
  Ba: _fd_fdstat_get,
  Aa: _fd_read,
  Ya: _fd_seek,
  Zg: _fd_sync,
  L: _fd_write,
  W: _fork,
  B: _ftime,
  q: _gai_strerror,
  b: _getTempRet0,
  A: _getaddrinfo,
  V: _getentropy,
  gb: _gethostbyaddr,
  fb: _gethostbyname,
  eb: _getloadavg,
  w: _getnameinfo,
  db: _getprotobyname,
  U: _getpwent,
  cb: _getpwnam,
  bb: _getpwuid,
  l: _gettimeofday,
  ab: invoke_i,
  o: invoke_ii,
  h: invoke_iii,
  k: invoke_iiii,
  v: invoke_iiiii,
  $a: invoke_iiiiiii,
  I: invoke_iiiiiiiii,
  z: invoke_iiiiiiiiii,
  Xa: invoke_ji,
  Wa: invoke_jiji,
  f: invoke_vi,
  g: invoke_vii,
  n: invoke_viii,
  T: invoke_viiii,
  S: invoke_viiiiiiiii,
  _a: _kill,
  Za: _killpg,
  R: _localtime_r,
  H: _mktime,
  Q: _pthread_sigmask,
  a: _setTempRet0,
  Va: _setgroups,
  Ua: _setpwent,
  j: _sigaction,
  G: _sigemptyset,
  Ta: _sigfillset,
  Sa: _signal,
  P: _strftime,
  Ra: _system,
  m: _time,
  Qa: _times,
  O: _utime,
  Pa: _utimes,
  Oa: _wait3,
  Na: _wait4,
};
var asm = createWasm();
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
  return (___wasm_call_ctors = Module["___wasm_call_ctors"] =
    Module["asm"]["ci"]).apply(null, arguments);
});
var _main = (Module["_main"] = function () {
  return (_main = Module["_main"] = Module["asm"]["di"]).apply(null, arguments);
});
var _pyapp_runmain = (Module["_pyapp_runmain"] = function () {
  return (_pyapp_runmain = Module["_pyapp_runmain"] =
    Module["asm"]["ei"]).apply(null, arguments);
});
var _free = (Module["_free"] = function () {
  return (_free = Module["_free"] = Module["asm"]["gi"]).apply(null, arguments);
});
var _strlen = (Module["_strlen"] = function () {
  return (_strlen = Module["_strlen"] = Module["asm"]["hi"]).apply(
    null,
    arguments
  );
});
var ___errno_location = (Module["___errno_location"] = function () {
  return (___errno_location = Module["___errno_location"] =
    Module["asm"]["ii"]).apply(null, arguments);
});
var _malloc = (Module["_malloc"] = function () {
  return (_malloc = Module["_malloc"] = Module["asm"]["ji"]).apply(
    null,
    arguments
  );
});
var _emSavegamesExport = (Module["_emSavegamesExport"] = function () {
  return (_emSavegamesExport = Module["_emSavegamesExport"] =
    Module["asm"]["ki"]).apply(null, arguments);
});
var _emSavegamesImport = (Module["_emSavegamesImport"] = function () {
  return (_emSavegamesImport = Module["_emSavegamesImport"] =
    Module["asm"]["li"]).apply(null, arguments);
});
var _memset = (Module["_memset"] = function () {
  return (_memset = Module["_memset"] = Module["asm"]["mi"]).apply(
    null,
    arguments
  );
});
var _fileno = (Module["_fileno"] = function () {
  return (_fileno = Module["_fileno"] = Module["asm"]["ni"]).apply(
    null,
    arguments
  );
});
var _Py_Initialize = (Module["_Py_Initialize"] = function () {
  return (_Py_Initialize = Module["_Py_Initialize"] =
    Module["asm"]["oi"]).apply(null, arguments);
});
var _PyRun_SimpleString = (Module["_PyRun_SimpleString"] = function () {
  return (_PyRun_SimpleString = Module["_PyRun_SimpleString"] =
    Module["asm"]["pi"]).apply(null, arguments);
});
var _ntohs = (Module["_ntohs"] = function () {
  return (_ntohs = Module["_ntohs"] = Module["asm"]["qi"]).apply(
    null,
    arguments
  );
});
var _htons = (Module["_htons"] = function () {
  return (_htons = Module["_htons"] = Module["asm"]["ri"]).apply(
    null,
    arguments
  );
});
var _htonl = (Module["_htonl"] = function () {
  return (_htonl = Module["_htonl"] = Module["asm"]["si"]).apply(
    null,
    arguments
  );
});
var _sysconf = (Module["_sysconf"] = function () {
  return (_sysconf = Module["_sysconf"] = Module["asm"]["ti"]).apply(
    null,
    arguments
  );
});
var __get_tzname = (Module["__get_tzname"] = function () {
  return (__get_tzname = Module["__get_tzname"] = Module["asm"]["ui"]).apply(
    null,
    arguments
  );
});
var __get_daylight = (Module["__get_daylight"] = function () {
  return (__get_daylight = Module["__get_daylight"] =
    Module["asm"]["vi"]).apply(null, arguments);
});
var __get_timezone = (Module["__get_timezone"] = function () {
  return (__get_timezone = Module["__get_timezone"] =
    Module["asm"]["wi"]).apply(null, arguments);
});
var stackSave = (Module["stackSave"] = function () {
  return (stackSave = Module["stackSave"] = Module["asm"]["xi"]).apply(
    null,
    arguments
  );
});
var stackRestore = (Module["stackRestore"] = function () {
  return (stackRestore = Module["stackRestore"] = Module["asm"]["yi"]).apply(
    null,
    arguments
  );
});
var stackAlloc = (Module["stackAlloc"] = function () {
  return (stackAlloc = Module["stackAlloc"] = Module["asm"]["zi"]).apply(
    null,
    arguments
  );
});
var _setThrew = (Module["_setThrew"] = function () {
  return (_setThrew = Module["_setThrew"] = Module["asm"]["Ai"]).apply(
    null,
    arguments
  );
});
var dynCall_v = (Module["dynCall_v"] = function () {
  return (dynCall_v = Module["dynCall_v"] = Module["asm"]["Bi"]).apply(
    null,
    arguments
  );
});
var dynCall_iii = (Module["dynCall_iii"] = function () {
  return (dynCall_iii = Module["dynCall_iii"] = Module["asm"]["Ci"]).apply(
    null,
    arguments
  );
});
var dynCall_vi = (Module["dynCall_vi"] = function () {
  return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["Di"]).apply(
    null,
    arguments
  );
});
var dynCall_viii = (Module["dynCall_viii"] = function () {
  return (dynCall_viii = Module["dynCall_viii"] = Module["asm"]["Ei"]).apply(
    null,
    arguments
  );
});
var dynCall_iiii = (Module["dynCall_iiii"] = function () {
  return (dynCall_iiii = Module["dynCall_iiii"] = Module["asm"]["Fi"]).apply(
    null,
    arguments
  );
});
var dynCall_ii = (Module["dynCall_ii"] = function () {
  return (dynCall_ii = Module["dynCall_ii"] = Module["asm"]["Gi"]).apply(
    null,
    arguments
  );
});
var dynCall_vii = (Module["dynCall_vii"] = function () {
  return (dynCall_vii = Module["dynCall_vii"] = Module["asm"]["Hi"]).apply(
    null,
    arguments
  );
});
var dynCall_iiiiii = (Module["dynCall_iiiiii"] = function () {
  return (dynCall_iiiiii = Module["dynCall_iiiiii"] =
    Module["asm"]["Ii"]).apply(null, arguments);
});
var dynCall_iiiii = (Module["dynCall_iiiii"] = function () {
  return (dynCall_iiiii = Module["dynCall_iiiii"] = Module["asm"]["Ji"]).apply(
    null,
    arguments
  );
});
var dynCall_jiji = (Module["dynCall_jiji"] = function () {
  return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["Ki"]).apply(
    null,
    arguments
  );
});
var dynCall_ji = (Module["dynCall_ji"] = function () {
  return (dynCall_ji = Module["dynCall_ji"] = Module["asm"]["Li"]).apply(
    null,
    arguments
  );
});
var dynCall_viiii = (Module["dynCall_viiii"] = function () {
  return (dynCall_viiii = Module["dynCall_viiii"] = Module["asm"]["Mi"]).apply(
    null,
    arguments
  );
});
var dynCall_viiiiiiiii = (Module["dynCall_viiiiiiiii"] = function () {
  return (dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] =
    Module["asm"]["Ni"]).apply(null, arguments);
});
var dynCall_iff = (Module["dynCall_iff"] = function () {
  return (dynCall_iff = Module["dynCall_iff"] = Module["asm"]["Oi"]).apply(
    null,
    arguments
  );
});
var dynCall_ifffff = (Module["dynCall_ifffff"] = function () {
  return (dynCall_ifffff = Module["dynCall_ifffff"] =
    Module["asm"]["Pi"]).apply(null, arguments);
});
var dynCall_ifff = (Module["dynCall_ifff"] = function () {
  return (dynCall_ifff = Module["dynCall_ifff"] = Module["asm"]["Qi"]).apply(
    null,
    arguments
  );
});
var dynCall_i = (Module["dynCall_i"] = function () {
  return (dynCall_i = Module["dynCall_i"] = Module["asm"]["Ri"]).apply(
    null,
    arguments
  );
});
var dynCall_viiiffff = (Module["dynCall_viiiffff"] = function () {
  return (dynCall_viiiffff = Module["dynCall_viiiffff"] =
    Module["asm"]["Si"]).apply(null, arguments);
});
var dynCall_viiiiffff = (Module["dynCall_viiiiffff"] = function () {
  return (dynCall_viiiiffff = Module["dynCall_viiiiffff"] =
    Module["asm"]["Ti"]).apply(null, arguments);
});
var dynCall_viiiiiffff = (Module["dynCall_viiiiiffff"] = function () {
  return (dynCall_viiiiiffff = Module["dynCall_viiiiiffff"] =
    Module["asm"]["Ui"]).apply(null, arguments);
});
var dynCall_iiiiddi = (Module["dynCall_iiiiddi"] = function () {
  return (dynCall_iiiiddi = Module["dynCall_iiiiddi"] =
    Module["asm"]["Vi"]).apply(null, arguments);
});
var dynCall_viiiii = (Module["dynCall_viiiii"] = function () {
  return (dynCall_viiiii = Module["dynCall_viiiii"] =
    Module["asm"]["Wi"]).apply(null, arguments);
});
var dynCall_vidddddd = (Module["dynCall_vidddddd"] = function () {
  return (dynCall_vidddddd = Module["dynCall_vidddddd"] =
    Module["asm"]["Xi"]).apply(null, arguments);
});
var dynCall_viffff = (Module["dynCall_viffff"] = function () {
  return (dynCall_viffff = Module["dynCall_viffff"] =
    Module["asm"]["Yi"]).apply(null, arguments);
});
var dynCall_vidi = (Module["dynCall_vidi"] = function () {
  return (dynCall_vidi = Module["dynCall_vidi"] = Module["asm"]["Zi"]).apply(
    null,
    arguments
  );
});
var dynCall_vid = (Module["dynCall_vid"] = function () {
  return (dynCall_vid = Module["dynCall_vid"] = Module["asm"]["_i"]).apply(
    null,
    arguments
  );
});
var dynCall_iiiiddddiiii = (Module["dynCall_iiiiddddiiii"] = function () {
  return (dynCall_iiiiddddiiii = Module["dynCall_iiiiddddiiii"] =
    Module["asm"]["$i"]).apply(null, arguments);
});
var dynCall_viiiiiii = (Module["dynCall_viiiiiii"] = function () {
  return (dynCall_viiiiiii = Module["dynCall_viiiiiii"] =
    Module["asm"]["aj"]).apply(null, arguments);
});
var dynCall_iiddiddiii = (Module["dynCall_iiddiddiii"] = function () {
  return (dynCall_iiddiddiii = Module["dynCall_iiddiddiii"] =
    Module["asm"]["bj"]).apply(null, arguments);
});
var dynCall_iiiddidddiii = (Module["dynCall_iiiddidddiii"] = function () {
  return (dynCall_iiiddidddiii = Module["dynCall_iiiddidddiii"] =
    Module["asm"]["cj"]).apply(null, arguments);
});
var dynCall_iiiiddidddiiii = (Module["dynCall_iiiiddidddiiii"] = function () {
  return (dynCall_iiiiddidddiiii = Module["dynCall_iiiiddidddiiii"] =
    Module["asm"]["dj"]).apply(null, arguments);
});
var dynCall_iifi = (Module["dynCall_iifi"] = function () {
  return (dynCall_iifi = Module["dynCall_iifi"] = Module["asm"]["ej"]).apply(
    null,
    arguments
  );
});
var dynCall_ddd = (Module["dynCall_ddd"] = function () {
  return (dynCall_ddd = Module["dynCall_ddd"] = Module["asm"]["fj"]).apply(
    null,
    arguments
  );
});
var dynCall_dd = (Module["dynCall_dd"] = function () {
  return (dynCall_dd = Module["dynCall_dd"] = Module["asm"]["gj"]).apply(
    null,
    arguments
  );
});
var dynCall_iiiiiiiiii = (Module["dynCall_iiiiiiiiii"] = function () {
  return (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] =
    Module["asm"]["hj"]).apply(null, arguments);
});
var dynCall_iiiiiii = (Module["dynCall_iiiiiii"] = function () {
  return (dynCall_iiiiiii = Module["dynCall_iiiiiii"] =
    Module["asm"]["ij"]).apply(null, arguments);
});
var dynCall_iiiiiiiii = (Module["dynCall_iiiiiiiii"] = function () {
  return (dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] =
    Module["asm"]["jj"]).apply(null, arguments);
});
var dynCall_viiiiii = (Module["dynCall_viiiiii"] = function () {
  return (dynCall_viiiiii = Module["dynCall_viiiiii"] =
    Module["asm"]["kj"]).apply(null, arguments);
});
var dynCall_jiiii = (Module["dynCall_jiiii"] = function () {
  return (dynCall_jiiii = Module["dynCall_jiiii"] = Module["asm"]["lj"]).apply(
    null,
    arguments
  );
});
var dynCall_iiiji = (Module["dynCall_iiiji"] = function () {
  return (dynCall_iiiji = Module["dynCall_iiiji"] = Module["asm"]["mj"]).apply(
    null,
    arguments
  );
});
var dynCall_jiiij = (Module["dynCall_jiiij"] = function () {
  return (dynCall_jiiij = Module["dynCall_jiiij"] = Module["asm"]["nj"]).apply(
    null,
    arguments
  );
});
var dynCall_jiiji = (Module["dynCall_jiiji"] = function () {
  return (dynCall_jiiji = Module["dynCall_jiiji"] = Module["asm"]["oj"]).apply(
    null,
    arguments
  );
});
var dynCall_fiiii = (Module["dynCall_fiiii"] = function () {
  return (dynCall_fiiii = Module["dynCall_fiiii"] = Module["asm"]["pj"]).apply(
    null,
    arguments
  );
});
var dynCall_iiiiiiiiiiiiiifii = (Module["dynCall_iiiiiiiiiiiiiifii"] =
  function () {
    return (dynCall_iiiiiiiiiiiiiifii = Module["dynCall_iiiiiiiiiiiiiifii"] =
      Module["asm"]["qj"]).apply(null, arguments);
  });
var dynCall_fiifi = (Module["dynCall_fiifi"] = function () {
  return (dynCall_fiifi = Module["dynCall_fiifi"] = Module["asm"]["rj"]).apply(
    null,
    arguments
  );
});
var dynCall_viifi = (Module["dynCall_viifi"] = function () {
  return (dynCall_viifi = Module["dynCall_viifi"] = Module["asm"]["sj"]).apply(
    null,
    arguments
  );
});
var dynCall_fiii = (Module["dynCall_fiii"] = function () {
  return (dynCall_fiii = Module["dynCall_fiii"] = Module["asm"]["tj"]).apply(
    null,
    arguments
  );
});
var dynCall_viidi = (Module["dynCall_viidi"] = function () {
  return (dynCall_viidi = Module["dynCall_viidi"] = Module["asm"]["uj"]).apply(
    null,
    arguments
  );
});
var dynCall_viiijj = (Module["dynCall_viiijj"] = function () {
  return (dynCall_viiijj = Module["dynCall_viiijj"] =
    Module["asm"]["vj"]).apply(null, arguments);
});
var dynCall_iiiiiiidiiddii = (Module["dynCall_iiiiiiidiiddii"] = function () {
  return (dynCall_iiiiiiidiiddii = Module["dynCall_iiiiiiidiiddii"] =
    Module["asm"]["wj"]).apply(null, arguments);
});
var dynCall_jij = (Module["dynCall_jij"] = function () {
  return (dynCall_jij = Module["dynCall_jij"] = Module["asm"]["xj"]).apply(
    null,
    arguments
  );
});
var dynCall_jii = (Module["dynCall_jii"] = function () {
  return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["yj"]).apply(
    null,
    arguments
  );
});
var dynCall_viiiiiiiiiiii = (Module["dynCall_viiiiiiiiiiii"] = function () {
  return (dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] =
    Module["asm"]["zj"]).apply(null, arguments);
});
var dynCall_viiiiiiiiii = (Module["dynCall_viiiiiiiiii"] = function () {
  return (dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] =
    Module["asm"]["Aj"]).apply(null, arguments);
});
var dynCall_iiiiiiii = (Module["dynCall_iiiiiiii"] = function () {
  return (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] =
    Module["asm"]["Bj"]).apply(null, arguments);
});
var dynCall_viiiiiiii = (Module["dynCall_viiiiiiii"] = function () {
  return (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] =
    Module["asm"]["Cj"]).apply(null, arguments);
});
var dynCall_iiij = (Module["dynCall_iiij"] = function () {
  return (dynCall_iiij = Module["dynCall_iiij"] = Module["asm"]["Dj"]).apply(
    null,
    arguments
  );
});
var dynCall_jiiiji = (Module["dynCall_jiiiji"] = function () {
  return (dynCall_jiiiji = Module["dynCall_jiiiji"] =
    Module["asm"]["Ej"]).apply(null, arguments);
});
var dynCall_jiij = (Module["dynCall_jiij"] = function () {
  return (dynCall_jiij = Module["dynCall_jiij"] = Module["asm"]["Fj"]).apply(
    null,
    arguments
  );
});
var dynCall_iiiiiidii = (Module["dynCall_iiiiiidii"] = function () {
  return (dynCall_iiiiiidii = Module["dynCall_iiiiiidii"] =
    Module["asm"]["Gj"]).apply(null, arguments);
});
var dynCall_viiiiiiiiiii = (Module["dynCall_viiiiiiiiiii"] = function () {
  return (dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] =
    Module["asm"]["Hj"]).apply(null, arguments);
});
var dynCall_vffff = (Module["dynCall_vffff"] = function () {
  return (dynCall_vffff = Module["dynCall_vffff"] = Module["asm"]["Ij"]).apply(
    null,
    arguments
  );
});
var dynCall_vf = (Module["dynCall_vf"] = function () {
  return (dynCall_vf = Module["dynCall_vf"] = Module["asm"]["Jj"]).apply(
    null,
    arguments
  );
});
var dynCall_vff = (Module["dynCall_vff"] = function () {
  return (dynCall_vff = Module["dynCall_vff"] = Module["asm"]["Kj"]).apply(
    null,
    arguments
  );
});
var dynCall_vfi = (Module["dynCall_vfi"] = function () {
  return (dynCall_vfi = Module["dynCall_vfi"] = Module["asm"]["Lj"]).apply(
    null,
    arguments
  );
});
var dynCall_viif = (Module["dynCall_viif"] = function () {
  return (dynCall_viif = Module["dynCall_viif"] = Module["asm"]["Mj"]).apply(
    null,
    arguments
  );
});
var dynCall_vif = (Module["dynCall_vif"] = function () {
  return (dynCall_vif = Module["dynCall_vif"] = Module["asm"]["Nj"]).apply(
    null,
    arguments
  );
});
var dynCall_viff = (Module["dynCall_viff"] = function () {
  return (dynCall_viff = Module["dynCall_viff"] = Module["asm"]["Oj"]).apply(
    null,
    arguments
  );
});
var dynCall_vifff = (Module["dynCall_vifff"] = function () {
  return (dynCall_vifff = Module["dynCall_vifff"] = Module["asm"]["Pj"]).apply(
    null,
    arguments
  );
});
var dynCall_iidiiii = (Module["dynCall_iidiiii"] = function () {
  return (dynCall_iidiiii = Module["dynCall_iidiiii"] =
    Module["asm"]["Qj"]).apply(null, arguments);
});
var _asyncify_start_unwind = (Module["_asyncify_start_unwind"] = function () {
  return (_asyncify_start_unwind = Module["_asyncify_start_unwind"] =
    Module["asm"]["Rj"]).apply(null, arguments);
});
var _asyncify_stop_unwind = (Module["_asyncify_stop_unwind"] = function () {
  return (_asyncify_stop_unwind = Module["_asyncify_stop_unwind"] =
    Module["asm"]["Sj"]).apply(null, arguments);
});
var _asyncify_start_rewind = (Module["_asyncify_start_rewind"] = function () {
  return (_asyncify_start_rewind = Module["_asyncify_start_rewind"] =
    Module["asm"]["Tj"]).apply(null, arguments);
});
var _asyncify_stop_rewind = (Module["_asyncify_stop_rewind"] = function () {
  return (_asyncify_stop_rewind = Module["_asyncify_stop_rewind"] =
    Module["asm"]["Uj"]).apply(null, arguments);
});
function invoke_iii(index, a1, a2) {
  var sp = stackSave();
  try {
    return dynCall_iii(index, a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    return dynCall_iiiii(index, a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_ii(index, a1) {
  var sp = stackSave();
  try {
    return dynCall_ii(index, a1);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    dynCall_viiii(index, a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    return dynCall_iiii(index, a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_viii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    dynCall_viii(index, a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_vii(index, a1, a2) {
  var sp = stackSave();
  try {
    dynCall_vii(index, a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_vi(index, a1) {
  var sp = stackSave();
  try {
    dynCall_vi(index, a1);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_i(index) {
  var sp = stackSave();
  try {
    return dynCall_i(index);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_ji(index, a1) {
  var sp = stackSave();
  try {
    return dynCall_ji(index, a1);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_jiji(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    return dynCall_jiji(index, a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["LZ4"] = LZ4;
var calledRun;
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
function callMain(args) {
  var entryFunction = Module["_main"];
  args = args || [];
  var argc = args.length + 1;
  var argv = stackAlloc((argc + 1) * 4);
  HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
  for (var i = 1; i < argc; i++) {
    HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
  }
  HEAP32[(argv >> 2) + argc] = 0;
  try {
    var ret = entryFunction(argc, argv);
    if (!keepRuntimeAlive()) {
      exit(ret, true);
    }
  } catch (e) {
    if (e instanceof ExitStatus) {
      return;
    } else if (e == "unwind") {
      return;
    } else {
      var toLog = e;
      if (e && typeof e === "object" && e.stack) {
        toLog = [e, e.stack];
      }
      err("exception thrown: " + toLog);
      quit_(1, e);
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) {
    return;
  }
  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
    if (shouldRunNow) callMain(args);
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function () {
      setTimeout(function () {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module["run"] = run;
function exit(status, implicit) {
  EXITSTATUS = status;
  if (implicit && keepRuntimeAlive() && status === 0) {
    return;
  }
  if (keepRuntimeAlive()) {
  } else {
    exitRuntime();
    if (Module["onExit"]) Module["onExit"](status);
    ABORT = true;
  }
  quit_(status, new ExitStatus(status));
}
if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) shouldRunNow = false;
run();
