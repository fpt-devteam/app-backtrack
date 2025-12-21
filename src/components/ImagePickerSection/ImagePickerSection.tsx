import { ImageAsset } from '@/src/types/firebase.type';
import * as ImagePicker from 'expo-image-picker';
import { launchImageLibraryAsync, type ImagePickerOptions } from 'expo-image-picker';
import React from 'react';
import { Alert, Button, Image, Linking, Platform, View } from 'react-native';
import { styles } from './styles';

const ImagePickerSection = ({ images, pickImages }: { images: ImageAsset[], pickImages: (images: ImageAsset[]) => void }) => {
  const ensureMediaPermission = async () => {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status === ImagePicker.PermissionStatus.GRANTED) return true;

    if (canAskAgain) {
      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const isGranted = request.status === ImagePicker.PermissionStatus.GRANTED;
      return isGranted;
    }

    Alert.alert('Permission required', 'Please enable photo access in Settings to upload images.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );

    return false;
  };

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
      const imageAssets = result.assets.map((asset) => ({ ...asset, type: 'image' } as ImageAsset));
      pickImages(imageAssets);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={handlePickImages} />

      {images.length > 0 && images.map((image) => (
        <View key={image.uri} >
          <Image source={{ uri: image.uri }} style={styles.image} />
        </View>
      ))}
    </View>
  )
}

export default ImagePickerSection