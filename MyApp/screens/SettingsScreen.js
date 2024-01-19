import {useState, useEffect} from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView, Touchable, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import * as Icon from "react-native-feather";
import { getFollowerOf, getUser, getSubcribers} from '../config/database/databaseCon';


export default function SettingScreen({ navigation, route }) {
    // userID form maincontainer
    const {userID: userLogin} = route.params ? route.params : {userLogin: null}
    const [usrLoginFollowers, setUsrLoginFollowers] = useState([])
    const [subcribers, setSubcribers] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getFollowerOf(userLogin)
            const userInfo = await getUser(userLogin)
            const subcribersData = await getSubcribers(userLogin)
            setUsrLoginFollowers(data)
            setUserInfo(...userInfo)
            setSubcribers(subcribersData)
        } catch (error) {
            console.error('Error fetching followersOf:', error);
        }
    };
    useEffect(()=>{
      fetchData();
    },[])

    // useEffect này sẽ chạy mỗi khi refresh thay đổi
  useEffect(() => {
    if (refresh) {
      fetchData();
      setRefresh(false); 
    }
  }, [refresh]);

  // useEffect này sẽ chạy khi người dùng quay trở lại từ một trang khác
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRefresh(true); 
    });
    return unsubscribe;
  }, [navigation]);


    return (
        <SafeAreaView  style={{marginBottom: 50}}>
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
      
        <CustomTabHeader>
        <View style={{ flex: 1,flexDirection: 'row'}}>
            <Text
            style={{ fontSize: 20, fontWeight: 'bold' }} className="ml-4 mt-4">
            Quản lý cài đặt
            </Text>
        </View>
        </CustomTabHeader>
        {/* body */}
      <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 50
            }}
        >
            <View style={styles.box} >
            <View className="ml-3 my-6">
                {userInfo.anhnd 
                ? (<Image
                    style={{width: 65, height: 65}}  
                    source={{ uri: rootUrl+'/imgs/'+ userInfo.anhnd}}
                    resizeMode="cover"
                    className = "rounded-full"
                    />)
                : (<Image
                    style={{width: 65, height: 65}}  
                    source={{ uri: rootUrl+'/imgs/user1.jpg' }}
                    resizeMode="cover"
                    className = "rounded-full"
                    />)
                }
                <Text style={styles.textUsername}>{userInfo.tennd ? userInfo.tennd: "UserName loading..."}</Text>
                <Text style={styles.textFollow}>Người theo dõi: {subcribers.length}</Text>
                <Text style={styles.textFollow}>Đang theo dõi: {usrLoginFollowers.length}</Text>
            </View>
            </View>
            <Text className="bg-gray-200 py-3 pl-4 font-semibold text-lg">Tiện ích</Text>
            {/* tiện ích start */}
            <View style={styles.boxList} >
            <TouchableOpacity className="ml-3 my-2 flex flex-row"
            onPress={()=> navigation.navigate("ManageGroupChat", {userLogin: userLogin})}
            >
            <Icon.Archive height="30" width="30" stroke="#e97777" />
                <Text className="ml-4 font-semibold text-lg "> Tin nhắn </Text>
            </TouchableOpacity>
            </View>

            <View style={styles.boxList} >
            <TouchableOpacity 
            className="ml-3 my-2 flex flex-row"
            onPress={()=>navigation.navigate("FollowList", {userLogin})}
            >
            <Icon.Heart height="30" width="30" stroke="orange" />
                <Text className="ml-4 font-semibold text-lg "> Theo dõi </Text>
            </TouchableOpacity>
            </View>

            
              {/* tiện ích end */}

              <Text className="bg-gray-200 py-3 pl-4 font-semibold text-lg">Khác</Text>
            {/* other start */}
            <View style={styles.boxList} >
            <TouchableOpacity className="ml-3 my-2 flex flex-row">
            <Icon.MessageCircle height="30" width="30" stroke="#9E7676" />
                <Text className="ml-4 font-semibold text-lg ">Giới thiệu về chúng tôi</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.boxList} >
            <TouchableOpacity className="ml-3 my-2 flex flex-row">
            <Icon.Settings height="30" width="30" stroke="#9E7676" />
                <Text className="ml-4 font-semibold text-lg "> Cài đặt tài khoản </Text>
            </TouchableOpacity>
            </View>

            <View style={styles.boxList} >
            <TouchableOpacity className="ml-3 my-2 flex flex-row"
            onPress={()=>navigation.navigate("Support", {userLogin})}
            >
            <Icon.HelpCircle height="30" width="30" stroke="#9E7676" />
                <Text className="ml-4 font-semibold text-lg "> Trợ giúp </Text>
            </TouchableOpacity>
            </View>

            <View style={styles.boxList} >
            <TouchableOpacity className="ml-3 my-2 flex flex-row"
            onPress={()=>navigation.navigate("Evaluate", {userLogin})}
            >
            <Icon.Command height="30" width="30" stroke="#9E7676" />
                <Text className="ml-4 font-semibold text-lg "> Đóng góp ý kiến</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.boxList} >
            <TouchableOpacity className="ml-3 my-2 flex flex-row">
            <Icon.LogOut height="30" width="30" stroke="#9E7676" />
                <Text className="ml-4 font-semibold text-lg "> Đăng xuất</Text>
            </TouchableOpacity>
            </View>
              {/* orther end */}

              <Text className="bg-gray-200 py-3 pl-4 font-semibold text-lg">Phiên bản hiện tại </Text>
              <Text className=" py-5 pl-4 mr-2 font-semibold text-center">Version: 24:12:2001v0</Text>
        </ScrollView>
        </SafeAreaView>
     
    );
}

const styles = StyleSheet.create({
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-around',
      },
      box:{
            borderColor: '#ccc', 
            borderBottomWidth: 1,
            borderTopWidth: 1,
          },
    boxList:{
        borderColor: '#ccc', 
        borderBottomWidth: 1,
          },
    textUsername:{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: -66,
            marginLeft: 74
          },
    textFollow:{
            marginLeft: 74
          }
})