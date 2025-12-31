# nw_wrld

nw_wrld is an event-driven sequencer for triggering visuals using web technologies. It enables users to scale up audiovisual compositions for prototyping, demos, exhibitions, and live performances. Users code their own visual modules, then orchestrate them using the project's native UI composer.

Visuals can be triggered via the built-in 16-step sequencer or by configuring external MIDI/OSC inputs.

![Node Version](https://img.shields.io/badge/node-%5E18.0.0-brightgreen)
![Electron](https://img.shields.io/badge/electron-v28.0.0-blue)

---

## Features

- **Built-in 16-step pattern sequencer** - Create rhythmic audiovisual compositions without external hardware
- **External MIDI/OSC support** - Connect Ableton Live, TouchOSC, or any MIDI/OSC source for live performance
- **Visual module system** - Build custom visuals with p5.js, Three.js, D3.js, or vanilla JavaScript
- **Hot module reloading** - Edit modules and see changes instantly during development
- **Flexible method mapping** - Trigger any visual method with sequencer patterns or external signals

---

## Prerequisites

**Required:**

- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- Basic familiarity with terminal/command line

**Optional (for live performance with external control):**

- **A DAW** that outputs MIDI (Ableton Live, FL Studio, Logic Pro, etc.)
- **MIDI routing** setup:
  - **Mac**: IAC Driver (built-in) - [Setup Guide](https://help.ableton.com/hc/en-us/articles/209774225-Using-virtual-MIDI-buses)
  - **Windows**: loopMIDI or similar virtual MIDI port

---

## Quick Start

Install and run:

```bash
# 1. Clone or download this repository
git clone https://github.com/aagentah/nw_wrld.git
cd nw_wrld

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

Two windows will open:

- **Dashboard**: Control center for creating tracks, programming patterns, and configuring visuals
- **Projector**: Visual output window

### 60-Second Test

1. Click **[CREATE TRACK]** → Name it → Create
2. Click **[+ MODULE]** → Select **Text** or **Corners**
3. Click **[+ CHANNEL]** to add a sequencer row
4. Click some cells in the 16-step grid (they turn red)
5. Assign a method to the channel (e.g., `color` or `rotate`)
6. Click **[PLAY]** in the footer

You'll see the playhead move across the grid and trigger your visuals. No external setup required!

---

## How It Works: The Big Picture

```
Signal Sources:
┌──────────────┐
│  Sequencer   │──┐
│  (Built-in)  │  │
└──────────────┘  │
                  ├──▶ Dashboard ──▶ Projector
┌──────────────┐  │    (Control)     (Visuals)
│ External     │──┘
│ MIDI/OSC     │
└──────────────┘
```

### Dashboard Window

- Create tracks and add visual modules
- Program patterns with the 16-step sequencer
- Configure module methods and parameters
- (Optional) Connect external MIDI/OSC sources

### Projector Window

- Displays active visual modules
- Responds to sequencer or external triggers in real-time
- Can be full-screened on external displays

---

## Your First Workflow (Sequencer Mode)

Follow the [Getting Started Guide](GETTING_STARTED.md) for detailed step-by-step instructions.

**Quick overview:**

1. Create a track and add visual modules
2. Add channels and program patterns in the 16-step grid
3. Assign methods to channels (color, scale, rotate, etc.)
4. Click PLAY to see your patterns trigger visuals in real-time

The built-in sequencer is perfect for testing modules and creating standalone audiovisual pieces without external hardware.

---

## Advanced: External MIDI/OSC Control

For live performance with external hardware:

### Step 1: Configure MIDI Routing

**Mac:**

1. Open **Audio MIDI Setup** → Show MIDI Studio
2. Enable **IAC Driver**

**Windows:**

1. Install [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)

**In Ableton:**

1. Preferences → MIDI
2. Enable your virtual port for Track/Remote output

### Step 2: Switch Mode

1. Dashboard → **Settings** → **Signal Source**
2. Select **External (MIDI/OSC)**
3. Configure MIDI device or OSC port
4. Go to **Settings → Configure Mappings** to customize trigger notes

### Step 3: Perform Live

1. Play your DAW
2. Track activation note loads modules
3. MIDI notes trigger mapped methods
4. Real-time audiovisual performance

---

## Creating Visual Modules

Modules are JavaScript classes that extend `ModuleBase`. Place them in `src/projector/modules/`.

See the [Module Development Guide](MODULE_DEVELOPMENT.md) for complete documentation on creating custom modules, including:

- Full module structure and lifecycle
- Method definitions and option types
- Library usage (p5.js, Three.js, D3.js)
- Advanced patterns and best practices

---

## Built-in ModuleBase Methods

When you extend `ModuleBase`, you inherit powerful methods for free: `show`, `hide`, `offset`, `scale`, `opacity`, `rotate`, `randomZoom`, and `matrix`.

These methods can be triggered via the sequencer or external MIDI/OSC, giving you instant control over positioning, visibility, transformations, and effects.

See the [Module Development Guide](MODULE_DEVELOPMENT.md#option-types-reference) for complete documentation of all built-in methods and their parameters.

---

## Two Modes: Sequencer vs External

Switch between modes in **Settings → Signal Source**.

**Sequencer Mode (Default)** - Program patterns with a 16-step grid per channel. Perfect for getting started, testing modules, and creating standalone pieces without external hardware. Adjustable BPM (60-130), patterns loop continuously and save with your tracks.

**External Mode (Advanced)** - Connect MIDI/OSC hardware for live performance. Map MIDI notes or OSC addresses to visual methods for real-time control from Ableton, hardware controllers, TouchOSC, etc. Configure global mappings in Settings for consistent control across all tracks.

Switch modes anytime - your tracks, modules, and methods remain the same. Only the trigger source changes.

---

## Example Modules

Study these modules in `src/projector/modules/`:

- **Text.js** - Simple text display and manipulation
- **Corners.js** - DOM-based GUI element
- **GridOverlay.js** - Canvas-based grid overlay
- **ThreeTemplate.js** - Three.js 3D template
- **AsteroidGraph.js** - Complex Three.js visualization

---

## Project Structure

```
nw_wrld/
├── src/
│   ├── dashboard/              # React UI for control
│   │   ├── Dashboard.js        # Main dashboard logic
│   │   ├── modals/             # UI modals (settings, track creation, etc.)
│   │   ├── components/         # Reusable components
│   │   └── styles/             # Dashboard styles
│   │
│   ├── projector/              # Visual output window
│   │   ├── Projector.js        # Main projector logic
│   │   ├── modules/            # ← PUT YOUR MODULES HERE
│   │   │   ├── Text.js
│   │   │   ├── GridOverlay.js
│   │   │   ├── Corners.js
│   │   │   └── YourModule.js  # Your creations go here
│   │   ├── templates/
│   │   │   └── ThreeTemplate.js # 3D module template
│   │   └── helpers/
│   │       ├── moduleBase.js   # Base class (the foundation)
│   │       └── threeBase.js    # Three.js base class
│   │
│   ├── main/                   # Electron main process
│   │   └── InputManager.js     # MIDI/OSC input handling
│   │
│   ├── shared/
│   │   ├── json/               # Configuration and user data
│   │   ├── config/             # Default configuration
│   │   ├── sequencer/          # Sequencer playback engine
│   │   ├── midi/               # MIDI utilities
│   │   ├── audio/              # Audio feedback
│   │   └── styles/             # Global styles
│   │
│   └── assets/                 # Project assets
│       ├── images/             # Images (blueprint, overlays, etc.)
│       └── json/               # Data files (orbits, meteors, fonts)
│
├── package.json
└── README.md
```

---

## Configuration

- **`src/shared/json/config.json`** - Edit to customize aspect ratios and background colors available in Dashboard settings
- **`src/shared/json/userData.json`** - Stores tracks, mappings, and settings (automatically managed by Dashboard)

---

## Troubleshooting

| Issue                 | Solution                                                  |
| --------------------- | --------------------------------------------------------- |
| Pattern not playing   | Check that methods are assigned to channels               |
| Module doesn't appear | Check `export default`, verify `static name`, restart app |
| Module hidden         | Trigger `show()` method or set `autoLoad: true`           |
| No MIDI detected      | Enable IAC Driver/loopMIDI and verify DAW MIDI output     |
| Method not triggering | Verify mapping, check method name match, check console    |

---

## Performance

- Limit particle/object counts
- Use `requestAnimationFrame` for animations
- Clean up properly in `destroy()`
- Test on target hardware

---

## Building

```bash
npm run build
```

---

## Contributing

- Report bugs via issues
- Submit pull requests for improvements
- Share modules via discussions

---

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

## Documentation

- [Getting Started Guide](GETTING_STARTED.md)
- [Module Development Guide](MODULE_DEVELOPMENT.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## Technologies

Electron, React, Three.js, p5.js, D3.js, WebMIDI

## Support

- [GitHub Issues](https://github.com/aagentah/nw_wrld/issues)
- [GitHub Discussions](https://github.com/aagentah/nw_wrld/discussions)
