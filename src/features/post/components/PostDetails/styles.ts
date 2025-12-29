import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  scrollContent: {
    paddingBottom: 140,
  },

  coverWrap: {
    width: '100%',
    height: 230,
    backgroundColor: '#E2E8F0',
  },

  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  sheet: {
    marginTop: -22,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.08)',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  description: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
  },

  infoGroup: {
    marginTop: 14,
    gap: 10,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  infoIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoTextCol: {
    flex: 1,
    gap: 2,
  },

  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },

  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },

  infoSubValue: {
    fontSize: 12,
    color: '#64748B',
  },

  mapCard: {
    marginTop: 14,
    height: 120,
    borderRadius: 14,
    backgroundColor: '#EAF6FF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(37,99,235,0.15)',
    overflow: 'hidden',
    position: 'relative',
  },

  mapCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewMapBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.12)',
  },

  viewMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 16,
    paddingTop: 10,

    backgroundColor: '#F7F8FA',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,23,42,0.08)',
  },

  primaryBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  reportBtn: {
    marginTop: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  reportText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
