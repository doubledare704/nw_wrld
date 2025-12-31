import fs from "fs";
import path from "path";

export const loadSettings = async () => {
  const srcDir = path.join(__dirname, "..", "..");
  const settingsPath = path.join(srcDir, "shared", "json", "config.json");
  try {
    const data = await fs.promises.readFile(settingsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("Could not load config.json, using defaults.", error);
    return {
      aspectRatios: [
        {
          id: "landscape",
          label: "Landscape",
          width: "100vw",
          height: "100vh",
        },
      ],
      backgroundColors: [{ id: "grey", label: "Grey", value: "#151715" }],
      autoRefresh: false,
    };
  }
};

export const loadSettingsSync = () => {
  const srcDir = path.join(__dirname, "..", "..");
  const settingsPath = path.join(srcDir, "shared", "json", "config.json");
  try {
    const data = fs.readFileSync(settingsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading config.json:", error);
    return {
      aspectRatios: [
        {
          id: "landscape",
          label: "Landscape",
          width: "100vw",
          height: "100vh",
        },
      ],
      backgroundColors: [{ id: "grey", label: "Grey", value: "#151715" }],
      autoRefresh: false,
    };
  }
};

