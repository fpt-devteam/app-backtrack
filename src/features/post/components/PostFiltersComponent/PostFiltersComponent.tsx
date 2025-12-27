import { PostFilters } from '@/src/features/post/types/post.type';
import { LocationField } from '@/src/shared/components';
import { GoogleMapDetailLocation } from '@/src/shared/types/location.type';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Icon, SegmentedButtons, TextInput } from 'react-native-paper';
import * as yup from 'yup';
import { PostType } from '../../types';
import { styles } from './styles';

const filterSchema = yup.object({
  searchTerm: yup.string().nullable().defined(),
  postType: yup.mixed<PostType>().nullable().defined(),
  location: yup.mixed<GoogleMapDetailLocation>().nullable().defined(),
});

type FilterFormSchema = yup.InferType<typeof filterSchema>;

type PostFiltersProps = {
  filters: PostFilters;
  onFilterChange: (filters: PostFilters) => void;
}

export const PostFiltersComponent = ({ filters, onFilterChange }: PostFiltersProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { control, handleSubmit, reset } = useForm<FilterFormSchema>({
    defaultValues: {
      searchTerm: null,
      postType: null,
      location: null,
    },
    resolver: yupResolver(filterSchema),
    mode: 'onSubmit',
  });

  const handleClear = () => {
    reset();
    onFilterChange({});
  };

  const onSubmit: SubmitHandler<FilterFormSchema> = async (data: FilterFormSchema) => {

    const newFilters: PostFilters = {
      postType: data.postType ?? undefined,
      searchTerm: data.searchTerm ?? undefined,
      location: {
        latitude: data.location?.location.latitude ? Number(data.location.location.latitude.toFixed(4)) : undefined,
        longitude: data.location?.location.longitude ? Number(data.location.location.longitude.toFixed(4)) : undefined,
      },
      radiusInKm: (data.location?.location.latitude && data.location?.location.longitude) ? 10 : undefined, // default radius
    };
    setIsVisible(false);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        {/* Search Input */}
        <View style={styles.searchPill}>
          <View style={styles.searchIconWrap}>
            <Icon source="magnify" size={18} color="#94A3B8" />
          </View>

          <View style={styles.searchInputWrap}>
            <Controller
              control={control}
              name="searchTerm"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Search items..."
                  placeholderTextColor="#94A3B8"
                  mode="flat"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  style={styles.searchInput}
                  contentStyle={styles.searchInputContent}
                  returnKeyType="search"
                  onBlur={handleSubmit(onSubmit)}
                />
              )}
            />
          </View>
        </View>

        {/* Filter button */}
        <TouchableOpacity
          style={styles.filterFab}
          activeOpacity={0.9}
          onPress={() => setIsVisible(true)}
        >
          <Icon source="tune-variant" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ===== FILTER MODAL ===== */}
      <View style={styles.rootModal}>
        <Modal
          isVisible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
          onBackButtonPress={() => setIsVisible(false)}
          style={styles.modal}
        >
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
              {/* Post Type Filter */}
              <View style={styles.section}>
                <Text style={styles.label}>Post Type</Text>
                <Controller
                  control={control}
                  name="postType"
                  render={({ field: { onChange, value } }) => (
                    <SegmentedButtons
                      value={value ?? null}
                      onValueChange={onChange}
                      buttons={[
                        { value: null, label: 'All' },
                        { value: PostType.Lost, label: 'Lost' },
                        { value: PostType.Found, label: 'Found' },
                      ]}
                    />
                  )}
                />
              </View>

              {/* Location Filter */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Location</Text>
                <Controller
                  control={control}
                  name="location"
                  render={({ field: { onChange, value } }) => (
                    <LocationField value={value} onChange={onChange} />
                  )}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.applyButton} onPress={handleSubmit(onSubmit)}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
};
