import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AttendanceDisplayScreen() {
    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isPickerVisible, setPickerVisible] = useState(false); // Added this state for the modal visibility
    const [pickerPosition, setPickerPosition] = useState(0); 
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [editedAttendanceStatus, setEditedAttendanceStatus] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://192.168.29.245:5000/att_details", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                }),
            });
            const result = await response.json();
            setData(result);
            setFilteredData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const filterData = async () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        const filtered = data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= start && itemDate <= end;
        });
        setFilteredData(filtered);
        await fetchData();
      };
    

      const handleEdit = (item, index) => {
        setPickerVisible(true);
        setIsEditing(item.id);
        setEditedAttendanceStatus(item.att_status);
        setPickerPosition(index * 60 + 'px');
      };



      const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
        filterData();
      };
    
      const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
        filterData();
      };
    

    const handleUpdate = async (id) => {
        try {
            const response = await fetch("http://192.168.29.245:5000/update_attendance", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    att_status: editedAttendanceStatus
                }),
            });
            const result = await response.json();

            if (response.ok) {
                await fetchData();
                setIsEditing(false);
                setPickerVisible(false); // Close the modal after updating
            } else {
                console.error("Error updating attendance:", result.message);
            }
        } catch (error) {
            console.error("Error updating attendance:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <Button title={startDate.toDateString()} onPress={() => setShowStartDatePicker(true)} />
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode={'date'}
                        display="default"
                        onChange={onChangeStartDate}
                    />
                )}

                <Button title={endDate.toDateString()} onPress={() => setShowEndDatePicker(true)} />
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode={'date'}
                        display="default"
                        onChange={onChangeEndDate}
                    />
                )}
            </View>

            <FlatList
        style={{ flex: 1 }}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <Text style={styles.itemText}>{item.emp_name}</Text>
                    <Text style={styles.itemText}>Date: {item.date}</Text>
                    <Text style={styles.itemText}>Status: {item.att_status}</Text>
                </View>
                {isEditing === item.id ? (
                    <Button title="Update" onPress={() => handleUpdate(item.id)} />
                ) : (
                    <Button title="Edit" onPress={() => handleEdit(item, index)} />
                )}
            </View>
                )}
            />

       {/* Picker in a Modal */}
       {isEditing && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={isPickerVisible}
                    onRequestClose={() => setPickerVisible(false)}
                >
                    <View style={{...styles.pickerModal, top: pickerPosition }}>
                        <Picker
                            selectedValue={editedAttendanceStatus}
                            onValueChange={(itemValue) => setEditedAttendanceStatus(itemValue)}
                        >
                            <Picker.Item label="Present" value="present" />
                            <Picker.Item label="Absent" value="absent" />
                        </Picker>
                        <Button title="Update" onPress={() => { handleUpdate(isEditing); setPickerVisible(false); }} />
                    </View>
                </Modal>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5'
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2
    },
    itemText: {
        flex: 1,
        fontSize: 16
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginRight: 10
    }, pickerModal: {
        position: 'absolute',
        left: '10%',
        width: '80%',
        height: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        elevation: 5
    },
});
