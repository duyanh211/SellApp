
export default rootUrl = "http:/192.168.162.172:1144"

async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      throw error;
    }
  }

async function getProducts(){
    const url = `${rootUrl}/app/products`
    return await fetchData(url);
}

async function getSameProducts(idLoai,idUser){
    const url = `${rootUrl}/app/sameProducts/${idLoai}/${idUser}`
    return await fetchData(url);
}

async function getProductPost(id){
    const url = `${rootUrl}/app/product/${id}`
    return await fetchData(url);
}

async function getCategories() {
    const url = `${rootUrl}/app/catergories`;
    return await fetchData(url);
}
async function getCategoriesID(id) {
    const url = `${rootUrl}/app/catergories/${id}`;
    return await fetchData(url);
}


async function getUsers(){
    const url = `${rootUrl}/app/users`
    return await fetchData(url);

}

async function getUser(id){
    const url = `${rootUrl}/app/users/${id}`
    return await fetchData(url);
}


async function getCities(){
    const url = `${rootUrl}/app/cities`
    return await fetchData(url);

}

async function getDisttrict(id){
    const url = `${rootUrl}/app/cities/${id}`
    return await fetchData(url);
  
}

async function getTown(id){
    const url = `${rootUrl}/app/cities/district/${id}`
    return await fetchData(url);
}

async function getSearchResult(search){
    const url = `${rootUrl}/app/products/${search}`
    return await fetchData(url);
}

 async function fetchDataDB(getApi, setUseState){
    try {
        const data = await getApi();
        setUseState(data);
    } catch (error) {
        console.error('Error fetching database:', error);
    }
};

async function fetchDataWithID(getApi, id , setUseState){
    try {
        const data = await getApi(id);
        setUseState(data);
    } catch (error) {
        console.error('Error fetching database:', error);
    }
};


async function getStatus(){
    const url = `${rootUrl}/app/status`
    return await fetchData(url);
}

async function getFollowers(){
    const url = `${rootUrl}/app/users/followers`
    return await fetchData(url);
}

async function getFollowerOf(id){
    const url = `${rootUrl}/app/users/followerOf/${id}`
    return await fetchData(url);
}

async function getSubcribers(id){
    const url = `${rootUrl}/app/users/subcribers/${id}`
    return await fetchData(url);
}

function dateTimeCustom(dateString){
    var dateTime = new Date(dateString);

    var ngay = dateTime.getDate();
    var thang = dateTime.getMonth() + 1; 
    var nam = dateTime.getFullYear();
    var gio = dateTime.getHours();
    var phut = dateTime.getMinutes();

    // Định dạng lại chuỗi ngày giờ phút
    var dinhDangNgayGioPhut = ngay + '/' + thang + '/' + nam + ' ' + gio + ':' + (phut < 10 ? '0' : '') + phut;
    return dinhDangNgayGioPhut
}

async function getGroupChatID(gui, nhan, masp){
    const url = `${rootUrl}/app/chat/${gui}/${nhan}/${masp}`
    return await fetchData(url);
}

async function getMessagesGroup(id){
    const url = `${rootUrl}/app/chat/getMes/${id}`
    return await fetchData(url);
}



async function getGroupChat(id){
    const url = `${rootUrl}/app/chat/groupchats/${id}`
    return await fetchData(url);
}

async function getUserInfoGroupChat(id){
    const url = `${rootUrl}/app/chat/groupInfo/${id}`
    return await fetchData(url);
}

async function getoneUserInfo(id){
    const url = `${rootUrl}/app/chat/UserInfo/${id}`
    return await fetchData(url);
}

module.exports = {getProducts, getCategories,
                    getUsers, getCities, getDisttrict,
                    getTown, fetchDataDB, getStatus, dateTimeCustom,
                    getProductPost, getUser, getFollowers, getFollowerOf,
                    getSubcribers, getSameProducts,fetchDataWithID, 
                    getCategoriesID, getSearchResult, getGroupChatID, 
                    getMessagesGroup, getGroupChat, getUserInfoGroupChat,
                    getoneUserInfo}