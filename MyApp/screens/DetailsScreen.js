import * as React from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView,
         Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import * as Icon from "react-native-feather";
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {getStatus, fetchDataDB, dateTimeCustom, getFollowers, getSameProducts} from '../config/database/databaseCon';


export default function DetailsScreen({ route }) {
    const {productID,  product, userID, userLogin, userIdEdit, useridDel} = route.params 
                                            ? route.params 
                                            : {productID: null, product: null, userID: null,
                                                 userLogin: null, useridDel: null, userIdEdit: null}
    const [status, SetStatus] = useState([])
    const [statusFound, SetSatusFound] = useState([])
    // ck user's post == userLogin
    const [checkUser, setCheckUser] = useState(false)
    // ck cd from home
    const [fHome, setFHome] = useState(false)
    // ck user mag
    const [checkUserEdit, setCheckUserEdit] = useState(false)
    const [checkUserDel, setCheckUserDel] = useState(false)
    // follow
    const [followers, setFollowers] = useState([])
    const [numberFollower, setNumberFollower] = useState(0)
    // same products
    const [sameProducts, setSameProducts] = useState([])
    const navigation = useNavigation()
    const [refresh, setRefresh] = useState(false);
                            
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await getSameProducts(product.maloai, userID)
                setSameProducts(data)
            } catch (error) {
                console.error('Error fetching SameProducts:', error);
            }
        };
      fetchData();
    },[])
     // useEffect này sẽ chạy mỗi khi refresh thay đổi
     useEffect(() => {
        if (refresh) {
            fetchDataDB(getFollowers, setFollowers)
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

    useEffect(() =>{
        fetchDataDB(getStatus, SetStatus)
        if(userID == userLogin){
            setCheckUser(true)
            setFHome(true)
        }
        if(userID){
            setFHome(true)
        }

        if(userIdEdit){
            setCheckUserEdit(true)
            setCheckUser(false)
            setFHome(false)
        }
        if(useridDel){
            setCheckUserDel(true)
            setCheckUser(false)
            setFHome(false)
        }
        fetchDataDB(getFollowers, setFollowers)
      }, [])

      useEffect(()=>{
        const numberOfFollowers = followers.filter(follow => follow.mand_duoctheodoi === userID).length
        setNumberFollower(numberOfFollowers)
      },[followers])


      // lấy tất cả tt r -> check product.matt === st.matt -> SetSatusFound = boolen 
      // product change but not rerender
      useEffect(() => {
        if (status.length > 0 ) {
            var statusF = status.find(function(st) {
                return product.matt === st.matt;
            });
            SetSatusFound(statusF);
        }
    }, [status]);
   
    function MoneyType(number){
        if (number !== undefined && number !== null) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      } else {
          return number;
      }
    }
    async function DeletePost(){
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa tin này?',
            [
                {
                    text: 'Hủy',
                    onPress: () => {
                        console.log('Xóa đã bị hủy')
                    },
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: async () => {
                        const url = rootUrl + `/app/delete/${productID}`
                        try {
                            const response = await fetch(url, {
                                method: 'DELETE', 
                            });
                            if (response.ok) {
                                Alert.alert('Thông báo', 'Xóa tin thành công')
                            } else {
                                Alert.alert('Thông báo', 'Xin hãy xóa group chat của sản phẩm này.')
                            }
                        } catch (error) {
                            console.error('Lỗi kết nối đến server:', error)
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        )
    }
    
    function EditPost(){
        navigation.navigate("EditPostScreen", {product, productID, userIdEdit})
    }

    function SendMessage(){
        const idOwner = userID 
        // Alert.alert("user login: "+userLogin+" \nsendmessage to product's owner id: " + idOwner)
        // return navigation.navigate("ManageGroupChat", {productOwner: idOwner, userLogin: userLogin})
        const productChat = {
            masp: product.masp,
            tensp: product.tensp,
            anhsp: product.anhsp
        }
        return navigation.navigate("ChatScreen", {productOwner: idOwner, userLogin: userLogin, productID, productChat})
    }

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
        </View>
        </CustomTabHeader>
        {/* body */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 160
            }}
        >
           <View className=" flex content-center ">
                <Image
                style={styles.img}  
                source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                resizeMode="cover"
                />
            <View className="ml-3 ">
                <Text style={styles.textName}>{product.tensp}</Text>
                <Text  style={styles.textPrice}>{ MoneyType(product.gia)} đ</Text>
                <Text style={styles.testAddress} >Thời gian: {dateTimeCustom(product.ngaydang)}</Text>
                <Text style={styles.testAddress} >Địa chỉ: {product.name}</Text>
            </View >
            <View style={styles.userInfo} >
            <View className="ml-3 my-3">
            {product.anhnd ? 
                (<Image
                style={{width: 45, height: 45}}  
                source={{ uri: rootUrl+'/imgs/'+ product.anhnd}}
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
                <Text style={styles.textUsername}>{product.tennd}</Text>
                <Text style={styles.textFollow}>Người theo dõi: {numberFollower}</Text>
                <TouchableOpacity 
                    style = {styles.btnFollow}
                    className="p-2 mb-3 w-24  border-orange-400 border-2 rounded-3xl"
                    onPress={()=> navigation.navigate('UserDetailsScreen', {mand: product.mand, userLogin})} >
                        <Text className="font-bold text-dark text-center">Xem trang</Text>
                </TouchableOpacity>
            </View>
            </View>

            {/* mota chi tiet */}
            <View className="ml-3 my-3">
                <Text >{product.chitiet}</Text>
                <Text className="mt-1">Loại sản phẩm: {product.TENLOAI}</Text>
                <Text className="mt-1">
                    Trạng Thái: {statusFound && statusFound.tentt ? statusFound.tentt : "không xác định"}
                </Text>
            </View>

            {/* same posts */}
            <View className="mt-3 bg-white">
                <Text className="my-2 ml-3 text-lg font-semibold">Tin đăng tương tự</Text>
                {/* ScrollView con cuộn theo chiều ngang */}
                <ScrollView horizontal>
                <View style={{ flexDirection: 'row' }}>
                        {sameProducts ? sameProducts.map((product) => (
                            <TouchableOpacity
                            style = {styles.box1}
                            onPress={()=> navigation.replace('ProductDetails', {productID: product.masp, product, userID: product.mand, userLogin})}
                            key={product.masp}
                            >
                            <View >
                                <View style={{marginLeft: 10}}>
                                    <Image
                                    style={styles.imgSame}  
                                    source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                                    resizeMode="cover"
                                    />
                                    <Text >{product.tensp}</Text>
                                    <Text  style={styles.textPriceSame}>{MoneyType(product.gia)} Đồng</Text>
                                    <Text style={styles.testAddressSame} >{dateTimeCustom(product.ngaydang)}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                            )) : null}
                </View>
            </ScrollView>

            </View> 
           </View>
            
            
        
        </ScrollView>
            <View style={styles.stickyFooter}
            className="bg-sky-300"
            >
                {/* Nội dung của phần sticky */}
                {checkUserEdit &&
                    (<TouchableOpacity 
                    style={styles.stickyFooter}
                     onPress={EditPost} >
                     <Text className="font-bold text-dark text-center">Sửa tin</Text>
                     </TouchableOpacity>)} 
                {checkUserDel ?
                    (<TouchableOpacity 
                        style={styles.stickyFooter}
                        onPress={DeletePost} >
                        <Text className="font-bold text-dark text-center">Đã bán/hủy tin</Text>
                        </TouchableOpacity>): null} 
                { checkUser && fHome &&
                    (<TouchableOpacity 
                        style={styles.stickyFooter}
                            onPress={DeletePost} >
                        <Text className="font-bold text-dark text-center">Đã bán/hủy tin</Text>
                        </TouchableOpacity>)
                    }
                {!checkUser && fHome && 
                (<TouchableOpacity 
                    style={styles.stickyFooter}
                    onPress={SendMessage} >
                        <Text className="font-bold text-dark text-center">Gửi tin nhắn</Text>
                    </TouchableOpacity>)
                }
                
            </View>
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
        borderTopWidth: 1,
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
      box1: {
        borderColor: '#ccc', 
        borderLeftWidth: 1, 
        marginRight: 10,
        borderTopColor: 'transparent',
        width: 150
        },
        imgSame: {
            width: 140,
            height: 140,
            borderRadius: 4
        },
        textPriceSame: {
            color: "#8B0000",
            fontSize: 16
        },
        testAddressSame:{
            fontSize: 12
        }
})