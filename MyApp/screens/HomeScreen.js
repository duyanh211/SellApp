import { View, Text, SafeAreaView, StatusBar, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Categories from '../components/categories'
import * as Icon from "react-native-feather";
import { themeColors } from '../theme'
import ProductScreen from '../components/product'
import { getProducts, fetchDataDB} from '../config/database/databaseCon';

export const CustomTabHeader = ({  children }) => {
    return (
      <View style={{
        width: '100%',
        height: 80,
        marginTop: 20,
        paddingTop: 30,
        backgroundColor: "#add8e6", 
      }}>
        {children}
      </View>
    )
  };

export const SearchBar = ({userLogin}) =>{
const navigation = useNavigation()

    return (
     <View className="flex-row items-center space-x-2 px-4 pb-2 bg-dark">
     <View className="flex-row flex-1 items-center p-3 rounded-full border border-dark-300 h-10">
         <Icon.Search height="25" width="25" stroke="gray" />
         <TextInput placeholder='Search' 
         className="ml-2 flex-1  h-5" keyboardType='default' 
         onFocus={() => {navigation.navigate('Search', {userLogin})}}
         
         />
         {/* <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
             <Icon.MapPin height="20" width="20" stroke="gray" />
         </View> */}
     </View>
    
    <TouchableOpacity
    onPress={()=>navigation.navigate("FollowList", {userLogin})}
    >
     <View style={{backgroundColor: themeColors.bgColor(1)}} className="p-3 rounded-full">
         <Icon.Heart height={20} width={20} strokeWidth="2.5" stroke="#add8e6" />
     </View> 
    </TouchableOpacity>
    </View>
    )
}

export default function HomeScreen({route, navigation}) {
    const { userID: userLogin, sdt } = route.params ? route.params : { sdt: null, userID: null };
    const [products, setProducts] = useState([])
    // const [refresh, setRefresh] = useState(false);
    useEffect(() =>{
        fetchDataDB(getProducts, setProducts)
      }, [])
       // useEffect này sẽ chạy mỗi khi refresh thay đổi
    //  useEffect(() => {
    //     if (refresh) {
    //       fetchDataDB(getProducts, setProducts)
    //       setRefresh(false); 
    //     }
    //   }, [refresh]);
    
      // useEffect này sẽ chạy khi người dùng quay trở lại từ một trang khác
      // useEffect(() => {
      //   const unsubscribe = navigation.addListener('focus', () => {
      //     setRefresh(true); 
      //   });
      //   return unsubscribe;
      // }, [navigation]);
    return (
        <SafeAreaView  style={{marginBottom: 40}}>
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
         <CustomTabHeader>
            <SearchBar userLogin={userLogin}/>
        </CustomTabHeader>
            
        {/* main */}
      <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 50
            }}
        >
       {/* categories */}
       <View 
       style={{
        height: 170, 
        backgroundColor: "#fff"
        }}>
        <Text  className ="text-lg font-semibold text-gray-800 ml-4 mt-2">
            Danh mục sản phẩm
        </Text>
        <Categories 
        userLogin={userLogin}
        />
       </View>
        
        <View className="bg-gray-200 h-2">
        </View>
            <Text  className ="text-lg font-semibold  ml-4 mt-2">
                Tin tổng hợp
            </Text>
            
        
        {/* list products */}
        <ProductScreen 
        userLogin={userLogin}
        products={products}
        />
        
        </ScrollView>
        </SafeAreaView>
    );
}
