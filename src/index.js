const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  nativeImage,
} = require("electron");
const path = require("path");
const fs = require("fs");
const InputManager = require("./main/InputManager");
const { DEFAULT_USER_DATA } = require("./shared/config/defaultConfig");

app.setName("nw_wrld");

if (process.platform === "darwin") {
  app.setAboutPanelOptions({
    applicationName: "nw_wrld",
    applicationVersion: app.getVersion(),
  });
}

let projector1Window;
let dashboardWindow;
let inputManager;

// Performance-focused command line switches
app.commandLine.appendSwitch("max-webgl-contexts", "64");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");

// Register IPC handlers ONCE at module level (outside createWindow)
const messageChannels = {
  "dashboard-to-projector": (data) => {
    if (
      projector1Window &&
      !projector1Window.isDestroyed() &&
      projector1Window.webContents &&
      !projector1Window.webContents.isDestroyed()
    ) {
      projector1Window.webContents.send("from-dashboard", data);
    }
  },
  "projector-to-dashboard": (data) => {
    if (
      dashboardWindow &&
      !dashboardWindow.isDestroyed() &&
      dashboardWindow.webContents &&
      !dashboardWindow.webContents.isDestroyed()
    ) {
      dashboardWindow.webContents.send("from-projector", data);
    }
  },
};

Object.entries(messageChannels).forEach(([channel, handler]) => {
  ipcMain.on(channel, (event, data) => {
    handler(data);
  });
});

ipcMain.handle("input:configure", async (event, payload) => {
  if (inputManager) {
    await inputManager.initialize(payload);
  }
  return { success: true };
});

ipcMain.handle("input:get-midi-devices", async () => {
  return await InputManager.getAvailableMIDIDevices();
});

ipcMain.on("log-to-main", (event, message) => {
  console.log(message);
});

function loadConfig() {
  const configPath = path.join(
    __dirname,
    "..",
    "src",
    "shared",
    "json",
    "userData.json"
  );

  try {
    const data = fs.readFileSync(configPath, "utf-8");

    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch (parseErr) {
      console.error(
        "[Main] JSON parse error - config file is corrupted:",
        parseErr.message
      );
      console.error("[Main] Using default configuration");
      return DEFAULT_USER_DATA;
    }
  } catch (readErr) {
    if (readErr.code === "ENOENT") {
      console.warn("[Main] Config file not found, using defaults");
    } else {
      console.error("[Main] Failed to read config file:", readErr.message);
    }
    return DEFAULT_USER_DATA;
  }
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } =
    primaryDisplay.workAreaSize;
  const { x: screenX, y: screenY } = primaryDisplay.workArea;

  const halfWidth = Math.floor(screenWidth / 2);

  // Create Projector 1 Window with optimized preferences
  projector1Window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      backgroundThrottling: false,
      webgl: true,
      enableHardwareAcceleration: true,
      // Additional performance optimizations
      pageVisibility: true, // Prevents throttling when page isn't visible
      autoplayPolicy: "no-user-gesture-required", // Helps with audio processing
    },
    x: screenX + halfWidth,
    y: screenY,
    width: halfWidth,
    height: screenHeight,
    title: "Projector 1",
    // Additional window optimizations
    show: false, // Don't show until ready
    paintWhenInitiallyHidden: true, // Start rendering before window is shown
    frame: false,
  });

  // Show window when ready to prevent white flash
  projector1Window.once("ready-to-show", () => {
    projector1Window.show();
  });

  projector1Window.loadFile("projector/views/projector.html");

  // Create Dashboard Window with appropriate optimizations
  dashboardWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableHardwareAcceleration: true, // Enable for dashboard too
      backgroundThrottling: false, // Prevent throttling
    },
    x: screenX,
    y: screenY,
    width: halfWidth,
    height: screenHeight,
    title: "nw_wrld",
    show: false,
    // frame: false,
  });

  dashboardWindow.once("ready-to-show", () => {
    dashboardWindow.show();
  });

  dashboardWindow.loadFile("dashboard/views/dashboard.html");

  dashboardWindow.webContents.once("did-finish-load", () => {
    const fullConfig = loadConfig();
    inputManager = new InputManager(dashboardWindow, projector1Window);
    const { DEFAULT_INPUT_CONFIG } = require("./shared/config/defaultConfig");
    const inputConfig = fullConfig.config?.input || DEFAULT_INPUT_CONFIG;
    inputManager.initialize(inputConfig).catch((err) => {
      console.error("[Main] Failed to initialize InputManager:", err);
    });
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });

  // Clear cache on startup for consistent performance
  app.on("ready", () => {
    const { session } = require("electron");
    session.defaultSession.clearCache();
  });
}

// Handle app ready state
app.whenReady().then(() => {
  if (process.platform === "darwin") {
    try {
      const iconPath = path.join(
        __dirname,
        "assets",
        "images",
        "blueprint.png"
      );
      const icon = nativeImage.createFromPath(iconPath);
      if (!icon.isEmpty()) {
        app.dock.setIcon(icon);
      }
    } catch (err) {
      console.error("[Main] Failed to set dock icon:", err?.message || err);
    }
  }

  createWindow();

  // Handle app activation (macOS)
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", async () => {
  if (inputManager) {
    await inputManager.disconnect();
  }
});
