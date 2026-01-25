import AsyncStorage from "@react-native-async-storage/async-storage";

export function createAsyncStorageKey<TKey extends string, TValue>(key: TKey) {
  return {
    key,

    async get() {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;

      try {
        return JSON.parse(raw) as TValue;
      } catch {
        return null;
      }
    },

    async set(value: TValue) {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },

    async remove() {
      await AsyncStorage.removeItem(key);
    },

    async clear() {
      await this.remove();
    },
  };
}
