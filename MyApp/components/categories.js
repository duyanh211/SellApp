import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getCategories } from '../config/database/databaseCon'
import { useNavigation } from '@react-navigation/native'

export default function Categories({userLogin}) {
  const navigation = useNavigation()
  const [categories, setCategories] = useState([])
    useEffect(() => {
      const fetchData = async () => {
          try {
              const data = await getCategories();
              setCategories(data);
          } catch (error) {
              console.error('Error fetching categories:', error);
          }
      };
      fetchData();
  }, []);

  
  
  return (
    <View className="mt-4">
      <ScrollView
          // className="p-4"
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
          contentContainerStyle={{
            paddingHorizontal: 15
          }}
      >
          {
            categories?.map(category=>{
              return(
                <View key={category.MALOAI} className="flex justify-center items-center mr-6">
                  <TouchableOpacity
                  onPress={()=>navigation.navigate("CategorySearch", {catID: category.MALOAI, catName: category.TENLOAI, userLogin})}
                  >
                    <Image style={{width: 72, height: 72}} 
                    source={{ uri: rootUrl +'/imgs/'+ category.ANHLOAI}}
                    // source={category.ANHLOAI}
                    />
                  </TouchableOpacity>
                  <Text className={"text-sm text-500"}>{category.TENLOAI}</Text>
                </View> 
              )
            })
          }
        
      </ScrollView>
    </View>
    
  )
}
