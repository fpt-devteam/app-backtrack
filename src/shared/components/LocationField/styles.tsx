import { StyleSheet } from "react-native";

const SIZE = {
  controlH: 44,
  iconBtn: 44,
  leftIconW: 36,
};

const RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
};

const COLORS = {
  text: "#0F172A",
  surfaceSoft: "#F1F5F9",
  surface: "#FFFFFF",
  borderSoft: "rgba(15,23,42,0.08)",
};

export const styles = StyleSheet.create({
  container: {
    padding: 12,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchCol: {
    flex: 1,
    minWidth: 0,
  },

  searchInputContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  searchLeftIcon: {
    height: SIZE.controlH,
    width: SIZE.leftIconW,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surfaceSoft,
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },

  searchInput: {
    height: SIZE.controlH,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 0,
    borderWidth: 0,
    borderTopRightRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    paddingLeft: 0,
    paddingRight: 12,
    color: COLORS.text,
  },

  searchListView: {
    marginTop: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    overflow: "hidden",
  },

  searchRowItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  searchSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.borderSoft,
  },

  searchDesc: {
    color: COLORS.text,
  },

  currentBtnIcon: {
    width: SIZE.iconBtn,
    height: SIZE.iconBtn,
    margin: 0,
    padding: 0,
    borderRadius: RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
  },

  mapContainer: {
    height: 300,
    marginTop: 12,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "70%",
    borderRadius: RADIUS.lg,
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
