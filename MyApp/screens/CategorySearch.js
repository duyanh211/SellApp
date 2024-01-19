import { View, Text, SafeAreaView, StatusBar, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Categories from '../components/categories'
import * as Icon from "react-native-feather";
import { themeColors } from '../theme'
import ProductScreen from '../components/product'
import { getProducts, fetchDataDB,getCities, getCategoriesID, fetchDataWithID} from '../config/database/databaseCon';
import { CustomTabHeader } from './HomeScreen';
import DropdownComponent from '../components/dropdown'

const SearchBar = ({userLogin, catName}) =>{
const navigation = useNavigation()
    return (
     <View className="flex-row items-center space-x-2 px-4 pb-2 bg-dark">
        <TouchableOpacity 
                    onPress={()=> navigation.goBack()} >
                            <Icon.ArrowLeft 
                            height={30} width={30} 
                            strokeWidth="2.5" stroke="#000" 
                            style={{marginLeft: 10, marginTop: 0}}
                            />
                </TouchableOpacity>
     <View className="flex-row flex-1 items-center p-3 rounded-full border border-dark-300 h-10">
         <Icon.Search height="25" width="25" stroke="gray" />
         <TextInput placeholder={catName} 
         className="ml-2 flex-1 h-5" keyboardType='default' 
         onFocus={() => {navigation.navigate('Search', {userLogin})}}
         
         />
        
     </View>
    </View>
    )
}

export default function CategorySearch({route, navigation}) {
    const {catID, catName , userLogin} = route.params 
    const [productsDB, setProductsDB] = useState([])
    const [products, setProducts] = useState([])
    const [cities, setCities] = useState([])
    const [refresh, setRefresh] = useState(false);

    priceFilter = [
        {
            label: "Cao -> Thấp",
            value: 1
        },
        {
            label: "Thấp -> Cao",
            value: 2
        }
    ]
    const handleCityChange = (item) => {
        const newProduct = productsDB.filter((product)=>{
            return product.matp === item
        })
        setProducts(newProduct)
    };

    const handlePriceChange  = (item) => {
        const newProduct = [...products]
        if(item==1){
           newProduct.sort((a, b) => parseInt(b.gia) - parseInt(a.gia));
        } else {
            newProduct.sort((a, b) => parseInt(a.gia) - parseInt(b.gia));
        }
        const even = newProduct.filter((num, index) => index % 2 === 0);
        const odd = newProduct.filter((num, index) => index % 2 !== 0);
        const EvenOddArr = even.concat(odd);
        setProducts(EvenOddArr)
    }

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const data = await getCities();
                const cusData = data.map((city)=>{
                    return {
                        label: city.name, 
                        value: city.matp
                    }
                }) 
                setCities(cusData)
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchData();
        fetchDataWithID(getCategoriesID, catID, setProducts)
      }, [])

       // useEffect này sẽ chạy mỗi khi refresh thay đổi
     useEffect(() => {
        if (refresh) {
            fetchDataWithID(getCategoriesID, catID, setProductsDB)
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
        <SafeAreaView  style={{marginBottom: 40}}>
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
         <CustomTabHeader>
            <SearchBar 
            userLogin={userLogin}
            catName={catName}
            />
        </CustomTabHeader>
            
        {/* main */}
      <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 50
            }}
        >
       {/* vitri */}
       <View 
       className ="h-18 bg-white flex flex-row items-center pr-24"
        >
           <View className="space-x-1 pl-2">
             <Icon.MapPin height="25" width="25" stroke="orange" />
         </View>   
             <Text className="ml-2 font-bold">Vị Trí : </Text>
        <DropdownComponent data={cities} itemKind={"Toàn quốc"} onChange={handleCityChange}/>
       </View>
        {/* price search */}
       <View 
       className ="h-18 bg-white flex flex-row items-center pr-20 pl-11"
        >
        <Text className="ml-2 font-bold">Lọc : </Text>
        <DropdownComponent data={priceFilter} itemKind={"Lọc theo giá"} onChange={handlePriceChange}/>
       </View>
        
        
        {/* list products */}
        <ProductScreen 
        userLogin={userLogin}
        products={products}
        />
        
        </ScrollView>
        </SafeAreaView>
    );
}
