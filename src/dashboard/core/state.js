// state.js - Jotai atoms and custom hooks for state management

import { atom, useAtom } from "jotai";
import { useRef, useCallback, useEffect } from "react";

// =========================
// Jotai Atoms
// =========================

export const userDataAtom = atom({ config: {}, sets: [] });
export const recordingDataAtom = atom({});
export const activeTrackIdAtom = atom(null);
export const activeSetIdAtom = atom(null);
export const selectedChannelAtom = atom(null);
export const flashingChannelsAtom = atom(new Set());
export const flashingConstructorsAtom = atom(new Set());
export const recordingStateAtom = atom({});
export const helpTextAtom = atom("");

// =========================
// Custom Hooks
// =========================

export const useFlashingChannels = () => {
  const [flashingChannels, setFlashingChannels] = useAtom(flashingChannelsAtom);
  const activeFlashesRef = useRef(new Set());
  const pendingUpdatesRef = useRef(new Set());
  const rafIdRef = useRef(null);
  const timeoutsRef = useRef(new Map());

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      const hasChanges = pendingUpdatesRef.current.size > 0;
      pendingUpdatesRef.current.clear();
      rafIdRef.current = null;

      if (hasChanges) {
        setFlashingChannels(new Set(activeFlashesRef.current));
      }
    });
  }, [setFlashingChannels]);

  const flashChannel = useCallback(
    (channelName, duration = 100) => {
      const isAlreadyFlashing = activeFlashesRef.current.has(channelName);

      const existingTimeout = timeoutsRef.current.get(channelName);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      if (!isAlreadyFlashing) {
        activeFlashesRef.current.add(channelName);
        pendingUpdatesRef.current.add(channelName);
        scheduleUpdate();
      }

      const timeoutId = setTimeout(() => {
        activeFlashesRef.current.delete(channelName);
        pendingUpdatesRef.current.add(channelName);
        timeoutsRef.current.delete(channelName);
        scheduleUpdate();
      }, duration);

      timeoutsRef.current.set(channelName, timeoutId);
    },
    [scheduleUpdate]
  );

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  return [flashingChannels, flashChannel];
};
