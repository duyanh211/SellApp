import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text , SafeAreaView, StatusBar, ScrollView,TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {CustomTabHeader} from './HomeScreen'
import {getCategories, getStatus} from '../config/database/databaseCon';
import DropdownComponent from '../components/dropdown'
import * as ImagePicker from 'expo-image-picker';

export default function PostScreen({ navigation, route }) {
    const {userID} = route.params
  // db
    const [categories, setCategories] = useState([])
    const [status, setStatus] = useState([]);
  // form
    const [selectStatus, setSelectStatus] = useState(0);
    const [catergory, setCategory] = useState(0)
    const [imageUri, setImageUri] = useState(null);
    const [productName, setproductName] = useState('');
    const [textDetails, settextDetails] = useState('');
    const [price, setprice] = useState(0);



// chỉnh lại định dạng mảng cho đúng yêu cầu của dropdown
    const fetchDataCaterogy = async (getter, setter) => {
      try {
          const data = await getter();
          const cusData = data.map((cter)=>{
              return {
                  label: cter.TENLOAI, 
                  value: cter.MALOAI
              }
          }) 
          setter(cusData)
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
  };
  const fetchDataStatus = async (getter, setter) => {
    try {
        const data = await getter();
        const cusData = data.map((cter)=>{
            return {
                label: cter.tentt, 
                value: cter.matt
            }
        }) 
        setter(cusData)
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

    useEffect(() => {
        fetchDataCaterogy(getCategories, setCategories);
        fetchDataStatus(getStatus, setStatus);
    }, []);

    function handleKind(item){
        setCategory(item)
    }

    function handleStatus(item){
      setSelectStatus(item)
    }

    useEffect(() => {
        (async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Quyền truy cập thư viện hình ảnh bị từ chối');
          }
        })();
      }, []);

    const openImagePickerAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
      
          if (!result.canceled) {
            // xóa cancelled bug
            delete result.cancelled;
            setImageUri(result.assets[0].uri); 
          }
          
      };


      const openCamera = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Quyền truy cập camera bị từ chối');
          return;
        }
    
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
    
        if (result.canceled === true) {
          return;
        }
        
          delete result.cancelled;

        setImageUri(result.assets[0].uri);
      };
  
      const uploadImage = async (imageUri) => {
        if(selectStatus && categories && productName && textDetails && price){
          const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
          const formData = new FormData();
          formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: fileName,
          });
          const productData = {
            userID,
            selectStatus,
            catergory,
            productName,
            textDetails,
            price,
          }
          const jsonData = JSON.stringify(productData);
          formData.append('productData',jsonData)
          const url = rootUrl+'/app/post'
          try {
            const response = await fetch(url, {
              method: 'POST',
              body: formData,
            });
            let responseData
                if (response.ok) {
                  responseData = await response.json();
                  // console.log('Ảnh đã được lưu:');
                  Alert.alert('Thông báo', "Đăng tin thành công")
                } else {
                  responseData = await response.json();
                  console.error('Lỗi khi tải ảnh lên server:', responseData.error);
                }
          } catch (error) {
            console.error('Lỗi kết nối đến server:', error);
          }
        } else {
          Alert.alert('Thông báo', "Hãy nhập đầy đủ thông tin")
        }
  
      }

    return (
        <SafeAreaView  style={{marginBottom: 50}}>
        <StatusBar
            barStyle="dark-content"  backgroundColor="#add8e6"
        />
      
        <CustomTabHeader>
        <View style={{ flex: 1,flexDirection: 'row'}}>
            <Text
            style={{ fontSize: 20, fontWeight: 'bold' }} className="ml-4 mt-4">
            Đăng tin
            </Text>
        </View>
        </CustomTabHeader>
        {/* body */}
      <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 200
            }}
        >
            <DropdownComponent data={categories} itemKind={"Loại sản phẩm"} onChange={handleKind}/>
            <DropdownComponent data={status} itemKind={"Chọn trạng thái"} onChange={handleStatus}/>
            <View className=" mx-5 flex flex-row">
                <TouchableOpacity className=" h-32 border-2 border-sky-300  w-2/4" 
                onPress={openImagePickerAsync}
                >   
                <View>
                    <Image 
                    className ="w-11 h-11 m-auto mt-6"
                    source={{ uri: rootUrl +'/imgs/libraryImage.png'}}
                    />
                    <Text className="text text-center mb-10">Chọn ảnh</Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity className=" h-32 border-dashed border-2 border-sky-300  w-2/4" 
                onPress={openCamera}
                style = {styles.borderCus}
                >   
                <View>
                    <Image 
                    className ="w-11 h-11 m-auto mt-6"
                    source={{ uri: rootUrl +'/imgs/iconsCamera.png'}}
                    />
                    <Text className="text text-center mb-10">Chụp ảnh</Text>
                </View>
                </TouchableOpacity>
            </View>
               <Text className="text-center">Chụp/chọn 1 ảnh</Text>
                {imageUri 
                    ? <View className="w-full h-44 mx-5 mt-3 ml-28">
                        <Image 
                        className ="w-40 h-40 rounded-md"
                        source={{ uri: imageUri}}
                        />
                        <Text className="ml-11">Ảnh đã chọn</Text> 
                    </View>
                : <View className="w-40 h-40 mx-5 mt-3 ml-28 bg-sky-200 rounded-md flex flex-col justify-center">
                    <Text className="text-center ">Hãy chọn ảnh</Text> 
                </View>
               }
               

              <View 
                className="w-full mt-6">
                <Text className="bg-black/5 text-gray-400 font-bold text-2xl py-4 pl-3">Tiêu đề và chi tiết đăng tin.</Text>
                <TextInput
                    className="p-3 rounded-xl mx-5 border border-gray-300 mt-3"
                    placeholder="Tên sản phẩm"
                    placeholderTextColor={'black'}
                    onChangeText={(name)=>{setproductName(name)}}
                />
                <TextInput
                    multiline
                    numberOfLines={4} // Số lượng dòng tối đa hiển thị mặc định
                    placeholder="Mô tả chi tiết ..."
                    className="p-3 rounded-xl mx-5 border border-gray-300 mt-3"
                    onChangeText={(details)=>{settextDetails(details)}}
                  />
                  <TextInput
                    className="p-3 rounded-xl mx-5 border border-gray-300 mt-3 mb-5"
                    placeholder="Giá tiền"
                    keyboardType="numeric"
                    placeholderTextColor={'black'}
                    onChangeText={(price)=>{setprice(price)}}
                />
                  <TouchableOpacity className="bg-sky-300 py-3 rounded-2xl m-5 mt-1" 
                  onPress={()=>{uploadImage(imageUri)}}
                  > 
                      <Text className="text-xl font-bold text-black text-center">Đăng tin</Text>
                  </TouchableOpacity>   
            </View>
                
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
      borderCus: {
        borderLeftColor: "transparent"
      }
})