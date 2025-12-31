import { useCallback, useEffect } from "react";
import { ipcRenderer } from "electron";

export const useIPCSend = (channel = "dashboard-to-projector") => {
  return useCallback((type, props = {}) => {
    ipcRenderer.send(channel, { type, props });
  }, [channel]);
};

export const useIPCInvoke = () => {
  return useCallback(async (channel, ...args) => {
    return await ipcRenderer.invoke(channel, ...args);
  }, []);
};

export const useIPCListener = (channel, handler, deps = []) => {
  useEffect(() => {
    ipcRenderer.on(channel, handler);
    return () => {
      ipcRenderer.removeListener(channel, handler);
    };
  }, [channel, handler, ...deps]);
};

