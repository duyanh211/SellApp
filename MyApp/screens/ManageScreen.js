import {useState, useEffect} from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native'
import {fetchDataDB, getProductPost} from "../config/database/databaseCon"

function NoPostHistory(){
    return (
        <View className="bg-black/5 flex content-center py-11">
                <Text className="text-center  mt-2 font-bold text-xl">
                    Không tìm thấy tin !
                    </Text>
                <Text className="text-center ">
                    Bạn hiện tại không có tin đăng nào trong trạng thái này
                    </Text>
           </View>
    )
}

function HasPost({children, userID}){
    const navigation = useNavigation()
    // phan hien thi
    const [post, setPost] = useState([])
    const [pending, setPending] = useState([])
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getProductPost(userID);
            
            if (data.length > 0) {
                const approvedPosts = data.filter(post => post.xacnhan === 1);
                const pendingPosts = data.filter(post => post.xacnhan === 0);
                
                setPost(approvedPosts);
                setPending(pendingPosts);
              } else {
                console.log("Người dùng chưa đăng tin.");
              }
        } catch (error) {
           console.log("Server error at manaScreen." +error);
        }
    };
    useEffect(()=>{
        fetchData()
    }, [])
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
  
  function MoneyType(number){
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } else {
      return number;
  }
}
    return (
        <View className="h-screen flex content-center mb-40">
            <View className="w-full bg-green-200">
                <Text  className="text-black-400 font-bold text-2xl py-4 pl-3">
                    Tin đã đăng
                </Text>
                {post.length>0 ? (
                    post.map((product) => (
                        <TouchableOpacity
                        onPress={()=> navigation.navigate('ProductDetails', {productID: product.masp, product,useridDel: userID, userID})}
                        key={product.masp}
                        >
                        <View >
                            <View style={styles.boxList} className=" flex flex-row py-2 bg-green-100">
                                <Image
                                className="w-16 h-16 rounded-xl mx-3"
                                source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                                resizeMode="cover"
                                />
                                <View>
                                <Text >{product.tensp}</Text>
                                <Text  className="text-red-500">{MoneyType(product.gia)} Đồng</Text>
                                </View>
                               
                            </View>
                        </View>
                        </TouchableOpacity>
                        ))
                ) : children}
            </View>
            <View className="w-full mt-3 bg-yellow-200">
                <Text  className="text-black-400 font-bold text-2xl py-4 pl-3">
                    Tin chờ duyệt
                </Text>
                {pending.length>0 
                ? (
                    pending.map((product) => (
                        <TouchableOpacity
                        onPress={()=> navigation.navigate('ProductDetails', {productID: product.masp, product, userIdEdit: userID, userID})}
                        key={product.masp}
                        >
                        <View >
                            <View style={styles.boxList} className=" flex flex-row py-2 bg-yellow-100">
                                <Image
                                className="w-16 h-16 rounded-xl mx-3"
                                source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                                resizeMode="cover"
                                />
                                <View>
                                <Text >{product.tensp}</Text>
                                <Text  className="text-red-500">{MoneyType(product.gia)} Đồng</Text>
                                </View>
                               
                            </View>
                        </View>
                        </TouchableOpacity>
                        ))
                )
                 : children}
            </View>
           </View>
    )
}

export default function ManageNews({ navigation, route }) {
    const {userID} = route.params
  


     return (
        <SafeAreaView  style={{marginBottom: 50}}>
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
      
        <CustomTabHeader>
        <View style={{ flex: 1,flexDirection: 'row'}}>
            <Text
            style={{ fontSize: 20, fontWeight: 'bold' }} className="ml-4 mt-4">
            Quản lý đăng tin
            </Text>

            <TouchableOpacity 
                    onPress={()=> navigation.navigate("ManageGroupChat", {userLogin: userID})} >
                            <Icon.MessageSquare 
                            height={30} width={30} 
                            strokeWidth="2.5" stroke="#000" 
                            style={{marginLeft: 180, marginTop: 16}}
                            />
                </TouchableOpacity>
        </View>
        </CustomTabHeader>
        {/* body */}
      <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 50
            }}
        >
            <View style={styles.flexRow} >
                 <TouchableOpacity 
                    className="bg-orange-400 p-3 rounded mb-3 w-40"
                    onPress={()=> navigation.navigate('Post', {userID})} >
                        <Text className="font-bold text-white text-center text-xl">Đăng Tin</Text>
                </TouchableOpacity>
            </View>

            {/* sử lý nếu không có tin thì hiển thị */}
            
            <HasPost userID={userID}>
                <NoPostHistory />
            </HasPost>
          
       
        
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
      boxList:{
        borderColor: '#ccc', 
        borderBottomWidth: 1,
          },
})