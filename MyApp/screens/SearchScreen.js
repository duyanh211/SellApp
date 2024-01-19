import { View, Text, SafeAreaView, StatusBar, Image,
         TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, {  useEffect, useRef, useState } from 'react'
import * as Icon from "react-native-feather";
import { themeColors } from '../theme'
import ProductScreen from '../components/product'
import { getSearchResult, fetchDataWithID} from '../config/database/databaseCon';

// import {Select} from 'react-native-picker-select';
// import { Picker } from '@react-native-picker/picker';




const DanhmucFiler = () =>{
    const [choosenLabel, setChoosenLabel] = useState('Native');
    const [choosenIndex, setChoosenIndex] = useState('2');
    return(
        <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>

        <Picker
          selectedValue={choosenLabel}
          onValueChange={(itemValue, itemIndex) => {
            setChoosenLabel(itemValue);
            setChoosenIndex(itemIndex);
          }}>
          <Picker.Item label="Hello" value="Hello" />
          <Picker.Item label="React" value="React" />
          <Picker.Item label="Native" value="Native" />
          <Picker.Item label="How" value="How" />
          <Picker.Item label="are" value="are" />
          <Picker.Item label="you" value="you" />
        </Picker>
        {/*Text to show selected picker value*/}
        <Text style={styles.text}>
          Selected Value: {choosenLabel}
        </Text>
        {/*Text to show selected index */}
        <Text style={styles.text}>
          Selected Index: {choosenIndex}
        </Text>
      </View>
    </SafeAreaView>
    )
}

export default function SearchScreen({ navigation, route }) {
  const {userLogin} = route.params
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([]);

  const inputRef = useRef(null);
  useEffect(() => {
      inputRef.current.focus();
    }, [])


    const handleSearch = (text) => {
      setSearch(text);
    };

    useEffect(()=>{
      fetchDataWithID(getSearchResult, search, setProducts)
    }, [search])
    
    useEffect(() => {
      const filteredst = products.filter((product) =>
        product.tensp.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredst);
    }, [products, search]);
  

    const highlightText = (name = "", search) => {
      const parts = name.split(new RegExp(`(${search})`, 'gi'));
      return (
        <Text>
          {parts.map((part, index) => (
            <Text key={index} style={part.toLowerCase() === search.toLowerCase() ? { color: 'orange' } : {}}>
              {part}
            </Text>
          ))}
        </Text>
      );
    };
    // end test 

    return (
        <SafeAreaView className="bg-white h-full">
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
        <View style={{
        width: '100%',
        height: 80,
        marginTop: 20,
        paddingTop: 30,
        backgroundColor: "#add8e6", 
      }}>
            <View className="flex-row items-center space-x-2 px-4 pb-2 bg-dark">
            <View className="flex-row flex-1 items-center p-3 rounded-full border border-dark-300 h-10">
                <Icon.Search height="25" width="25" stroke="gray" />
                <TextInput placeholder='Search' className="ml-2 flex-1  h-5" 
                            keyboardType='default' 
                            ref={inputRef}
                            onChangeText={(text)=>{handleSearch(text)}}
                            />
              
            </View>
            </View>
        </View>
            
        {/* main */}
      <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 50
            }}
        >
        <View className = "items-center">
            
            {search ? filtered.slice(0,15).map((product, index) => (
              <TouchableOpacity
              onPress={()=>navigation.navigate("CategorySearch", {catID: product.maloai,catName: product.tensp,  userLogin})}
              key={index}>
                <View className="pt-3 w-full w-screen ">
                  <View >
                    <Text className="ml-3 text-base">{highlightText(product.tensp, search)}</Text> 
                  </View>
                </View>
              </TouchableOpacity>
              )): null}
        </View>
          
          

        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
    },
    text: {
      fontSize: 20,
      alignSelf: 'center',
    },
  });
  