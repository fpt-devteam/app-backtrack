import { PostFilters, PostType } from '@/src/features/post/types';
import { LocationField } from '@/src/shared/components';
import BottomSheet from '@/src/shared/components/ui/BottomSheet';
import { GoogleMapDetailLocation } from '@/src/shared/types';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { yupResolver } from '@hookform/resolvers/yup';
import { MagnifyingGlass, SlidersHorizontal } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import * as yup from 'yup';


const filterSchema = yup.object({
  searchTerm: yup.string().nullable().defined(),
  postType: yup.mixed<PostType>().nullable().defined(),
  location: yup.mixed<GoogleMapDetailLocation>().nullable().defined(),
});

type FilterFormSchema = yup.InferType<typeof filterSchema>;

type PostFiltersProps = {
  filters: PostFilters;
  onFiltersChange: (filters: PostFilters) => void;
}

const PostFiltersComponent = ({ filters, onFiltersChange }: PostFiltersProps) => {
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
    onFiltersChange({});
  };

  const onSubmit: SubmitHandler<FilterFormSchema> = async (data: FilterFormSchema) => {
    const newFilters: PostFilters = {
      postType: data.postType ?? undefined,
      searchTerm: data.searchTerm ?? undefined,
      location: {
        latitude: data.location?.location.latitude ? Number(data.location.location.latitude.toFixed(4)) : undefined,
        longitude: data.location?.location.longitude ? Number(data.location.location.longitude.toFixed(4)) : undefined,
      },
      radiusInKm: (data.location?.location.latitude && data.location?.location.longitude) ? 10 : undefined,
    };
    setIsVisible(false);
    onFiltersChange(newFilters);
  };

  return (
    <View className="flex-row items-center px-4 py-3">
      {/* Search Input */}
      <View className="flex-1 flex-row items-center rounded-full bg-white px-3 py-2 mr-3">
        <MagnifyingGlass size={16} color="#64748B" />
        <Controller
          control={control}
          name="searchTerm"
          render={({ field: { value, onChange } }) => (
            <TextInput
              className="ml-2 flex-1 text-sm text-slate-900"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Search..."
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              onBlur={handleSubmit(onSubmit)}
            />
          )} />
      </View>

      {/* Filter button */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)} activeOpacity={0.85}
        className="h-12 w-12 items-center justify-center rounded-full bg-sky-500"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }}
      >
        <SlidersHorizontal size={18} color="#fff" />
      </TouchableOpacity>

      {/* ===== FILTER BOTTOM SHEET ===== */}
      <BottomSheet
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        snapPoints={['80%']}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
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
                      {
                        value: 'all',
                        label: 'All',
                        style: {
                          backgroundColor: (value ?? 'all') === 'all' ? '#3B82F6' : 'white',
                        },
                        labelStyle: {
                          color: (value ?? 'all') === 'all' ? 'white' : 'black'
                        }
                      },
                      {
                        value: PostType.Lost,
                        label: 'Lost',
                        style: {
                          backgroundColor: value === PostType.Lost ? '#3B82F6' : 'white',
                        },
                        labelStyle: {
                          color: value === PostType.Lost ? 'white' : 'black'
                        }
                      },
                      {
                        value: PostType.Found,
                        label: 'Found',
                        style: {
                          backgroundColor: value === PostType.Found ? '#3B82F6' : 'white',
                        },
                        labelStyle: {
                          color: value === PostType.Found ? 'white' : 'black'
                        }
                      },
                    ]}
                  />
                )}
              />
            </View>

            {/* Location Filter */}
            <View>
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value } }) => (
                  <LocationField value={value} onChange={onChange} />
                )}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-6 mb-6">
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
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default PostFiltersComponent;
