import { PostFilters } from '@/src/features/post/types/post.type';
import { LocationField } from '@/src/shared/components';
import { GoogleMapDetailLocation } from '@/src/shared/types/location.type';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { SegmentedButtons } from 'react-native-paper';
import * as yup from 'yup';
import { PostType } from '../types';

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

const PostFiltersComponent = ({ filters, onFilterChange }: PostFiltersProps) => {
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
    reset({
      searchTerm: null,
      postType: null,
      location: null,
    });
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
    <View className="flex-row items-center px-4 py-3">
      {/* Search Input */}
      <View className="flex-1 flex-row items-center rounded-full bg-white px-3 py-2 mr-3">
        <Ionicons name="search" size={16} color="#64748B" />
        <Controller
          control={control}
          name="searchTerm"
          render={({ field: { value, onChange } }) => (
            <TextInput
              className="ml-2 flex-1 text-sm text-slate-900"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Search items..."
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              onBlur={handleSubmit(onSubmit)}
            />
          )} />
      </View>

      {/* Filter button */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        activeOpacity={0.85}
        className="h-12 w-12 items-center justify-center rounded-full bg-sky-500"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }}
      >
        <Ionicons name="options-outline" size={18} color="#fff" />
      </TouchableOpacity>

      {/* ===== FILTER MODAL ===== */}
      <View className="bg-white max-h-[520px]">
        <Modal
          isVisible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
          onBackButtonPress={() => setIsVisible(false)}
          className="m-0 justify-end"
        >
          <View className="bg-white border border-gray-300 rounded-xl p-3">
            <ScrollView contentContainerClassName="p-4">
              {/* Post Type Filter */}
              <View className="mb-5 gap-2">
                <Text className="text-base font-semibold text-black mb-2">Post Type</Text>
                <Controller
                  control={control}
                  name="postType"
                  render={({ field: { onChange, value } }) => (
                    <SegmentedButtons
                      value={value ?? 'all'}
                      onValueChange={(selectedValue) => onChange(selectedValue === 'all' ? null : selectedValue)}
                      buttons={[
                        { value: 'all', label: 'All' },
                        { value: PostType.Lost, label: 'Lost' },
                        { value: PostType.Found, label: 'Found' },
                      ]}
                    />
                  )}
                />
              </View>

              {/* Location Filter */}
              <View>
                <Text className="text-base font-semibold text-black mb-2">Location</Text>
                <Controller
                  control={control}
                  name="location"
                  render={({ field: { onChange, value } }) => (
                    <LocationField value={value} onChange={onChange} />
                  )}
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  className="flex-1 h-11 rounded-[10px] bg-blue-500 items-center justify-center"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-base font-semibold text-white">Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 h-11 rounded-[10px] border border-red-500 items-center justify-center bg-white"
                  onPress={handleClear}
                >
                  <Text className="text-base font-semibold text-red-500">Clear All</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default PostFiltersComponent;
