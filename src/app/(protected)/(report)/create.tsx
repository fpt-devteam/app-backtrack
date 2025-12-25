import ReportForm from '@/src/features/report/components/ReportForm/ReportForm';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CreateReportScreen = () => {
  return (
    <View style={styles.container}>
      <ReportForm
        mode={'create' as ('create' | 'edit')}
        initialData={null} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreateReportScreen 