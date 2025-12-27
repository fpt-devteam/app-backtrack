import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    margin: 16,
  },

  imageWrap: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 170,
  },

  imageFallback: {
    width: "100%",
    height: 170,
    backgroundColor: "#E2E8F0",
  },

  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeLost: {
    backgroundColor: "rgba(249, 115, 22, 0.18)",
  },
  badgeFound: {
    backgroundColor: "rgba(22, 163, 74, 0.18)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#F97316",
  },

  body: {
    padding: 16,
    gap: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  metaText: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
  },

  button: {
    marginTop: 6,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#169BD7",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  badgeInline: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeTextInline: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  badgeTextLost: {
    color: "#F97316",
  },

  badgeTextFound: {
    color: "#16A34A",
  },
});
