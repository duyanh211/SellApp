import { useState, useEffect } from "react";
import {
  View, StyleSheet, TextInput, Image, FlatList, Text, ScrollView, TouchableOpacity
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import {getGroupChatID, getMessagesGroup, dateTimeCustom} from '../config/database/databaseCon';
import axios from 'axios'
import { getProducts, fetchDataDB} from '../config/database/databaseCon';
import { useNavigation } from '@react-navigation/native';

function Search({userLogin, products}){
  const navigatetion = useNavigation()
  function MoneyType(number){
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } else {
      return number;
  }
}
  return (
    <View className="flex flex-row flex-wrap mt-2 ">
      {products.map((product) => (
        <TouchableOpacity
        className="mt-2 w-24"
        onPress={()=> navigatetion.navigate('ProductDetails', {productID: product.masp, product, userID: product.mand, userLogin})}
        key={product.masp}
        >
        <View>
            <View style={{marginLeft: 10}}>
                <Image
                className = "w-16 h-16"
                source={{ uri: rootUrl+'/imgs/'+product.anhsp }}
                resizeMode="cover"
                />
                <Text >{product.tensp}</Text>
                <Text  className="text-red-600">{MoneyType(product.gia)}</Text>
            </View>
        </View>
        </TouchableOpacity>
        ))}
      </View>
  )
}

function FeatureList(){
  const [showSupportPost, setShowSupportPost] = useState(false);
  const [showSupportSearch, setShowSupportSearch] = useState(false);


  const supportPostNews = () => {
    setShowSupportPost(!showSupportPost)
    if(showSupportSearch){
      setShowSupportSearch(!showSupportSearch)
    }
  }

  const supportSearch = () => {
    setShowSupportSearch(!showSupportSearch)
    if(showSupportPost){
      setShowSupportPost(!showSupportPost)
    }
  }

  return (
    <>
    <View className="flex flex-row mx-3 space-x-6 justify-center">
    <TouchableOpacity 
        className="bg-orange-400 p-3 rounded mb-3 w-24"
        onPress={supportPostNews} >
            <Text className="font-bold text-white text-center ">Đăng Tin</Text>
    </TouchableOpacity>
    <TouchableOpacity 
         onPress={supportSearch}
        className="bg-orange-400 p-3 rounded mb-3 w-24" >
            <Text className="font-bold text-white text-center ">Tìm kiếm</Text>
    </TouchableOpacity>
    <TouchableOpacity 
        className="bg-orange-400 p-3 rounded mb-3 w-24"
        onPress={()=> navigation.navigate('Post', {userLogin})} >
            <Text className="font-bold text-white text-center ">Trợ giúp</Text>
    </TouchableOpacity>
  </View>
    {
      showSupportPost && (
        <View >
          <Text className="font-bold text-2xl ml-8">Để đăng bán một sản phẩm:</Text>
          <Text className="font-bold text-xl ml-8">Bước 1:</Text> 
          <Text className="font-bold text ml-20 mb-2">Vào trang đăng tin, Bấm vào nút Đăng tin.</Text> 
          
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/b1Dangtin.jpg'}}/>

          <Text className="font-bold text-xl ml-8">Bước 2:</Text> 
          <Text className="font-bold text ml-20 mb-2">Điền đầy đủ thông tin.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/sbInfo.jpg'}}/>

          <Text className="font-bold text-xl ml-8">Bước 3:</Text> 
          <Text className="font-bold text ml-20 mb-2">Bấm đăng tin.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/posting.jpg'}}/>
          <Text className="font-bold text ml-20 my-3">Đăng tin thành công.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/dangtinThanhcong.jpg'}}/>


          <Text className="font-bold text-xl ml-8">Bước 4:</Text> 
          <Text className="font-bold text ml-20 mb-2">Tin sau khi đăng sẽ chờ admin duyệt.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/choduyet.jpg'}}/>

          <Text className="font-bold text-xl ml-8 mt-4">Tin đã được đăng:</Text> 
          <Text className="font-bold text ml-20 mb-2">Admin đã duyệt.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/postedNews.jpg'}}/>
        </View>
      )
    }
    {
      showSupportSearch && (
        <View >
          <Text className="font-bold text-2xl ml-8">Để Tìm kiếm sản phẩm:</Text>
          <Text className="font-bold text-xl ml-8">Cách 1:</Text> 
          <Text className="font-bold text ml-20 mb-2">Tìm kiếm theo danh mục ở trang chủ.</Text> 
          
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/danhmuc.jpg'}}/>

          <Text className="font-bold text ml-20 my-2">Sản phẩm của danh mục vừa tìm.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/rsDanhmuc.jpg'}}/>

          <Text className="font-bold text-xl ml-8">Cách 2:</Text> 
          <Text className="font-bold text ml-20 mb-2">Tìm kiếm theo tên.</Text> 
          <Text className="font-bold text ml-20 mb-3">Sau đó chọn vào kết quả muốn tìm.</Text> 
          <Image style={styles.imgs} source={{ uri: rootUrl +'/imgs/searchName.jpg'}}/>
        </View>
      )
    }
  </>
  )
}

const Support = ({ route }) => {
  const {userLogin} = route.params ? route.params : {userLogin: null}
  const [text, setText] = useState("");
  const [isMe, setIsMe] = useState(userLogin);
  const [messages, setMessages] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() =>{
    fetchDataDB(getProducts, setProducts)
  }, [])

    const TextDefault = {
        mand_gui: 0,
        noidung: "Xin lỗi vì sự bất tiện, Tôi không hiểu ý của bạn", 
        thoigiangui: 0
    }
    const handleSend = () =>{
      const newText = {
        mand_gui: userLogin,
        noidung: text,
        thoigiangui: 0
      }
      // Filter products based on the search input
      const searchInput = text.toLocaleLowerCase(); 
      const filteredProducts = products.filter(product =>
        product.tensp.toLowerCase().includes(searchInput)
      );

      const limitedSearchResult = filteredProducts.slice(0, 4);
        console.log("limitedSearchResult", limitedSearchResult)
      setSearchResult(limitedSearchResult);
      if(limitedSearchResult.length>0){
        const newTextObj = [...messages, newText]
        setMessages(newTextObj)
      } else {
        const newTextObj = [...messages, newText, TextDefault]
        setMessages(newTextObj)
      }
      
      setText('');
    }



    return (
    <>

    <View  className="w-screen h-full mt-8">
            <View 
                className= "flex flex-row border border-gray-100 border-b-gray-300 h-14 bg-sky-100 pt-3">
            <View className="ml-3 flex-1">
                <Text className="font-bold text-lg">Trợ giúp</Text>
            </View>
           
            </View>
    
        
          
             <ScrollView>
                <View className="w-screen h-16 mt-10">
                    <Text className="text-center font-bold text-2xl">Tôi có thể giúp gì cho bạn</Text>
                    <Text className="text-center font-semibold text-lg">Ở đây tôi có sẵn một số gợi ý</Text>
                </View>
                {/* feature */}

               <FeatureList/>

                {/* end feature */}

               { messages && (
                    messages.map((item, index) => (
                        <View
                            key = {index}
                            style={[
                            styles.MessContainer,
                            {
                            backgroundColor: isMe === item.mand_gui ? "#DCF8C5" : "white",
                            alignSelf: isMe === item.mand_gui ? "flex-end" : "flex-start",
                            },
                        ]}
                        >
                        <Text>{item.noidung}</Text>
                        {
                        item.thoigiangui == 0
                        ?(<Text style={styles.time}>Vừa xong</Text>)
                        : (<Text style={styles.time}>{HourM(item.thoigiangui)}</Text>)
                        }
                        </View>
                    )

                ) 
            )}

                {
                  searchResult && (<Search 
                    userLogin={userLogin}
                    products={searchResult}
                    />)
                }     
             </ScrollView>
         
          
        
        


        

        {/* Text Input */}
        <SafeAreaView 
        style={styles.container}
        className="bg-gray-200"
        >
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Type your message..."
        />

        {/* Icon */}
        <TouchableOpacity
          onPress={handleSend}
        >
          <MaterialIcons
          style={styles.send}
          name="send"
          size={30}
          color="white"
        />
        </TouchableOpacity>
        
      </SafeAreaView>
    </View>

            
        
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    paddingTop: -18,
    paddingBottom: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 35
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 20,
    overflow: "hidden",
  },

  attachmentsContainer: {
    alignItems: "flex-end",
  },
  MessContainer: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
  list: {
    padding: 10,
  },
  imgs: {
    width: 172,
    height: 372,
    marginLeft: 100
  }
  
});

export default Support