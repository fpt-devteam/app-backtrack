const metrics = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    primary: 6,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
  },

  layout: {
    controlHeight: {
      xs: 16,
      sm: 24,
      md: 32,
      lg: 40,
      xl: 48,
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
    sm: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    },
    md: {
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
    lg: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    },
    tabBar: {
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    },
  },
};

module.exports = { metrics };
