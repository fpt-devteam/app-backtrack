const metrics = {
  baseline: 8,

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md2: 12,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },

  borderRadius: {
    none: 0,
    sm: 8,
    primary: 16,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    full: 9999,
  },

  touchTarget: {
    min: 44,
    defaultHitSlop: 8,
  },

  layout: {
    controlHeight: {
      xs: 24,
      sm: 24,
      md: 44,
      lg: 52,
      xl: 56,
    },

    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  motion: {
    duration: {
      fast: 100,
      normal: 200,
      slow: 300,
      slower: 500,
    },
  },

  tabBar: {
    height: 75,
    iconSize: 28,
    labelSize: 11,
    indicatorHeight: 3,
    indicatorWidth: 60,
    padding: {
      top: 0,
      bottom: 16,
    },
    createButton: {
      iconBackgroundSize: 28,
      iconBackgroundRadius: 6,
    },
  },

  shadows: {
    level1: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    },

    level2: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    },

    sm: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    },
    md: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    },
    lg: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    },

    tabBar: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    },
  },
};

module.exports = { metrics };
