import { useState, useEffect } from "react";
import {
  View, StyleSheet, TextInput, Image, FlatList, Text, ScrollView, TouchableOpacity
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import {getGroupChatID, getMessagesGroup, dateTimeCustom} from '../config/database/databaseCon';
import axios from 'axios'
 import { useNavigation } from "@react-navigation/native";

const ChatScreen = ({ route }) => {
  const {productOwner, userLogin, productID, productChat, magroupFromMag} = route.params 
                                              ? route.params 
                                              : {productOwner: null, userLogin: null,
                                                 userLogin: null, productChat:null, magroupFromMag: null}
  const [text, setText] = useState("");
  const [isMe, setIsMe] = useState(userLogin);
  const [magroup, setMagroup] = useState(0)
  const [messages, setMessages] = useState([])
  const navigation = useNavigation()
  
    useEffect(()=>{
        const fetchData = async () => {
          try {
              const data = await getMessagesGroup(magroup)
              setMessages(data)
          } catch (error) {
              console.error('Error fetching getMessagesGroup:', error);
          }
      };
      fetchData()
      const interval = setInterval(fetchData, 2000); 
      // Hủy interval khi component unmount để tránh rò rỉ bộ nhớ
      return () => clearInterval(interval);
      
    },[magroup])

    // kt neu chua co gc thi tao, co roi thi tra ve magroup
    useEffect(()=>{
      if(!magroupFromMag){
          const fetchData = async () => {
            try {
                const data = await getGroupChatID(userLogin, productOwner, productID)
                setMagroup(data.magroup)
            } catch (error) {
                console.error('Error fetching getGroupChat:', error);
            }
        };
       fetchData();
      } else setMagroup(magroupFromMag)
    },[])

    // chat 
    const handleSend = () =>{
      if(text == ''){
        return;
      }
      const newText = {
        mand_gui: userLogin,
        noidung: text,
        thoigiangui: 0
      }
      // insert vao db
        var url = rootUrl + '/app/chat/addMessage';
        axios
        .post(url, {
          magroup,
          userLogin,
          text,
          trangthai: 0,
        })
        .then((res) =>{
             console.log("insert message success")
        })
        .catch((err) =>{
            console.log(err)
        })
      // hien thi
      const newTextObj = [...messages, newText]
      setMessages(newTextObj)
      setText('')
    }
    // end chat



    function HourM(dateString){
      var dateTime = new Date(dateString);
      var gio = dateTime.getHours();
      var phut = dateTime.getMinutes();
  
      // Định dạng lại chuỗi ngày giờ phút
      var dinhDangGioPhut =  gio + ':' + (phut < 10 ? '0' : '') + phut 
      return dinhDangGioPhut
  }

  function dateMonth(dateString){
    var dateTime = new Date(dateString);
    var thang = dateTime.getMonth() + 1
    var ngay = dateTime.getDate()

    // Định dạng lại chuỗi ngày giờ phút
    var dinhDangngay =  ngay+'/'+thang;
    return dinhDangngay
}
    return (
    <>

    <View  className="w-screen h-full mt-10">
    {
        productChat && (
          <TouchableOpacity 
         className= "flex flex-row border border-gray-100 border-b-gray-300 h-20 py-2 px-2" 
                onPress={()=> navigation.navigate('UserDetailsScreen', {mand: userLogin, userLogin})}
               
                >
            <Image
            source={{ uri: rootUrl+'/imgs/'+productChat.anhsp }}
            resizeMode="cover"
            className = "h-16 w-16"
            />
            <View className="ml-3 flex-1">
                <Text className="font-bold ">Tên sản phẩm: {productChat.tensp}</Text>
            </View>
           
    </TouchableOpacity>
        )
    }
    
        {
          messages && (
              <FlatList
                data={messages}
                renderItem={({ item }) => (
                  <View
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
                  {/* <View className="flex flex-row">
                    <Text style={styles.time}>{dateMonth(item.thoigiangui)}</Text>
                    <Text className="flex flex-1"></Text>
                    <Text style={styles.time}>{HourM(item.thoigiangui)}</Text>
                  </View>  */}
                  
                  </View>
                )}
                style={styles.list}
              />
          ) 
        }
       
        {/* Text Input */}
        <SafeAreaView 
        style={styles.container}
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
    paddingTop: -24,
    paddingBottom: 16,
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
    zIndex: 12
  },

});

export default ChatScreen