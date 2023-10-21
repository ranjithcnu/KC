 
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';

export default function AttendanceList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://192.168.29.245:5000/attendance");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => <Text>{item.emp_name}: {item.att_status}</Text>}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
