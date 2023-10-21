import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function SideMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Attendance List" onPress={() => navigation.navigate('AttendanceList')} />
      <Button title="Salary Details" onPress={() => navigation.navigate('SalaryDetails')} />
      {/* Add more navigation buttons as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  }
});

