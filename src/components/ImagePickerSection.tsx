import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import React from 'react';
import { Alert, Button, Image, StyleSheet, View } from 'react-native';
import { ImageAsset } from '../types/firebase.type';

const ImagePickerSection = ({ images, pickImages }: { images: ImageAsset[], pickImages: (images: ImageAsset[]) => void }) => {

  const handlePickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

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

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
})

export default ImagePickerSection