import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Lending() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("Personal");
    const [dateTook, setDateTook] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        // Fetch employees from emp_details table
        fetch('http://192.168.29.245:5000/employees') // Adjust the endpoint accordingly
        .then(response => response.json())
        .then(data => setEmployees(data))
        .catch(error => console.error("Error fetching employees:", error));
    }, []); 

    const handleSubmit = () => {
        // Logic to save data to lend_details table
        fetch('http://192.168.29.245:5000/lend_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emp_name: selectedEmployee,
                amount: amount,
                reason: reason,
                date_took: dateTook
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Alert.alert("Success", "Lending details saved successfully!");
    
                // Reset the form fields
                setSelectedEmployee("");
                setAmount("");
                setReason(""); // or whatever default you have
                setDateTook("");
            } else {
                Alert.alert("Error", data.message || "Error saving lending details.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Alert.alert("Error", "There was an issue. Please check the console for more details.");
        });
    };
    
    
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateTook;
        setShowDatePicker(Platform.OS === 'ios');  // to handle visibility for iOS
        const offset = currentDate.getTimezoneOffset();
        const localDate = new Date(currentDate.getTime() - offset * 60 * 1000);
        setDateTook(localDate.toISOString().split('T')[0]);

    };

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <Picker
                    selectedValue={selectedEmployee}
                    onValueChange={(itemValue, itemIndex) => setSelectedEmployee(itemValue)}
                    style={styles.input}
                >
                    {employees.map(employee => (
                        <Picker.Item 
                            key={employee.id}
                            label={employee.emp_name}
                            value={employee.emp_name}
                        />
                    ))}
                </Picker>

                <TextInput 
                    placeholder="Amount"
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <Picker
                    selectedValue={reason}
                    onValueChange={setReason}
                    style={styles.input}
                >
                    <Picker.Item label="Personal" value="personal" />
                    <Picker.Item label="Medical" value="medical" />
                </Picker>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode={"date"}
                        onChange={handleDateChange}
                    />
                )}
                <TextInput
                    placeholder="Date Took (YYYY-MM-DD)"
                    value={dateTook}
                    onFocus={() => setShowDatePicker(true)}
                    style={styles.input}
                />

                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    container: {
        width: '90%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 3,
        borderRadius: 5,
    }
});