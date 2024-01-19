import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { FadeInDown } from 'react-native-reanimated'
import DropdownComponent from '../components/dropdown'
import {getCities, getUsers, getDisttrict, getTown, fetchDataDB} from '../config/database/databaseCon'
import axios from 'axios'

export default function SignupScreen() {
    const navigation = useNavigation();
    const [sdt, setSdt] = useState('')
    const [city, setCity] = useState('')
    const [userName, setUserName] = useState('')
    const [district, setDistrict] = useState('')
    const [town, setTown] = useState('')
    const [address, setaddress] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('Số điện thoại đã được sử dụng!');
    // cities,districts,towns từ database
    const [cities, setCities] = useState([])
    const [multiDistrict, setMultiDistrict] = useState([])
    const [multiTown, setMultiTown] = useState([])
    // validation form
    const [warnSdt, setWarnSdt] = useState('')
    const [warnPass, setWarnpass] = useState('')
    const [warnRePass, setReWarnpass] = useState('')
    const [users, setUsers] = useState([])
    const [checkReload, setCheckReload] = useState(0)
    
    useEffect(() =>{
        fetchDataDB(getUsers, setUsers)
    },[checkReload])

    const handleSignup = () =>{
        let signup = true
        if(userName && sdt && address && password && town) {
            for( let i = 0; i < users.length; i++){
                if(sdt == users[i].sdt){
                  setErrorMessage('Số điện thoại đã được sử dụng!');
                  Alert.alert('Thông báo', errorMessage)
                  signup = false
                  break;
                }
              }
               if(signup){
              var url = 'http://192.168.162.172:1144/app/users/add';
                  axios
                  .post(url, {
                    userName,
                    sdt,
                    address,
                    password,
                    town,
                  })
                  .then((res) =>{
                      console.log("res.data")
                      console.log(res.data)
                  })
                  .catch((err) =>{
                      console.log(err)
                  })
                  
                  Alert.alert("Thông báo","Đăng ký thành công!")
                  setCheckReload(prev => prev + 1);
              } 
        } else {
            Alert.alert('Thông báo', "Hãy nhập đầy đủ thông tin")
        }
          
    
            // setUserName('')
            // setSdt('')
            // setCity('')
            // setDistrict('')
            // setTown('')
            // setPassword('')
            // setRepassword('')
            // setCities('')
      }
// cities -> city => districts
const handleCityChange = (item) => {
    setCity(item);
    const fetchData = async () => {
        try {
            const data = await getDisttrict(item);
            const cusData = data.map((dtrict)=>{
                return {
                    label: dtrict.name, 
                    value: dtrict.maqh
                }
            }) 
            setMultiDistrict(cusData)
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };
    fetchData();
  };
// district => towns
const handleDistrictChange = (item) => {
    setDistrict(item);
    const fetchData = async () => {
        try {
            const data = await getTown(item);
            const cusData = data.map((town)=>{
                return {
                    label: town.name, 
                    value: town.xaid
                }
            }) 
            setMultiTown(cusData)
        } catch (error) {
            console.error('Error fetching cities :', error);
        }
    };
    fetchData();
  };

  const handleTownChange = (item) => {
    setTown(item);
    // console.log(item)
  };
  
// handle sdt
const handleSdt=(sdt) =>{
// Kiểm tra chuỗi chỉ chứa số và có định dạng số điện thoại (bắt đầu bằng 0 và có 10 chữ số)
  const regex = /^0\d{9}$/;
  // Kiểm tra chuỗi không chứa chữ cái (chỉ chấp nhận số)
  const containsOnlyNumbers = /^\d+$/.test(sdt);

  if(regex.test(sdt) && containsOnlyNumbers){
    setWarnSdt('')
    setSdt(sdt)
  } else if(!regex.test(sdt) || !containsOnlyNumbers){
    setWarnSdt('Số điện thoại không hợp lệ')
  }
  
}

// hd pass
const focusPass=() =>{
    setWarnpass('Giới hạn từ 8-24 ký tự, tối thiểu 1 ký tự IN HOA.')
}
const handlePassword=(password)=>{
    const regex = /^(?=.*[A-Z]).{8,24}$/;
    return regex.test(password);
}
// hd repsw
const focusRepws=()=> {
    
}

const onChangeRepws=(repws)=>{
    setRepassword(repws)
    if(repws == password){
        setReWarnpass("Mật khẩu trùng khớp")
    } else {
        setReWarnpass("Mật khẩu không trùng khớp")
    }
}
// lay cities tu api
    useEffect(() => {
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
    }, []);

  return (
    <ScrollView>
      {/* <Image className="h-full w-full absolute" source={require('../assets/images/night.png')} /> */}

      <View  className="h-full w-full flex justify-around pt-4 bg-white" >
        <View className="flex items-center my-10">
            <Text 
                className="text-sky-500 font-bold tracking-wider text-5xl">
                    Đăng ký
            </Text>
        </View>

        <View className="flex items-center mx-5 space-y-4">
            <View 
                entering={FadeInDown.duration(1000).springify()} 
                className="bg-black/5 p-5 rounded-2xl w-full mb-2">
                <TextInput
                    placeholder="Tên người dùng"
                    placeholderTextColor={'black'}
                    onChangeText={(userName)=>{setUserName(userName)}}
                />
            </View>
            
            <DropdownComponent data={cities} itemKind={"Tỉnh/Thành Phố"} onChange={handleCityChange}/>
            <DropdownComponent data={multiDistrict} itemKind={"Quận/Huyện"} onChange={handleDistrictChange}/>
            <DropdownComponent data={multiTown} itemKind={"Xã Phường/thị Trấn"} onChange={handleTownChange}/>
            <View 
                className="bg-black/5 p-5 rounded-2xl w-full mb-2">
                <TextInput
                    placeholder="Địa chỉ"
                    placeholderTextColor={'black'}
                    onChangeText={(address)=>{setaddress(address)}}
                />
            </View>  

            <View 
                className="w-full"
                >
                <TextInput
                    className="bg-black/5 p-5 rounded-2xl w-full"
                    placeholder="Số điện thoại"
                    placeholderTextColor={'black'}
                    onChangeText={(sdt)=>{handleSdt(sdt)}}
                />
                 <Text className="mb-2 ml-3 text-red-500">{warnSdt}</Text>
            </View>
           
            <View 
                className="w-full">
                <TextInput
                    className="bg-black/5 p-5 rounded-2xl w-full"
                    placeholder="Mật khẩu"
                    placeholderTextColor={'black'}
                    secureTextEntry
                    onFocus={focusPass}
                    onChangeText={(pass)=>{setPassword(pass)}}
                />
                {
                handlePassword(password) 
                ? (<Text className="mb-2 ml-3 text-green-500">{warnPass}</Text> )
                : (<Text className="mb-2 ml-3 text-red-500">{warnPass}</Text>)
                }
                
            </View>
            <View 
                className="w-full">
                <TextInput
                    className="bg-black/5 p-5 rounded-2xl w-full"
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor={'black'}
                    secureTextEntry
                    onFocus={focusRepws}
                    onChangeText={(rePass)=>{onChangeRepws(rePass)}}
                />
                 {
                repassword == password
                ? <Text className="mb-2 ml-3 text-green-500">{warnRePass}</Text> 
                : <Text className="mb-2 ml-3 text-red-500">{warnRePass}</Text>
                }
            </View>
            <View className="w-full" entering={FadeInDown.delay(600).duration(1000).springify()}>
                <TouchableOpacity className="w-full bg-sky-500 p-3 rounded-2xl mb-3" 
                onPress={handleSignup}
                >
                    <Text className="text-xl font-bold text-black text-center">Đăng ký </Text>
                </TouchableOpacity>
            </View>

            <View 
                entering={FadeInDown.delay(800).duration(1000).springify()} 
                className="flex-row justify-center">

                <Text className="text-lg">Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={()=> navigation.navigate('Login', {backfromSignup: true})}>
                    <Text className="text-sky-500 mb-5 text-lg">Đăng nhập</Text>
                </TouchableOpacity>

            </View>
        </View>
      </View>
    </ScrollView>
  )
}
