import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker'

export default function LendingDetailsScreen() {
    const [lendingDetails, setLendingDetails] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchLendingDetails();
    }, []);

    const fetchLendingDetails = async () => {
        try {
            const response = await fetch("http://192.168.29.245:5000/get_lend_details");
            const data = await response.json();
            setLendingDetails(data);
        } catch (error) {
            console.error("Error fetching lending details:", error);
        }
    };

    const handleEdit = (id) => {
        setSelectedDetailId(id);
        const currentStatus = lendingDetails.find(detail => detail.id === id).status;
        setSelectedStatus(currentStatus || 'Pending');
        setShowDropdown(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch("http://192.168.29.245:5000/update_lend_details", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedDetailId,
                    status: selectedStatus,
                    date_completed: new Date().toISOString().split('T')[0]
                })
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert(result.message);
                fetchLendingDetails();
            } else {
                Alert.alert("Error", "Failed to update lending details.");
                console.error("Response not OK:", await response.text());
                throw new Error(`HTTP error! Status: ${response.status}`);
                
            }
        } catch (error) {
            console.error("API error:", error);
            Alert.alert("Error", "An error occurred while updating the lending details.");
        }

        setSelectedDetailId(null);
        setSelectedStatus(null);
        setShowDropdown(false);
    };

    return (
        <ScrollView style={styles.container}>
            {lendingDetails.map((detail) => (
                <View key={detail.id} style={styles.detailContainer}>
                    <Text style={styles.label}>Name: <Text style={styles.data}>{detail.emp_name}</Text></Text>
                    <Text style={styles.label}>Amount: <Text style={styles.data}>{detail.amount}</Text></Text>
                    <Text style={styles.label}>Date Took: <Text style={styles.data}>{detail.date_took}</Text></Text>
                    <Text style={styles.label}>Reason: <Text style={styles.data}>{detail.reason}</Text></Text>
                    <Text style={styles.label}>Status: <Text style={styles.data}>{detail.status || 'Pending'}</Text></Text>
                    <Text style={styles.label}>Date Completed: <Text style={styles.data}>{detail.date_completed}</Text></Text>
                    <Button title="Edit" onPress={() => handleEdit(detail.id)} />
                    {showDropdown && selectedDetailId === detail.id && (
                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={selectedStatus}
                                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                            >
                                <Picker.Item label="Pending" value="Pending" />
                                <Picker.Item label="Paid" value="Paid" />
                            </Picker>
                            <Button title="Update" onPress={handleUpdate} />
                        </View>
                    )}
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
    detailContainer: {
        marginBottom: 16,
        padding: 8,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8,
    },
    data: {
        fontWeight: 'normal',
    },
    dropdownContainer: {
        marginTop: 10,
    },
});