import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /**
   * ===== TOP SEARCH BAR (design like image) =====
   */
  root: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  searchPill: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.08)',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  searchIconWrap: {
    width: 42,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchInputWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },

  searchInput: {
    backgroundColor: 'transparent',
    height: 44,
  },

  searchInputContent: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
  },

  filterFab: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  /**
   * ===== MODAL (kept from your existing styles) =====
   */
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },

  rootModal: {
    backgroundColor: '#FFF',
    maxHeight: 520,
  },

  container: {
    backgroundColor: '#FFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  content: {
    padding: 16,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15,23,42,0.08)',
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  sheetClose: {
    fontSize: 18,
    opacity: 0.7,
  },

  section: {
    marginBottom: 20,
    gap: 8,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },

  segment: {
    alignSelf: 'stretch',
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#FFF',
  },

  fieldContainer: {
  },

  infoText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#DC2626',
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  clearButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },

  applyButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  sheet: {},
  sheetContent: {},
});
