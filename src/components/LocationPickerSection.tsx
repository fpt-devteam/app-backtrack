import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const LocationPickerSection = () => {
  return (
    <View style={styles.container}>
      <Text>LocationPickerSection</Text>
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

export default LocationPickerSection