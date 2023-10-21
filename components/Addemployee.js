import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';


export default function AddEmployee() {
    const [empName, setEmpName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [dayWage, setDayWage] = useState("");




    const handleSubmit = () => {
        // Logic to save employee data
        fetch('http://192.168.29.245:5000/add_employee', {  // Adjust the endpoint accordingly
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emp_name: empName,
                mobile: mobile,
                address: address,
                day_wage: dayWage
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert("Success", "Employee added successfully!");
            } else {
                Alert.alert("Error", data.message || "Error adding employee.");
            }
        })
        .catch(error => console.error("Error adding employee:", error));
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Employee Name" onChangeText={setEmpName} style={styles.input} />
            <TextInput placeholder="Mobile" onChangeText={setMobile} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Address" onChangeText={setAddress} style={styles.input} />
            <TextInput placeholder="Day Wage" onChangeText={setDayWage} style={styles.input} keyboardType="numeric" />
            <Button title="Add Employee" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,
        padding: 5
    }
});
