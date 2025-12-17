import ImagePickerSection from '@/src/components/ImagePickerSection';
import LocationPickerSection from '@/src/components/LocationPickerSection';
import { useUploadImage } from '@/src/hooks/useUploadImage';
import { ImageAsset } from '@/src/types/firebase.type';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const CreateReportScreen = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);

  const pickImages = (newImages: ImageAsset[]) => setImages([...images, ...newImages]);
  const { uploadImages } = useUploadImage();

  const clear = () => {
    setImages([]);
  }

  const handleSubmitReport = async () => {
    //validate images
    console.log('Images: ', images);
    const uploadRes = await uploadImages(images);
    console.log(uploadRes);

    const imageUrls = uploadRes.map(res => res.downloadURL);
    console.log('Image URLs: ', imageUrls);
    //
    console.log("Submit report successfully!");
    clear();
  }

  return (
    <View>
      <ImagePickerSection images={images} pickImages={pickImages} />
      <Text style={styles.container}>Item Detail Form</Text>
      <LocationPickerSection />
      <Button title="Submit Report" onPress={handleSubmitReport} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10,
  }
})

export default CreateReportScreen 