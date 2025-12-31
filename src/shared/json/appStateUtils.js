import fs from "fs";
import path from "path";

const getAppStatePath = () => {
  const srcDir = path.join(__dirname, "..", "..");
  return path.join(srcDir, "shared", "json", "appState.json");
};

export const loadAppState = async () => {
  const filePath = getAppStatePath();
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("Could not load appState.json, initializing with defaults.");
    return {
      activeTrackId: null,
      activeSetId: null,
      sequencerMuted: false,
    };
  }
};

export const saveAppState = async (state) => {
  const filePath = getAppStatePath();
  try {
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(state, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing appState.json:", error);
  }
};

export const saveAppStateSync = (state) => {
  const filePath = getAppStatePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing appState.json (sync):", error);
  }
};
