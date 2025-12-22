import { PostFilters, PostType } from '@/src/features/report/types/report.type';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles';

interface PostFiltersProps {
  filters: PostFilters;
  onApplyFilters: (filters: PostFilters) => void;
}

const PostFiltersComponent: React.FC<PostFiltersProps> = ({ filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState<PostFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    const clearedFilters: PostFilters = {
      postType: null,
      searchTerm: '',
      location: null,
      radiusInKm: null,
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handlePostTypeSelect = (type: string | null) => {
    setLocalFilters((prev) => ({ ...prev, postType: type }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Post Type Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Report Type</Text>
          <View style={styles.typeButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                localFilters.postType === null && styles.typeButtonActive,
              ]}
              onPress={() => handlePostTypeSelect(null)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  localFilters.postType === null && styles.typeButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                styles.lostButton,
                localFilters.postType === PostType.Lost && styles.typeButtonActive,
              ]}
              onPress={() => handlePostTypeSelect(PostType.Lost)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  localFilters.postType === PostType.Lost && styles.typeButtonTextActive,
                ]}
              >
                Lost
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                styles.foundButton,
                localFilters.postType === PostType.Found && styles.typeButtonActive,
              ]}
              onPress={() => handlePostTypeSelect(PostType.Found)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  localFilters.postType === PostType.Found && styles.typeButtonTextActive,
                ]}
              >
                Found
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Term Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Search</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Search by item name, description..."
            value={localFilters.searchTerm}
            onChangeText={(text) =>
              setLocalFilters((prev) => ({ ...prev, searchTerm: text }))
            }
            placeholderTextColor="#999"
          />
        </View>

        {/* Location Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Location Filter</Text>
          {localFilters.location ? (
            <View style={styles.locationCard}>
              <Text style={styles.locationText}>
                📍 Lat: {localFilters.location.latitude.toFixed(4)}
              </Text>
              <Text style={styles.locationText}>
                📍 Lng: {localFilters.location.longitude.toFixed(4)}
              </Text>
              <TouchableOpacity
                style={styles.removeLocationButton}
                onPress={() =>
                  setLocalFilters((prev) => ({ ...prev, location: null, radiusInKm: null }))
                }
              >
                <Text style={styles.removeLocationText}>Remove Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.infoText}>
              Location filtering is not yet configured. You can add a location picker here.
            </Text>
          )}
        </View>

        {/* Radius Filter (only if location is set) */}
        {localFilters.location && (
          <View style={styles.section}>
            <Text style={styles.label}>Radius (km)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 5"
              value={localFilters.radiusInKm?.toString() || ''}
              onChangeText={(text) => {
                const value = Number.parseFloat(text);
                setLocalFilters((prev) => ({
                  ...prev,
                  radiusInKm: Number.isNaN(value) ? null : value,
                }));
              }}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};



export default PostFiltersComponent;
