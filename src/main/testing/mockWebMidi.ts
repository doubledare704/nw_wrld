type Listener = (...args: any[]) => void;

export type MockMidiDeviceInfo = {
  id: string;
  name: string;
  manufacturer?: string;
};

class MockMidiInput {
  id: string;
  name: string;
  manufacturer: string;
  private listenersByType: Map<string, Set<Listener>>;

  constructor(device: MockMidiDeviceInfo) {
    this.id = device.id;
    this.name = device.name;
    this.manufacturer = device.manufacturer || "";
    this.listenersByType = new Map();
  }

  addListener(type: string, handler: Listener) {
    if (typeof handler !== "function") return;
    const set = this.listenersByType.get(type) || new Set<Listener>();
    set.add(handler);
    this.listenersByType.set(type, set);
  }

  removeListener(type?: string, handler?: Listener) {
    if (!type) {
      this.listenersByType.clear();
      return;
    }
    const set = this.listenersByType.get(type);
    if (!set) return;
    if (!handler) {
      set.clear();
      return;
    }
    set.delete(handler);
  }
}

export class MockWebMidi {
  enabled: boolean;
  inputs: MockMidiInput[];
  private connectedListeners: Set<Listener>;
  private disconnectedListeners: Set<Listener>;

  constructor(devices: MockMidiDeviceInfo[]) {
    this.enabled = false;
    this.inputs = devices.map((d) => new MockMidiInput(d));
    this.connectedListeners = new Set();
    this.disconnectedListeners = new Set();
  }

  enable(cb?: (err: Error | null) => void) {
    this.enabled = true;
    if (typeof cb === "function") cb(null);
  }

  disable() {
    this.enabled = false;
  }

  addListener(type: "connected" | "disconnected", handler: Listener) {
    if (typeof handler !== "function") return;
    if (type === "connected") this.connectedListeners.add(handler);
    if (type === "disconnected") this.disconnectedListeners.add(handler);
  }

  removeListener(type: "connected" | "disconnected", handler: Listener) {
    if (type === "connected") this.connectedListeners.delete(handler);
    if (type === "disconnected") this.disconnectedListeners.delete(handler);
  }

  getInputById(id: string) {
    return this.inputs.find((i) => i.id === id) || null;
  }

  getInputByName(name: string) {
    return this.inputs.find((i) => i.name === name) || null;
  }

  resetDevices(devices: MockMidiDeviceInfo[]) {
    this.inputs = devices.map((d) => new MockMidiInput(d));
  }

  disconnectDevice(id: string) {
    const input = this.getInputById(id);
    this.inputs = this.inputs.filter((i) => i.id !== id);
    for (const fn of Array.from(this.disconnectedListeners)) {
      try {
        fn({ port: input ? { id: input.id, name: input.name } : { id, name: "" } });
      } catch {}
    }
  }

  reconnectDevice(device: MockMidiDeviceInfo) {
    const exists = this.inputs.some((i) => i.id === device.id);
    if (!exists) {
      this.inputs.push(new MockMidiInput(device));
    }
    const input = this.getInputById(device.id);
    for (const fn of Array.from(this.connectedListeners)) {
      try {
        fn({ port: input ? { id: input.id, name: input.name } : { id: device.id, name: device.name } });
      } catch {}
    }
  }
}

export const getOrCreateGlobalMockWebMidi = (initialDevices: MockMidiDeviceInfo[]) => {
  const g = globalThis as unknown as { __nwWrldMockWebMidi?: MockWebMidi };
  if (g.__nwWrldMockWebMidi) return g.__nwWrldMockWebMidi;
  g.__nwWrldMockWebMidi = new MockWebMidi(initialDevices);
  return g.__nwWrldMockWebMidi;
};

