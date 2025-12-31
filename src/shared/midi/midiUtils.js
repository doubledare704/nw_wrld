// Shared MIDI utilities

export const MIDI_INPUT_NAME = "IAC Driver Bus 1";

// Legacy channel notes mapping for MIDI file parsing: E7 to G8 → ch1 to ch16
// Note: These ch1-ch16 values are only used when parsing MIDI files for visualization
export const CHANNEL_NOTES = {
  G8: "ch1",
  "F#8": "ch2",
  F8: "ch3",
  E8: "ch4",
  "D#8": "ch5",
  D8: "ch6",
  "C#8": "ch7",
  C8: "ch8",
  B7: "ch9",
  "A#7": "ch10",
  A7: "ch11",
  "G#7": "ch12",
  G7: "ch13",
  "F#7": "ch14",
  F7: "ch15",
  E7: "ch16",
};

// Reverse mapping: channel → note name
export const NOTE_TO_CHANNEL = Object.fromEntries(
  Object.entries(CHANNEL_NOTES).map(([note, channel]) => [channel, note])
);

// MIDI Utility Functions
export const NOTE_OFFSETS = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export function noteNameToNumber(noteName) {
  if (typeof noteName !== "string") return null;
  const match = noteName.trim().match(/^([A-G](?:#|b)?)(-?\d+)$/);
  if (!match) return null;
  const note = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = NOTE_OFFSETS[note];
  if (semitone === undefined || Number.isNaN(octave)) return null;
  // Ableton uses C0 = MIDI 24 (not MIDI 12)
  // So we need (octave + 2) * 12 to match Ableton's octave notation
  return (octave + 2) * 12 + semitone;
}

export function buildChannelNotesMap() {
  const map = {};
  Object.entries(CHANNEL_NOTES).forEach(([noteName, channelName]) => {
    const num = noteNameToNumber(noteName);
    if (num !== null) map[num] = channelName;
  });
  return map;
}

export function resolveTrackTrigger(track, inputType, globalMappings) {
  if (track?.trackSlot && globalMappings?.trackMappings?.[inputType]) {
    return globalMappings.trackMappings[inputType][track.trackSlot];
  }
  return track?.trackTrigger || track?.trackNote || "";
}

export function resolveChannelTrigger(channelSlot, inputType, globalMappings) {
  if (channelSlot && globalMappings?.channelMappings?.[inputType]) {
    return globalMappings.channelMappings[inputType][channelSlot];
  }
  return "";
}

export function buildTrackNotesMapFromTracks(
  tracks,
  globalMappings,
  currentInputType = "midi"
) {
  const map = {};
  if (!Array.isArray(tracks)) {
    return map;
  }

  tracks.forEach((track) => {
    const trackTrigger = resolveTrackTrigger(
      track,
      currentInputType,
      globalMappings
    );

    if (track && trackTrigger && track.id && currentInputType === "midi") {
      const num = noteNameToNumber(trackTrigger);
      if (num !== null) map[num] = track.id;
    }
  });

  return map;
}

export function buildMidiConfig(
  userData,
  globalMappings,
  currentInputType = "midi"
) {
  const config = {
    trackTriggersMap: {},
    channelMappings: {},
  };

  if (!userData || !Array.isArray(userData)) {
    return config;
  }

  userData.forEach((track) => {
    const trackTrigger = resolveTrackTrigger(
      track,
      currentInputType,
      globalMappings
    );

    // Build track triggers map
    if (trackTrigger && track.name) {
      if (currentInputType === "midi") {
        const num = noteNameToNumber(trackTrigger);
        if (num !== null) config.trackTriggersMap[num] = track.name;
      } else {
        config.trackTriggersMap[trackTrigger] = track.name;
      }
    }

    // Build channel mappings for this track (trigger → array of channel numbers)
    if (track.channelMappings) {
      config.channelMappings[track.name] = {};

      Object.entries(track.channelMappings).forEach(
        ([channelNumber, slotOrTrigger]) => {
          const channelTrigger =
            typeof slotOrTrigger === "number"
              ? resolveChannelTrigger(
                  slotOrTrigger,
                  currentInputType,
                  globalMappings
                )
              : slotOrTrigger;

          if (channelTrigger) {
            let key = channelTrigger;
            if (currentInputType === "midi") {
              const num = noteNameToNumber(channelTrigger);
              if (num !== null) key = num;
            }

            if (!config.channelMappings[track.name][key]) {
              config.channelMappings[track.name][key] = [];
            }
            config.channelMappings[track.name][key].push(channelNumber);
          }
        }
      );
    }
  });

  return config;
}
