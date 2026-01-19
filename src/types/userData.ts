type InputType = "midi" | "osc" | "audio";

export type NoteMatchMode = "pitchClass" | "exactNote";

export interface InputConfig {
  type: InputType;
  deviceId?: string;
  deviceName?: string;
  trackSelectionChannel: number;
  methodTriggerChannel: number;
  velocitySensitive: boolean;
  noteMatchMode?: NoteMatchMode | string;
  port: number;
}
