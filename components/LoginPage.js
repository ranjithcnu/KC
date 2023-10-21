import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Image, Button } from 'react-native';

export default function LoginPage({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.29.245:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.success) {
        navigation.navigate('Dashboard');
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  const { container, input } = styles;

  return (
    <View style={styles.container}>
    <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
            <Image source={require('../assets/rjimg.png')} style={styles.logo} />
        </View>
        <TextInput placeholder="Name" onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Password" onChangeText={setPassword} style={styles.input} />
        <Button title="Login" onPress={handleLogin} />
    </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(240,240,240)',
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 85,
    overflow: 'hidden',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    width: '100%',
    height: '70%',
    alignItems: 'center', // This ensures items are centered horizontally
    padding: 20, 
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // This is an example of a slightly transparent white
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
  }
});