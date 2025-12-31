import fs from "fs";
import path from "path";

const getRecordingDataPath = () => {
  const srcDir = path.join(__dirname, "..", "..");
  return path.join(srcDir, "shared", "json", "recordingData.json");
};

export const loadRecordingData = async () => {
  const filePath = getRecordingDataPath();
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData.recordings || {};
  } catch (error) {
    console.warn(
      "Could not load recordingData.json, initializing with empty data.",
      error
    );
    return {};
  }
};

export const saveRecordingData = async (recordings) => {
  const filePath = getRecordingDataPath();
  try {
    await fs.promises.writeFile(
      filePath,
      JSON.stringify({ recordings }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing recordingData to JSON file:", error);
  }
};

export const saveRecordingDataSync = (recordings) => {
  const filePath = getRecordingDataPath();
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ recordings }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing recordingData to JSON file (sync):", error);
  }
};

export const getRecordingForTrack = (recordings, trackId) => {
  return recordings[trackId] || { channels: [] };
};

export const setRecordingForTrack = (recordings, trackId, recording) => {
  return {
    ...recordings,
    [trackId]: recording,
  };
};

export const getSequencerForTrack = (recordings, trackId) => {
  return recordings[trackId]?.sequencer || { bpm: 120, pattern: {} };
};

export const setSequencerForTrack = (recordings, trackId, sequencer) => {
  return {
    ...recordings,
    [trackId]: {
      ...recordings[trackId],
      sequencer,
    },
  };
};
