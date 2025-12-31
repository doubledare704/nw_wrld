/**
 * OSC Naming Convention Validation
 *
 * Industry standard OSC addressing:
 * - /track/... → Track selection only
 * - /ch/... or /channel/... → Channel triggers only
 */

function isValidOSCTrackAddress(address) {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  return trimmed.startsWith("/track/") || trimmed === "/track";
}

function isValidOSCChannelAddress(address) {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  return trimmed.startsWith("/ch/") || trimmed.startsWith("/channel/");
}

function isValidOSCAddress(address) {
  return isValidOSCTrackAddress(address) || isValidOSCChannelAddress(address);
}

function getOSCAddressType(address) {
  if (isValidOSCTrackAddress(address)) return "track";
  if (isValidOSCChannelAddress(address)) return "channel";
  return null;
}

function validateOSCAddress(address) {
  const trimmed = address?.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: "OSC address cannot be empty",
    };
  }

  if (!trimmed.startsWith("/")) {
    return {
      valid: false,
      error: "OSC address must start with '/'",
    };
  }

  if (!isValidOSCAddress(trimmed)) {
    return {
      valid: false,
      error: "OSC address must start with '/track/' or '/ch/' (or '/channel/')",
      suggestion:
        "Use '/track/name' for track selection or '/ch/name' for channel triggers",
    };
  }

  return {
    valid: true,
    type: getOSCAddressType(trimmed),
    address: trimmed,
  };
}

module.exports = {
  isValidOSCTrackAddress,
  isValidOSCChannelAddress,
  isValidOSCAddress,
  getOSCAddressType,
  validateOSCAddress,
};
