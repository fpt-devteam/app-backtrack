import { ImagePickerAsset, launchImageLibraryAsync, type ImagePickerOptions } from 'expo-image-picker';
import React from 'react';
import { Button, Image, View } from 'react-native';
import { ensureMediaPermission } from '../../services';
import { styles } from './styles';

type ImageFieldProps = {
  value: ImagePickerAsset[];
  onChange: (value: ImagePickerAsset[]) => void;
  disabled?: boolean;
}

const ImageField = ({ value, onChange, disabled = false }: ImageFieldProps) => {
  const handlePickImages = async () => {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    const options = {
      mediaTypes: ['images'],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    } as ImagePickerOptions;

    const result = await launchImageLibraryAsync(options);
    if (!result.canceled) {
      const imageAssets = result.assets.map((asset) => ({
        ...asset,
        type: 'image'
      } as ImagePickerAsset));
      onChange(imageAssets);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={handlePickImages} />

      {value.length > 0 && value.map((image) => (
        <View key={image.uri} >
          <Image source={{ uri: image.uri }} style={styles.image} />
        </View>
      ))}
    </View>
  )
}
export default ImageField;
