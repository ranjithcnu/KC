import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function EmployeeDetails() {
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const fetchData = async () => {
        try {
            // Adjust this URL to your actual endpoint to fetch the employee details for the current month
            const response = await fetch("http://192.168.29.245:5000/employee_Salary_details");

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setEmployeeDetails(data);
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {employeeDetails.map((employee, index) => (
                <View key={index} style={styles.employeeContainer}>
                    <Text style={styles.name}>{employee.emp_name}</Text>
                    <Text>Working Days: {employee.days_present}</Text>
                    <Text>Pending Amount Lent: {employee.total_lent}</Text>
                    <Text>Lending Details: Borrowed {employee.times_borrowed} times</Text>
                    <Text>Salary to be Paid: {employee.amount_to_be_paid}</Text>
                    

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    employeeContainer: {
        padding: 15,
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
