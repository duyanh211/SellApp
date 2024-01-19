import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { getUsers , fetchDataDB} from '../config/database/databaseCon';

export default function LoginScreen({navigation, route}) {
    const {backfromSignup} = route.params ? route.params : false
    const [sdt, setSdt] = useState('')
    const [password, setPassword] = useState('')
    const [users, setUsers] = useState([])
    const [checkReload, setCheckReload] = useState(0)

    useEffect(() => {
        if (backfromSignup) {
            setCheckReload(prev => prev + 1);
        }
    }, [backfromSignup]);
    useEffect(() =>{
        fetchDataDB(getUsers, setUsers)
    },[checkReload])

    function handleAccount(){
        let login = false
        let userId = 0
        for( let i = 0; i < users.length; i++){
          if(sdt === users[i].sdt && password === users[i].matkhau){
            login = true 
            userId = users[i].mand
            break;
          }
        }
        if(login){
            // console.log("userId login")
            // console.log(userId)
          navigation.navigate('Home', {userID: userId, sdt: sdt})
        } else {
          Alert.alert("Thông báo","Vui lòng kiểm tra lại email và mật khẩu.");
        }
      }

      const [secure, setSecureText] = useState(true)
      function handlePassSC(){
          setSecureText(!secure)
      }
  return (
    <View className="bg-white h-full w-full">
        <StatusBar style="light" />
        {/* <Image className="h-full w-full absolute" source={require('../assets/images/night.png')} /> */}

        {/* title and form */}
        <View className="h-full w-full flex justify-around pt-40 pb-10">
            
            {/* title */}
            <View className="flex items-center">
                <Text 
                    className="text-sky-500 font-bold tracking-wider text-5xl">
                        Đăng nhập
                </Text>
            </View>

            {/* form */}
            <View className="flex items-center mx-5 space-y-4">
                <View 
                    className="bg-black/5 p-5 rounded-2xl w-full">

                    <TextInput
                        onChangeText={(sdt) => {setSdt(sdt)}}
                        placeholder="Số điện thoại"
                        placeholderTextColor={'black'}
                    />
                </View>
                <View 
                    style={styles.inputContainer}
                    className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                    <TextInput
                        className="flex-1"
                        onChangeText={(pws) => {setPassword(pws)}}
                        placeholder="Mật khẩu"
                        placeholderTextColor={'black'}
                        secureTextEntry={secure}
                    />
                     <TouchableOpacity onPress={handlePassSC}>
                        <Image
                        style={styles.inputIcon}
                        source={{ uri: 'https://img.icons8.com/nolan/40/000000/key.png' }}
                        />
                    </TouchableOpacity>
                </View>

                <View 
                    className="w-full" >

                    <TouchableOpacity 
                    className="w-full bg-sky-500 p-3 rounded-2xl mb-3"
                    onPress={handleAccount} >
                        <Text className="text-xl font-bold text-black text-center">Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                <View 
                    className="flex-row justify-center">

                    <Text className=" text-lg">Bạn chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
                        <Text className="text-sky-500  text-lg">Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    inputIcon: {
        width: 30,
        height: 30,
        marginRight: 15,
        justifyContent: 'center',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      }
})