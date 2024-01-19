import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {SafeAreaView} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './HomeScreen';
import ManageScreen from './ManageScreen';
import SettingsScreen from './SettingsScreen';

//Screen names
const homeName = "Trang chủ";
const detailsName = "Quản lý đăng tin";
const settingsName = "Cài đặt";
 
const Tab = createBottomTabNavigator();

function MainContainer({ route }) {
  // userID here = userlogIn
  const { userID, sdt } = route.params ? route.params : { sdt: null, userID: null };
  return (
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === detailsName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: {
            paddingBottom: 10,
            fontSize: 10,
          },
          tabBarStyle: {
            padding: 10,
            height: 70,
            display: 'flex',
          },
          headerShown: false,
          
        })}>

        <Tab.Screen name={homeName} component={HomeScreen} initialParams={{ userID:userID, sdt:sdt }}/>
        <Tab.Screen name={detailsName} component={ManageScreen} initialParams={{ userID:userID}}/>
        <Tab.Screen name={settingsName} component={SettingsScreen} initialParams={{ userID:userID}}/>

      </Tab.Navigator>
  );
}

export default MainContainer;