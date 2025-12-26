import { ReportFilters } from '@/src/features/report/types/report.type';
import { Nullable } from '@/src/shared/types/global.type';
import { GoogleMapDetailLocation } from '@/src/shared/types/location.type';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ReportType } from '../../types/report.enum';
import { styles } from './styles';

type ReportFiltersProps = {
  filters: ReportFilters;
  onApplyFilters: (filters: ReportFilters) => void;
};

const ReportFilters = ({
  filters,
  onApplyFilters
}: ReportFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<ReportFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  }

  const handleClear = () => {
    const clearedFilters: ReportFilters = {
      authorId: null,
      reportType: null,
      longitude: null,
      latitude: null,
      radiusInKm: null,
      page: 1,
      pageSize: 10,
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  }

  const handlePostTypeSelect = (postType: Nullable<ReportType>) => {
    setLocalFilters((prev) => ({
      ...prev,
      postType,
    }));
  };

  const handleLocationSelect = (data: GoogleMapDetailLocation) => {
    const { latitude, longitude } = data.location;
    setLocalFilters((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Post Type Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Report Type</Text>
          <View style={styles.typeButtonsContainer}>
            {/* All */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                localFilters.reportType === null && styles.typeButtonActive,
              ]}
              onPress={() => handlePostTypeSelect(null)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  localFilters.reportType === null && styles.typeButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {/* Lost */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                styles.lostButton,
                localFilters.reportType === ReportType.LOST && styles.typeButtonActive,
              ]}
              onPress={() => handlePostTypeSelect(ReportType.LOST)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  localFilters.reportType === ReportType.LOST && styles.typeButtonTextActive,
                ]}
              >
                Lost
              </Text>
            </TouchableOpacity>

            {/* Found */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                styles.foundButton,
                localFilters.reportType === ReportType.FOUND && styles.typeButtonActive,
              ]}
              onPress={() => handlePostTypeSelect(ReportType.FOUND)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  localFilters.reportType === ReportType.FOUND && styles.typeButtonTextActive,
                ]}
              >
                Found
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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

export default ReportFilters;
