import * as React from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import * as Icon from "react-native-feather";
import { useState, useEffect } from 'react';
import {fetchDataDB, getProductPost, getUser, dateTimeCustom, getFollowers} from '../config/database/databaseCon';


export default function UserDetailsScreen({ navigation, route }) {
    const {mand,userLogin} = route.params ? route.params : {mand : null, userLogin: null}
    
   
const [post, setPost] = useState([])
const [userInfo, setUserInfo] = useState({})
// number post
const [quantity, setQuantity] = useState(0)
const [followers, setFollowers] = useState([])
const [checkFollower, setCheckFollower] = useState(false)
const [numberFollower, setNumberFollower] = useState(0)
function MoneyType(number){
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } else {
      return number;
  }
}

const fetchDataUser = async () => {
    try {
        const data = await getUser(mand);
        if (data.length > 0) {
            setUserInfo(...data);
          } else {
            console.log("Lỗi get nguoidung id .");
          }
    } catch (error) {
       console.log("Lỗi get nguoidung id" +error);
    }
};
const fetchDataProducts = async () => {
    try {
        const data = await getProductPost(mand);
        if (data.length > 0) {
            const approvedPosts = data.filter(post => post.xacnhan === 1);
            setQuantity(approvedPosts.length)
            setPost(approvedPosts);
          } else {
            console.log("Lỗi Không có bài đăng .");
          }
    } catch (error) {
       console.log("Không có bài đăng" +error);
    }
};

useEffect(()=>{
    fetchDataUser()
    fetchDataProducts()
    fetchDataDB(getFollowers, setFollowers)
    // console.log("userlogin: ", userLogin)
}, [])

useEffect(()=>{
    // tìm số người đã theo dõi user(mand) này
    const numberOfFollowers = followers.filter(follow => follow.mand_duoctheodoi === mand).length
    setNumberFollower(numberOfFollowers)

    // check xem da follow?
    followers.forEach((follow) => {
      if(follow.mand_theodoi == userLogin && follow.mand_duoctheodoi == mand){
        setCheckFollower(true)
      }
    })
},[followers])


    async function followHandle(){
      const url = rootUrl+`/app/users/follows`
      const data = {
        mand_theodoi: userLogin,
        mand_duoctheodoi: mand
      }
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      })
                if (response.ok) {
                  console.log('follow is success');
                  setCheckFollower(true)
                  setNumberFollower(numberFollower+1)
                } else {
                  const responseData = await response.json();
                  console.error('Lỗi follow :', responseData.error);
                }
      }catch (error) {
        console.error('Lỗi kết nối đến server:', error)
      }
    }

    async function unFollowHandle(){
      const url = rootUrl+`/app/users/unFollows?mand_theodoi=${userLogin}&mand_duoctheodoi=${mand}`
      try {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (response.ok) {
            setCheckFollower(false)
            setNumberFollower(numberFollower-1)
        } else {
            let responseData = await response.json()
            console.error(
                'Lỗi khi tải ảnh lên server:',
                responseData.error
            )
        }
      } catch (error) {
          console.error('Lỗi kết nối đến server:', error)
      }
    }

    return (
        <SafeAreaView >
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
        </View>
        </CustomTabHeader>
        {/* body */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 80
            }}
        >
           <View className="flex content-center">
           <View style={styles.userInfo} >
            <View className="ml-3 my-3">
            {userInfo.anhnd ? 
                (<Image
                style={{width: 45, height: 45}}  
                source={{ uri: rootUrl+'/imgs/'+ userInfo.anhnd}}
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
                <Text style={styles.textUsername}>{userInfo.tennd}</Text>
                <Text style={styles.textFollow}>Người theo dõi: {numberFollower}</Text>
                
                {!checkFollower 
                ? (<TouchableOpacity 
                  style = {styles.btnFollow}
                  className="p-2 mb-3 w-24  border-orange-400 border-2 rounded-3xl "
                  onPress={followHandle} >
                      <Text className="font-bold text-dark text-center">Theo dõi</Text>
              </TouchableOpacity>)
                : (<TouchableOpacity 
                  style = {styles.btnFollow}
                  className="p-2 mb-3 w-24  border-orange-400 border-2 rounded-3xl bg-orange-400"
                  onPress={unFollowHandle} > 
                      <Text className="font-bold text-dark text-center">Đã theo dõi</Text>
              </TouchableOpacity>)}
                <Text className ="mt-2" >Địa chỉ: {userInfo.dname}/{userInfo.cityname} </Text>
            </View>
            </View>
            <View className="bg-sky-300 w-full h-11">
              <Text className="text-center mt-2 font-semibold text-lg">Tin đang đăng({quantity})</Text>
            </View >
           

            {/* sanpham*/}
            <View className="my-3 ">
            {post ? (
                  post.map((product) => (
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('ProductDetails', {productID: product.masp, product,userID: product.mand, userLogin})}
                    key={product.masp}
                    >
                    <View style={styles.boxList} >
                        <View className=" flex flex-row py-2 ml-2 ">
                            <Image
                            className="w-24 h-24 rounded mx-2"
                            source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                            resizeMode="cover"
                            />
                            <View>
                            <Text >{product.tensp}</Text>
                            <Text  className="text-red-600 font-semibold">{MoneyType(product.gia)} Đồng</Text>
                            <Text  className="mt-7">{dateTimeCustom(product.ngaydang)}</Text>
                            </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                    ))
                ) : null}
            </View>
           </View>
          
       
        
        </ScrollView>
      
        </SafeAreaView>
     
    );
}

const styles = StyleSheet.create({
    flexRow: {
        flex: 1,
        flexDirection: 'row',
      },
      textPrice: {
          color: "#FF0000",
          fontSize: 16,
          marginTop: 3,
          fontWeight: "semibold",
      },
      testAddress:{
          fontSize: 14,
          marginTop: 3
      },
      img: {
          height: 230,
      },
      textName:{
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 3
      },
      userInfo:{
        borderColor: '#ccc', 
        borderBottomWidth: 1,
        marginTop: 8
      },
      textUsername:{
        fontSize: 16,
        fontWeight: "bold",
        marginTop: -46,
        marginLeft: 60
      },
      textFollow:{
        marginLeft: 60
      },
      btnFollow:{
        marginTop: -34,
        marginLeft: 260
      },
      stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60, // Độ cao của phần sticky
        justifyContent: 'center',
        alignItems: 'center',
      },
      boxList: {
        borderColor: '#e5e7eb', 
        borderBottomWidth: 1,
      }
})