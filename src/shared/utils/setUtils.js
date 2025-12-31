const getActiveSet = (userData, activeSetId) => {
  if (
    !userData ||
    !Array.isArray(userData.sets) ||
    userData.sets.length === 0
  ) {
    return null;
  }

  if (activeSetId) {
    const activeSet = userData.sets.find((set) => set.id === activeSetId);
    if (activeSet) {
      return activeSet;
    }
  }

  return userData.sets[0];
};

const getActiveSetTracks = (userData, activeSetId) => {
  const activeSet = getActiveSet(userData, activeSetId);
  return activeSet?.tracks || [];
};

const migrateToSets = (userData) => {
  if (!userData) {
    return {
      config: {},
      sets: [],
    };
  }

  if (Array.isArray(userData.sets)) {
    return userData;
  }

  if (Array.isArray(userData.tracks)) {
    const migratedData = {
      ...userData,
      config: {
        ...userData.config,
        activeSetId: "set_1",
      },
      sets: [
        {
          id: "set_1",
          name: "Set 1",
          tracks: userData.tracks,
        },
      ],
    };
    delete migratedData.tracks;
    return migratedData;
  }

  return {
    ...userData,
    config: {
      ...userData.config,
      activeSetId: null,
    },
    sets: [],
  };
};

module.exports = {
  getActiveSet,
  getActiveSetTracks,
  migrateToSets,
};
