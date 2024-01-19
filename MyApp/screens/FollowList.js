import * as React from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import * as Icon from "react-native-feather";
import { useState, useEffect } from 'react';
import { getFollowerOf} from '../config/database/databaseCon';
import { useNavigation } from '@react-navigation/native';


export const User=({usrLoginFollower, userLogin})=>{
    const navigation = useNavigation()
    return (
        <View className="ml-3 my-3 flex flex-row items-center">
        {usrLoginFollower.anhnd ? 
            (<Image
            style={{width: 45, height: 45}}  
            source={{ uri: rootUrl+'/imgs/'+ usrLoginFollower.anhnd}}
            resizeMode="cover"
            className = "rounded-full"
            />)
            : (<Image
            style={{width: 45, height: 45}}  
            source={{ uri: rootUrl+'/imgs/user1.jpg' }}
            resizeMode="cover"
            className = "rounded-full"
            />)
        }
            <Text className="text-lg font-medium ml-2 flex-1">{usrLoginFollower.tennd}</Text>
            <TouchableOpacity 
                style = {styles.btnFollow}
                className="p-2  w-24  border-orange-400 border-2 rounded-3xl mr-2"
                onPress={()=> navigation.navigate('UserDetailsScreen', {mand: usrLoginFollower.mand, userLogin})}>
                    <Text className="font-bold text-dark text-center ">Xem trang</Text>
            </TouchableOpacity>
        </View>
    )
}


export default function FollowList({ navigation, route }) {
    const {userLogin} = route.params ? route.params : {userLogin: null}
    const [usrLoginFollowers, setUsrLoginFollowers] = useState([])
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getFollowerOf(userLogin)
            setUsrLoginFollowers(data)
        } catch (error) {
            console.error('Error fetching followersOf:', error);
        }
    };
    useEffect(()=>{
      fetchData();
    },[])

    useEffect(() => {
        if (refresh) {
            fetchData();
            setRefresh(false); 
        }
      }, [refresh]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          setRefresh(true); 
        });
        return unsubscribe;
      }, [navigation]);


    return (
        <SafeAreaView  style={{marginBottom: 100}}>
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
      
        <CustomTabHeader>
        <View style={{ flex: 1,flexDirection: 'row'}}>
            <TouchableOpacity 
                    onPress={()=> navigation.goBack()} >
                            <Icon.ArrowLeft 
                            height={30} width={30} 
                            strokeWidth="2.5" stroke="#000" 
                            style={{marginLeft: 10, marginTop: 4}}
                            />
                </TouchableOpacity>
                <Text className="text-xl font-bold mt-1 ml-4">Danh sách đã theo dõi</Text>
        </View>
        </CustomTabHeader>
        {/* body */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 50
            }}
        >
           <View className=" h-screen flex content-center">
           <View >
            {
                usrLoginFollowers.length > 0 
                ? (
                    usrLoginFollowers.map((usrLoginFollower, index)=>(
                        <User 
                        key={index}
                        usrLoginFollower={usrLoginFollower}
                        userLogin={userLogin}
                        />
                    ))
                )
                : (<View className="mt-4"><Text className="text-lg text-center font-bold">Bạn chưa theo dõi ai cả.</Text></View>)
            }
                
            </View>
          </View>
        </ScrollView>
      
        </SafeAreaView>
     
    );
}

const styles = StyleSheet.create({
    userInfo:{
        borderColor: '#ccc', 
        borderBottomWidth: 1,
        borderTopWidth: 1,
        marginTop: 8
      }
})