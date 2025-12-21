import { ImageAsset } from '@/src/types/firebase.type';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import React from 'react';
import { Alert, Button, Image, Linking, Platform, View } from 'react-native';
import { styles } from './styles';

const ImagePickerSection = ({ images, pickImages }: { images: ImageAsset[], pickImages: (images: ImageAsset[]) => void }) => {
  const ensureMediaPermission = async (): Promise<boolean> => {
    const { status, canAskAgain } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    if (canAskAgain) {
      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return request.status === 'granted';
    }

    Alert.alert(
      'Permission required',
      'Please enable photo access in Settings to upload images.',
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

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      console.log('Pick images ok', result);

      const imageAssets: ImageAsset[] = result.assets.map((asset: ImagePickerAsset) => ({
        ...asset,
        type: 'image',
      }));

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