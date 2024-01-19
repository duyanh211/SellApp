import { useState, useEffect } from "react";
import {
  View, StyleSheet, TextInput, Image, FlatList, Text, ScrollView, TouchableOpacity
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import {getGroupChatID, getMessagesGroup, dateTimeCustom} from '../config/database/databaseCon';
import axios from 'axios'
 
const Evaluate = ({ route }) => {
  const {userLogin} = route.params ? route.params : {userLogin: null}
  const [text, setText] = useState("");
  const [isMe, setIsMe] = useState(userLogin);
  const [messages, setMessages] = useState([])
    
    const TextDefault = {
        mand_gui: 0,
        noidung: "Ý kiến của bạn đã được ghi nhận, Xin cảm ơn đã đóng góp!!",
        thoigiangui: 0
    }
    const handleSend = () =>{
      const newText = {
        mand_gui: userLogin,
        noidung: text,
        thoigiangui: 0
      }
      // insert vao db
        var url = rootUrl + '/app/evaluate/addMessage';
        axios
        .post(url, {
          userLogin,
          text,
        })
        .then((res) =>{
             console.log("Evaluate successfully")
        })
        .catch((err) =>{
            console.log(err)
        })
      // hien thi
      const newTextObj = [...messages, newText, TextDefault]
      setMessages(newTextObj)
      setText('')
    }


    return (
    <>

    <View  className="w-screen h-full mt-8">
            <View 
                className= "flex flex-row border border-gray-100 border-b-gray-300 h-14 bg-sky-100 pt-3">
            <View className="ml-3 flex-1">
                <Text className="font-bold text-lg">Đóng góp ý kiến</Text>
            </View>
           
    </View>
    
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
                  </View>
                )}
                style={styles.list}
              />
          ) 
          
        }
        


        

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

});

export default Evaluate