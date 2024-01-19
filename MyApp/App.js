import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainContainer from './screens/MainContainer';
import DetailsScreen from './screens/DetailsScreen';
import SearchScreen from './screens/SearchScreen';
import PostScreen from './screens/PostScreen';
import EditPostScreen from './screens/EditPostScreen';
import UserDetailsScreen from './screens/UserDetailsScreen';
import FollowList from './screens/FollowList';
import CategorySearch from './screens/CategorySearch'
import ManageGroupChat from './screens/ManageGroupChat';
import ChatScreen from './screens/ChatScreen';
import Evaluate from './screens/Evaluate';
import Support from './screens/Support';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="Home" component={MainContainer} />
        <Stack.Screen name="CategorySearch" component={CategorySearch} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        <Stack.Screen name="ProductDetails" component={DetailsScreen} />
        <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="FollowList" component={FollowList} />
        <Stack.Screen name="ManageGroupChat" component={ManageGroupChat} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Evaluate" component={Evaluate} />
        <Stack.Screen name="Support" component={Support} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;