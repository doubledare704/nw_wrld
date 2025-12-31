# Getting Started with nw_wrld

This guide covers installation and basic usage of nw_wrld.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install](#step-1-install)
3. [Step 2: Start the App](#step-2-start-the-app)
4. [Step 3: Create a Track](#step-3-create-a-track)
5. [Step 4: Add a Visual Module](#step-4-add-a-visual-module)
6. [Step 5: Add Channels](#step-5-add-channels)
7. [Step 6: Program Your Pattern](#step-6-program-your-pattern)
8. [Step 7: Assign Methods to Channels](#step-7-assign-methods-to-channels)
9. [Step 8: Play Your Pattern](#step-8-play-your-pattern)
10. [Advanced: Connect External MIDI/OSC](#advanced-connect-external-midiosc)
11. [Next Steps](#next-steps)
12. [Troubleshooting](#troubleshooting)
13. [Further Reading](#further-reading)

---

## Prerequisites

- **Node.js v18 or higher** ([Download](https://nodejs.org/))
  - Verify: `node --version`
- **Basic terminal knowledge**

**Optional (for live performance):**

- A DAW that can send MIDI (Ableton Live, FL Studio, Logic Pro, etc.)
- MIDI routing software (IAC Driver on Mac, loopMIDI on Windows)

---

## Step 1: Install

```bash
git clone https://github.com/aagentah/nw_wrld.git
cd nw_wrld
npm install
```

## Step 2: Start the App

```bash
npm start
```

Two windows will open:

- **Dashboard**: Control center for configuration and mapping
- **Projector**: Visual output window

---

## Step 3: Create a Track

1. In the Dashboard, click **[CREATE TRACK]**
2. Name your track (no MIDI file needed for sequencer mode)
3. Click **[CREATE]**

---

## Step 4: Add a Visual Module

1. Click **[+ MODULE]**
2. Select a module (e.g., **Text**, **GridOverlay**, **Corners**)
3. Configure the module's initial properties (auto-load methods set colors, text, sizes, etc.)

Modules are visual elements displayed in the Projector window.

---

## Step 5: Add Channels

1. Click **[+ CHANNEL]** to add channels to your track
2. Channels appear as rows with a 16-step sequencer grid
3. Add multiple channels for different triggerable methods

---

## Step 6: Program Your Pattern

1. Click cells in the sequencer grid to activate steps (cells turn red when active)
2. Each row is a channel, each column is a beat
3. Create rhythmic patterns by activating different steps

---

## Step 7: Assign Methods to Channels

1. Click on a channel row to select it
2. Click **[ADD METHOD]** in the right panel
3. Select a method (e.g., `color`, `scale`, `rotate`)
4. Configure method parameters

When the sequencer playhead hits an active cell, it triggers that channel's methods.

---

## Step 8: Play Your Pattern

1. Click the **[PLAY]** button in the footer
2. Watch the playhead move across the grid
3. See your visuals respond to the pattern
4. Adjust BPM in Settings (60-130 BPM)

The pattern loops continuously until you click **[STOP]**.

---

## Advanced: Connect External MIDI/OSC

Once you're comfortable with the sequencer, you can connect external hardware for live performance.

### Prerequisites

- A DAW that can send MIDI (Ableton Live, FL Studio, Logic Pro, etc.)
- MIDI routing software:
  - **Mac**: IAC Driver (built-in)
  - **Windows**: loopMIDI

### Setup MIDI Routing

**Mac:** Open Audio MIDI Setup → Show MIDI Studio → Enable IAC Driver

**Windows:** Download and install [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)

**DAW:** Enable your virtual MIDI port for Track/Remote output in Preferences

### Switch to External Mode

1. Open Dashboard → **Settings**
2. **Signal Source** → Select **External (MIDI/OSC)**
3. Configure your MIDI device or OSC port
4. Go to **Settings → Configure Mappings** to customize trigger notes
5. Your DAW now controls the visuals in real-time

---

## Next Steps

1. Explore other modules: `GridOverlay`, `Corners`, `Frame`, `ThreeTemplate`
2. Read the [Module Development Guide](MODULE_DEVELOPMENT.md) to create custom modules
3. Experiment with method parameters and sequencer patterns
4. Build multi-track performances

---

## Troubleshooting

**App won't start:** Close other dev servers (port 9000), run `npm install`  
**Module not visible:** Trigger `show` method or set `autoLoad: true`  
**Pattern not saving:** Check console for errors  
**Sequencer not firing:** Verify methods are assigned to channels

For more help, check the Developer Console or see [Troubleshooting](README.md#troubleshooting) in the README.

---

## Further Reading

- [Module Development Guide](MODULE_DEVELOPMENT.md) - Create custom modules
- [Contributing Guide](CONTRIBUTING.md) - Contribute to the project
