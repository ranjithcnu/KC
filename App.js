import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/MarkAttendance';
import Lending from './components/LendingScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AddEmployee from './components/Addemployee';
import AttendanceDisplayScreen from './components/AttendanceDetailsScreen';
import LendingDetailsScreen from './components/LendingDetailsScreen';
import EmployeeDetails from './components/EmployeeDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Attendance') {
            iconName = 'calendar-check-o';
          } else if (route.name === 'LendingScreen') {
            iconName = 'handshake-o';
          } else if (route.name === 'AddEmployee') { 
            iconName = 'user-plus';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: 'flex'
          },
          null
        ],
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Attendance" component={MarkAttendance} />
      <Tab.Screen name="LendingScreen" component={Lending} />
      <Tab.Screen name="AddEmployee" component={AddEmployee} /> 
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AttendanceDetailsScreen" component={AttendanceDisplayScreen} />
        <Stack.Screen name="LendingDetailsScreen" component={LendingDetailsScreen} options={{ title: 'Lending Details' }} />
        <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} options={{ title: 'Employee Salary Details' }} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
