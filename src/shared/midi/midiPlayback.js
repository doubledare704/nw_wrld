// MIDI Playback Engine
// Schedules and triggers MIDI notes for playback without Ableton

class MidiPlayback {
  constructor() {
    this.isPlaying = false;
    this.startTime = 0;
    this.pausedTime = 0;
    this.scheduledEvents = [];
    this.channels = [];
    this.bpm = 120;
    this.onNoteCallback = null;
    this.onStopCallback = null;
  }

  load(channels, bpm = 120) {
    this.channels = channels;
    this.bpm = bpm;
    this.reset();
  }

  setOnNoteCallback(callback) {
    this.onNoteCallback = callback;
  }

  setOnStopCallback(callback) {
    this.onStopCallback = callback;
  }

  reset() {
    this.stop();
    this.pausedTime = 0;
  }

  play() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.startTime = Date.now() - this.pausedTime;

    this.scheduleAllNotes();
  }

  pause() {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.pausedTime = Date.now() - this.startTime;

    this.clearScheduledEvents();
  }

  stop() {
    this.isPlaying = false;
    this.pausedTime = 0;
    this.clearScheduledEvents();

    if (this.onStopCallback) {
      this.onStopCallback();
    }
  }

  clearScheduledEvents() {
    this.scheduledEvents.forEach((timeoutId) => clearTimeout(timeoutId));
    this.scheduledEvents = [];
  }

  scheduleAllNotes() {
    this.clearScheduledEvents();

    const beatsPerSecond = this.bpm / 60;

    this.channels.forEach((channel) => {
      channel.sequences.forEach((sequence) => {
        const timeInSeconds = sequence.time / beatsPerSecond;
        const timeInMs = timeInSeconds * 1000;
        const delayFromNow = timeInMs - this.pausedTime;

        if (delayFromNow > 0) {
          const timeoutId = setTimeout(() => {
            if (this.isPlaying && this.onNoteCallback) {
              this.onNoteCallback(channel.name, channel.midi);
            }
          }, delayFromNow);

          this.scheduledEvents.push(timeoutId);
        }
      });
    });

    const maxTime = Math.max(
      ...this.channels.flatMap((ch) =>
        ch.sequences.map((seq) => (seq.time / beatsPerSecond) * 1000)
      ),
      0
    );

    if (maxTime > this.pausedTime) {
      const remainingTime = maxTime - this.pausedTime;
      const stopTimeoutId = setTimeout(() => {
        this.stop();
      }, remainingTime + 100);

      this.scheduledEvents.push(stopTimeoutId);
    }
  }

  getCurrentTime() {
    if (this.isPlaying) {
      return Date.now() - this.startTime;
    }
    return this.pausedTime;
  }

  getProgress() {
    if (this.channels.length === 0) return 0;

    const beatsPerSecond = this.bpm / 60;
    const maxTime = Math.max(
      ...this.channels.flatMap((ch) =>
        ch.sequences.map((seq) => (seq.time / beatsPerSecond) * 1000)
      ),
      1
    );

    return Math.min((this.getCurrentTime() / maxTime) * 100, 100);
  }
}

export default MidiPlayback;
