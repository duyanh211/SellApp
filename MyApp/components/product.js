import {React, useState, useEffect} from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ProductScreen = ({userLogin, products}) => {
    const navigatetion = useNavigation()
    const [lRowProducts, setlRowProducts] = useState([])
    const [rRowProducts, setrRowProducts] = useState([])

  useEffect(()=>{
      // trộn mảng cho các sp đều có cơ hội xuất hiện ở đầu
      // function shuffleArray(array) {
      //   for (let i = array.length - 1; i > 0; i--) {
      //     const j = Math.floor(Math.random() * (i + 1));
      //     [array[i], array[j]] = [array[j], array[i]];
      //   }
      //   return array;
      // }
      // const randomArr = shuffleArray(products)
      // tách mảng 
      const middleIndex = Math.floor(products.length / 2);
      // const lRowProducts = randomArr.slice(0, middleIndex);
      // const rRowProducts = randomArr.slice(middleIndex);
  
      const lRowProducts = products.slice(0, middleIndex);
      const rRowProducts = products.slice(middleIndex);
      setlRowProducts(lRowProducts)
      setrRowProducts(rRowProducts)
  },[products])
    

  function MoneyType(number){
      if (number !== undefined && number !== null) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
        return number;
    }
  }

    
    
  return (
    <ScrollView >
    <View style={styles.flexRow}>
      <View style={styles.box1}>
      {lRowProducts ? lRowProducts.map((product) => (
        <TouchableOpacity
        onPress={()=> navigatetion.navigate('ProductDetails', {productID: product.masp, product, userID: product.mand, userLogin})}
        key={product.masp}
        >
        <View >
            <View style={{marginLeft: 10}}>
                <Image
                style={styles.img}  
                source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                resizeMode="cover"
                />
                <Text >{product.tensp}</Text>
                <Text  style={styles.textPrice}>{MoneyType(product.gia)} Đồng</Text>
                <Text style={styles.testAddress} >Địa chỉ: {product.name}</Text>
            </View>
        <View style={styles.box}/>
        </View>
        </TouchableOpacity>
        )) : <Text> null </Text>}
      </View>
      
      <View style={styles.box2}>
      {rRowProducts ? rRowProducts.map((product) => (
        <TouchableOpacity
        onPress={()=> navigatetion.navigate('ProductDetails', {productID: product.masp, product, userID: product.mand, userLogin})}
        key={product.masp}
        >
        <View>
            <View style={{marginLeft: 10}}>
                <Image
                style={styles.img}  
                source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                resizeMode="cover"
                />
                <Text >{product.tensp}</Text>
                <Text  style={styles.textPrice}>{MoneyType(product.gia)} Đồng</Text>
                <Text style={styles.testAddress} >Địa chỉ: {product.name}</Text>
            </View>
            <View style={styles.box}/>
        </View>
        </TouchableOpacity>
        )): null}
      </View>
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
    flexRow: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 8,
       
    },
    box1: {
    flex: 1,
    borderColor: '#ccc', 
    borderRightWidth: 1, 
    borderBottomWidth: 1, 
    // borderTopColor: 'transparent',
    },
    box2: {
      flex: 1,
      borderColor: '#ccc', 
      borderBottomWidth: 1, 

    },
    box: {
        height: 1,
        borderColor: '#ccc', 
        borderBottomWidth: 1,
        marginBottom: 8,
        marginTop: 8
    },
    img: {
        width: '95%',
        height: 160,
        borderRadius: 4
    },
    textPrice: {
        color: "#8B0000",
        fontSize: 16
    },
    testAddress:{
        fontSize: 12
    }
  });

export default ProductScreen;
