import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    borderColor: "blue",
  },

  label: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },

  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(9, 63, 189, 0.14)",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  valueText: {
    fontSize: 15,
    color: "#0F172A",
  },

  placeholderText: {
    fontSize: 15,
    color: "#94A3B8",
  },

  rightIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },

  inputPressed: {
    borderColor: "rgba(37, 99, 235, 0.35)",
  },

  inputDisabled: {
    opacity: 0.6,
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },

  sheet: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    padding: 12,
  },

  sheetHeader: {
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    backgroundColor: "#FFFFFF",
    marginLeft: 10,
    marginBottom: 8,
  },
  doneBtn: {
    backgroundColor: "#0EA5E9",
    borderColor: "rgba(14, 165, 233, 0.35)",
  },
  headerBtnTextPrimary: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerBtnTextSecondary: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  pickerBlock: {
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 6,
  },
  pickerCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  picker: {
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  errorBox: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#F87171",
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  errorText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
});

export default styles;
