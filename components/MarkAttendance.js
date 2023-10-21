import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function MarkAttendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [attStatus, setAttStatus] = useState('Present');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            const chosenDate = selectedDate.toISOString().slice(0, 10);
            setSelectedDate(chosenDate);
            console.log("Updated selectedDate for", Platform.OS, ":", chosenDate);
        }
        setShow(Platform.OS === 'ios');
    };
    
    const showDatepicker = () => {
        setShow(true);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://192.168.29.245:5000/employees');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleSubmit = () => {

        fetch('http://192.168.29.245:5000/mark_attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emp_name: selectedEmployee,
                date: selectedDate,
                att_status: attStatus
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                Alert.alert('Success', 'Attendance has been punched successfully!');
            } else {
                Alert.alert('Error', 'Failed to punch attendance. Attendance is already punced for the user for today.');
            }
        })
        .catch(error => console.error(error));
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text>Employee:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedEmployee}
                        onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
                    >
                        {employees.map((employee, index) => (
                            <Picker.Item key={index} label={employee.emp_name} value={employee.emp_name} />
                        ))}
                    </Picker>
                </View>
    
                <Text>Attendance Status:</Text>
                <Picker
                    selectedValue={attStatus}
                    onValueChange={(itemValue) => setAttStatus(itemValue)}
                >
                    <Picker.Item label="Present" value="Present" />
                    <Picker.Item label="Absent" value="Absent" />
                </Picker>
    
                <Text>Date:</Text>
                <Button onPress={showDatepicker} title="Select a Date" />
    
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(selectedDate)}
                        mode={'date'}
                        display="default"
                        onChange={onChange}
                    />
                )}
    
                <Text>Selected Date: {selectedDate}</Text>
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        padding: 20,
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        height: 50,  // Set a fixed height for picker container
    },
    picker: {
        width: '100%',
        height: '100%',  // Ensure it takes the full height of its container
    },
});
