const { app, ipcMain } = require("electron");
const path = require("path");

const runtimeMainProcessDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "dist",
  "runtime",
  "main",
  "mainProcess"
);

const { state } = require(path.join(runtimeMainProcessDir, "state.js"));
const { setupApp } = require(path.join(runtimeMainProcessDir, "appSetup.js"));
const { registerProtocols } = require(path.join(runtimeMainProcessDir, "protocols.js"));
const { registerWorkspaceSelectionIpc } = require(path.join(runtimeMainProcessDir, "workspace.js"));
const { registerLifecycle, registerActivate } = require(path.join(runtimeMainProcessDir, "lifecycle.js"));

const { registerIpcBridge } = require("./ipcBridge");
const { registerSandboxIpc } = require("./sandbox");
const { createWindow, registerMessagingIpc } = require("./windows");

function start() {
  setupApp();

  registerIpcBridge();
  registerSandboxIpc();
  registerMessagingIpc({ ipcMain });
  registerWorkspaceSelectionIpc({ createWindow });
  registerLifecycle({ createWindow });

  app.whenReady().then(() => {
    registerProtocols();
    state.currentProjectDir = null;
    registerActivate({ createWindow });
    createWindow(null);
  });
}

module.exports = { start };
