import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  map: {
    width: '100%',
    height: '70%',
    borderRadius: 12,
  },

  button: {
    marginTop: 12,
    borderColor: '#3B82F6',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 8,
  },

  searchContainer: {
    zIndex: 999,
    elevation: 999,
    marginBottom: 8,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  searchListView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 6,
    backgroundColor: "#fff",
  },

  mapContainer: {
    height: 300,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },


})