import { app, globalShortcut, BrowserWindow, ipcMain, shell } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "../..");
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();
if (process.platform === "win32") app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = path.join(__dirname$1, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "新豪轩门窗",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    // titleBarStyle: "hidden", // 隐藏原生标题栏
    show: false,
    // Windows和Linux系统添加窗口控件，macOS无需额外配置
    // ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });
  win.show();
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}
app.whenReady().then(() => {
  createWindow();
  globalShortcut.register("CommandOrControl+O", () => {
    if (win) {
      win.webContents.openDevTools();
    }
  });
  globalShortcut.register("CommandOrControl+C+P", () => {
    if (win) {
      win.loadURL("https://xiaoxuan.sunhohi.cn");
    }
  });
  globalShortcut.register("CommandOrControl+C+D", () => {
    if (win) {
      win.loadURL("https://sunhohi-dev.yfway.com");
    }
  });
});
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
app.setLoginItemSettings({
  openAtLogin: true,
  // 是否开启自启
  openAsHidden: false,
  // 自启时是否隐藏窗口（true=后台运行）
  // Windows 特殊：指定自启的可执行文件路径（打包后需适配）
  path: process.execPath,
  // Windows 特殊：自启时传递的参数（可选，比如--hidden）
  args: ["--hidden"],
  // macOS 特殊：自启时的应用名称（可选）
  name: app.getName()
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
//# sourceMappingURL=index.js.map
