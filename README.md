# drp-admin

> 智能家居分销平台的系统管理员系统ElementUI+Vue+Vue-Router+Axios

## Build Setup


## 本地环境搭建
```bash
# 拉取项目
git clone git@github.com:one-sky/drp-admin.git

# install dependencies
npm install

# serve with hot reload at localhost:8088
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 浏览
https://127.0.0.1:8088/center
```

## 简单介绍
 ``` src/views ```下的页面对应一个  ``` src/css ```中的样式
 ``` src/css/common/ui_base ``` 为elementui基础公用组件样式
 ``` src/css/common/ui_box ``` 为div的位置样式

## 主要业务逻辑
 * ``` src/views/center ``` 本系统的首页
 * ``` src/views/brand ``` 本系统的品牌管理，包括分销商品牌代理申请拒绝与查看、品牌品牌增删改
 * ``` src/views/category ``` 本系统的属性管理，包括一级、二级类目、标签的增删改
 * ``` src/views/order ``` 本系统的订单管理，尚未开发售后
 * ``` src/views/product ``` 本系统的商品管理，包括spu与sku的增删改，sku的设置涉及批发的量、会员等级与价格
 * ``` src/views/promotion ``` 本系统的促销管理，包括促销文章的发布，相关促销的商品选择与设置批量促销价格
 * ``` src/views/distribution ``` 本系统的用户管理，展示所有注册用户的信息，对于完善信息的用户（即分销商）可设置某个商品的批量与价格
 * ``` src/views/resource ``` 本系统的内容设置，包括设置banner图、发布公告，待完善
