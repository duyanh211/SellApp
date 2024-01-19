export const categories = [
    {
        id: 1,
        name: 'Quần áo',
        image: require('../public/images/fashons.webp'),
    },
    {
        id: 2,
        name: 'Đa dụng',
        image: require('../public/images/stElse.webp'),
    },
    {
        id: 3,
        name: 'Nội thất',
        image: require('../public/images/funitures.webp'),
    },
    {
        id: 4,
        name: 'Thú cưng',
        image: require('../public/images/12000.webp'),
    },
    {
        id: 5,
        name: 'Điện tử',
        image: require('../public/images/electricDevices.webp'),
    },
    {
        id: 6,
        name: 'Thể thao, Giải trí',
        image: require('../public/images/hoppys.webp'),
    },
    {
        id: 7,
        name: 'Thiết bị văn phòng',
        image: require('../public/images/officeDevices.webp'),
    },
    {
        id: 8,
        name: 'Cho tặng Free',
        image: require('../public/images/giveFree.webp'),
    },

]

export const getCategories = () => {
    return new Promise((resolve) => {
        resolve(categories);
    });
};


export const products = [
    { id: 1, name: 'Chó cỏ đáng yêu' , image: 'cunCo.webp'},
    { id: 2, name: 'Camera HP R7 17' , image: 'camerahpr717.jpg'},
    { id: 3, name: 'Combo dây nhảy' , image: 'daynhay.webp'},
    { id: 4, name: 'Đĩa gốm sứ' , image: 'diaGomsu.webp'},
    { id: 5, name: 'Guitar dùng 1 năm' , image: 'guitar.webp'},
    { id: 6, name: 'Ghế sopha mới 80%', image: 'gheSopha.webp'},
    { id: 7, name: 'lapTop HP15', image: 'laptopHp15.jpg'},
    { id: 8, name: 'Giày Nike', image: 'Nikeshose.webp'},
    { id: 9, name: 'Áo sơ mi mới mua', image: 'tshirt.webp'},
    { id: 10, name: 'Áo mặc 10 năm', image: 'tshirt.webp'},
  ];

  export const getProducts = () => {
    return new Promise((resolve) => {
        resolve(products);
    });
};