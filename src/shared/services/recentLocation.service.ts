import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LatLng } from "react-native-maps";

export type RecentLocationSearch = {
  readonly placeId: string;
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
  readonly updatedAt: number;
};

const STORAGE_KEY = "recent_location_searches_v1";
const MAX_RECENT = 10;

export const RecentLocationService = {
  async load(): Promise<readonly RecentLocationSearch[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed;
    } catch (error) {
      console.error("Failed to load recent location searches:", error);
      return [];
    }
  },

  async save(list: readonly RecentLocationSearch[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.error("Failed to save recent location searches:", error);
    }
  },

  async add(item: {
    readonly placeId: string;
    readonly label: string;
    readonly location: LatLng;
  }): Promise<readonly RecentLocationSearch[]> {
    const current = await this.load();

    const newItem: RecentLocationSearch = {
      placeId: item.placeId,
      label: item.label,
      lat: item.location.latitude,
      lng: item.location.longitude,
      updatedAt: Date.now(),
    };

    // Remove duplicate (same placeId)
    const filtered = current.filter((x) => x.placeId !== item.placeId);

    // Add to front
    const updated = [newItem, ...filtered].slice(0, MAX_RECENT);

    await this.save(updated);
    return updated;
  },

  async remove(placeId: string): Promise<readonly RecentLocationSearch[]> {
    const current = await this.load();
    const updated = current.filter((x) => x.placeId !== placeId);
    await this.save(updated);
    return updated;
  },

  async clear(): Promise<void> {
    await this.save([]);
  },
};
