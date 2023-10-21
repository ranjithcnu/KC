import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Dashboard() {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentDetails, setPaymentDetails] = useState({
        amountToPay: 0,
        noOfDays: 0,
        month: currentMonthName,
    });
    const [currentDateCount, setCurrentDateCount] = useState({
        date: '',
        present: 0,
        absent: 0,
        total: 0
    });
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentMonthName = monthNames[currentDate.getMonth()];

    const fetchData = async () => {
        try {
            const response = await fetch("http://192.168.29.245:5000/dashboard");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (!result.present && result.present !== 0) {
                console.warn("Present count not provided in the server response.");
                return;
            }

            setTotalEmployees(result.total);
            setCurrentDateCount({
                date: result.date,
                present: result.present,
                absent: result.absent,
                total: result.total,
            });
        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };
    
    


    const fetchMoneyLendingDetails = async () => {
        try {
            const response = await fetch("http://192.168.29.245:5000/money_lending_details");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setTotalAmount(result.total_amount);
        } catch (error) {
            console.error("Error fetching money lending details:", error);
        }
    };
    
    const fetchPaymentDetails = async () => {
        try {
            const response = await fetch("http://192.168.29.245:5000/total_amount");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            
            const {final_pay} = result;
            const { total_amount } = result; // assuming total_amount is returned
            const currentMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
            setPaymentDetails({
                amountToPay: total_amount,
                totalpay: final_pay,
                noOfDays: currentMonthDays, // You might need to calculate this differently depending on the actual attendance data
                month: currentMonthName,
               
            });
        } catch (error) {
            console.error("Error fetching payment details:", error);
        }
    };
    

    useEffect(() => {
        fetchData();
        fetchMoneyLendingDetails();
        fetchPaymentDetails();
    }, []);

    const handleLogout = () => {
        Alert.alert('Logged out successfully');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Dashboard',
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 10 }}>
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            )
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
            fetchMoneyLendingDetails();
            fetchPaymentDetails();
            return () => {}; // Cleanup if needed
        }, [])
    );

    const handleShowLendingDetails = () => {
        navigation.navigate('LendingDetailsScreen');
    };

    return (
        <View style={styles.container}>
            {/* Attendance Container */}
            <View style={styles.subContainer}>
                <Text style={styles.title}>Attendance Details</Text>
                <View style={styles.dataContainer}>
                    <Text>Date: {currentDateCount.date}</Text>
                    <Text>Total Employees: {totalEmployees}</Text>
                    <Text>Present: {currentDateCount.present}</Text>
                    <Text>Absent: {currentDateCount.absent}</Text>
                </View>
                <Button title="Attendance Details" onPress={() => navigation.navigate('AttendanceDetailsScreen')} color="#007BFF" />
            </View>
            
            {/* Money Lending Container */}
            <View style={styles.subContainer}>
                <Text style={styles.title}>Money Lending Details</Text>
                <View style={styles.dataContainer}>
                <Text>Total Money Taken: {totalAmount}</Text>
                    <Text>Month Taken: {currentMonthName }</Text>
                </View>
                <Button title="Lending Details" onPress={handleShowLendingDetails} color="#007BFF" />
            </View>
           {/* Payments Container */}
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Payments</Text>
                    <View style={styles.dataContainer}>
                        <Text>Amount to Pay: {paymentDetails.amountToPay}</Text>
                        <Text>Final Total Payment: {paymentDetails.totalpay}</Text>
                        <Text>current month days: {paymentDetails.noOfDays}</Text>
                        <Text>Current Month: {paymentDetails.month}</Text>
                    </View>
                    <Button 
        title="Salary Details " 
        onPress={() => navigation.navigate('EmployeeDetails')}
      />
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    subContainer: {
        flex: 1,
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        margin: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    dataContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
});