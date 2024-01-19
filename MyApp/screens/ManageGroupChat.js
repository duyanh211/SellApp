import * as React from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import * as Icon from "react-native-feather";
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {getGroupChat, getUserInfoGroupChat, getUsers, fetchDataDB} from '../config/database/databaseCon';
import axios from 'axios'


export const GroupChat=({group, userLogin, onRefesh})=>{

    
    function handleLongPress(){
        Alert.alert(
            'Xóa hội thoại',
            'Bạn sẽ không thể xem lại bất kỳ nội dung nào của hội thoại đã xóa.', 
            [
            {
              text: 'Hủy',
              onPress: () => console.log('Cancel Pressed group: '+ group.magroup),
            },
            {text: 'Xóa', onPress: () => {
                // delete groupchat
                var url = rootUrl + `/app/chat/delete/${group.magroup}`;
                axios
                .delete(url)
                    .then(response => {
                        console.log('Deleted group successfully:', response.data);
                        onRefesh()
                    })
                    .catch(error => {
                        console.error('Error group deleting:', error);
                    });
            }},
            ]); 
    }
    const navigation = useNavigation()
    const productChat = {
        masp: group.masp,
        tensp: group.tensp,
        anhsp: group.anhsp
    }
    return (
        <TouchableOpacity 
         className= "flex flex-row border border-gray-100 border-b-gray-200 h-22 py-1 px-2"
                onPress={()=> navigation.navigate("ChatScreen", {magroupFromMag: group.magroup, userLogin: userLogin, productID: group.masp, productChat})}
                onLongPress={handleLongPress}
                >
            {group.anhnd ? 
                (<Image
                // source={{ uri:  group.anhnd}}
                source={{ uri: rootUrl+'/imgs/'+group.anhnd }}
                resizeMode="cover"
                className = "rounded-full h-14 w-14"
                />)
                : (<Image
                style={{width: 45, height: 45}}  
                source={{ uri: rootUrl+'/imgs/user1.jpg' }}
                resizeMode="cover"
                className = "rounded-full"
                />)
            }
            <View className="ml-3 flex-1 ">
                <Text className="text-lg font-medium flex-1 ">{group.tennd}</Text>
                <Text className="font-bold text-gray-500">{group.tensp}</Text>
                <Text className="text-gray-500"></Text>
            </View>
            <Image
            source={{ uri: rootUrl+'/imgs/'+group.anhsp }}
            resizeMode="cover"
            className = "h-16 w-16"
            />
        </TouchableOpacity>
    )
}


export default function ManageGroupChat({ navigation, route }) {
    const {productOwner, userLogin} = route.params 
    // group from DB 
    const [groupChats, setGroupChats] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [users, setUser] = useState([])
    const [groups, setGroups] = useState([])
    const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    // Đảo ngược giá trị của state 'refresh' để trigger việc refresh
    setRefresh(!refresh);
  };
    // user khac gui tin cho minh truoc
    const [otherStartChats, setOtherStartChats] = useState([])

 

    useEffect(()=>{
        const fetchData = async () => {
        try {
              const data = await getGroupChat(userLogin)
              setGroupChats(data)
        } catch (error) {
              console.error('Error fetching getMessagesGroup:', error);
        }
      };
     fetchData();
    },[refresh])

    useEffect(() =>{
        fetchDataDB(getUsers, setUser)
    },[])

    useEffect(() => {
    const fetchData = async () => {
        try {
        if (groupChats.length > 0) {
            const userInfoArray = await Promise.all(
            groupChats.map(async (group) => {
                const data = await getUserInfoGroupChat(group.masp);
                return data;
            })
            );
            const flattenedArray = userInfoArray.flatMap(arr => arr);
            setUserInfo(flattenedArray);
        }
        } catch (error) {
        console.error('Error fetching getUserInfoGroupChat:', error);
        }
    };
    fetchData();
    }, [groupChats]);

   

    useEffect(()=>{
        const newArrays = [];

        groupChats.forEach(chat => {
          const matchingUserInfo = userInfo.find(info => info.masp === chat.masp);
          let userObj;
        
          if (chat.mand_nhan === userLogin) {
            userObj = users.find(user => user.mand === chat.mand_gui);
          }
        
          if (matchingUserInfo) {
            const newObj = {
              magroup: chat.magroup,
              anhnd: chat.mand_nhan === userLogin ? userObj?.anhnd : matchingUserInfo.anhnd,
              anhsp: matchingUserInfo.anhsp,
              tensp: matchingUserInfo.tensp,
              tennd: chat.mand_nhan === userLogin ? userObj?.tennd : matchingUserInfo.tennd,
              mand_nhan: chat.mand_nhan,
              mand_gui: chat.mand_gui,
              masp: chat.masp
            };
        
            newArrays.push(newObj);
          }
        });
        
        setGroups(newArrays)
        
    },[userInfo])


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
                <Text className="text-xl font-bold mt-1 ml-4">Tin nhắn</Text>
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
                groups.length > 0 
                ? (
                    groups.map((group, index)=>(
                        <GroupChat 
                        key={index}
                        group={group}
                        userLogin = {userLogin}
                        onRefesh={handleRefresh}
                        />
                    ))
                )
                : (<View className="mt-4"><Text className="text-lg text-center font-bold">không có tin nhắn</Text></View>)
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