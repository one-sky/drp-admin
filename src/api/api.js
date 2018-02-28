
import axios from 'axios';

const base = 'http://localhost:8282/drp';

axios.defaults.headers.get['Content-Type'] = 'application/json';

// 用户登陆
export const login = params => axios.post(`${base}/user/login`, params).then(res => res.data);

// 获取用户信息
export const getUserList = params => axios.post(`${base}/manage/getUserList`, params).then(res => res.data);

// 更改用户积分
export const updatePoint = params => axios.post(`${base}/manage/updatePoint`, params).then(res => res.data);

// 获取平台品牌
export const getBrandList = params => axios.post(`${base}/manage/getBrandList`, params).then(res => res.data);

// 获取平台品牌详情
export const getBrandById = params => axios.post(`${base}/brand/getBrandById`, params).then(res => res.data);

// 根据类目获取平台品牌
export const getBrandListByCategoryId = params => axios.post(`${base}/brand/getBrandListByCategoryId`, params).then(res => res.data);

// 获取spu列表
export const getProductList = params => axios.post(`${base}/product/getProductList`, params).then(res => res.data);

// 获取spu详情
export const getSpuDetail = params => axios.post(`${base}/product/getSpuDetail`, params).then(res => res.data);

// 删除品牌
export const saveBrand = params => axios.post(`${base}/manage/saveBrand`, params).then(res => res.data);

// 删除品牌
export const deleteBrand = params => axios.post(`${base}/manage/deleteBrand`, params).then(res => res.data);

// 获取类目
export const getCategoryList = params => axios.post(`${base}/category/getCategoryList`, params).then(res => res.data);

// 获取属性
export const getAttributeList = params => axios.post(`${base}/category/getAttributeList`, params).then(res => res.data);

// 获取类目
export const getCategoryById = params => axios.post(`${base}/category/getCategoryById`, params).then(res => res.data);

export const getBrandAttachment = params => axios.post(`${base}/brand/getBrandAttachment`, params).then(res => res.data);

export const getAgentBrandList = params => axios.post(`${base}/manage/getAgentBrandList`, params).then(res => res.data);

// 获取可选渠道列表
export const getChannelOptionList = params => axios.post(`${base}/resource/getChannelOptionList`, params).then(res => res.data);

export const updateAgentStatus = params => axios.post(`${base}/manage/updateAgentStatus`, params).then(res => res.data);

// 保存类目
export const saveCategory = params => axios.post(`${base}/manage/saveCategory`, params).then(res => res.data);

// 删除类目
export const deleteCategory = params => axios.post(`${base}/manage/deleteCategory`, params).then(res => res.data);

// 保存属性大类
export const saveAttr = params => axios.post(`${base}/manage/saveAttr`, params).then(res => res.data);

// 删除属性大类
export const deleteAttr = params => axios.post(`${base}/manage/deleteAttr`, params).then(res => res.data);

// 保存子属性
export const saveAttrValue = params => axios.post(`${base}/manage/saveAttrValue`, params).then(res => res.data);

// 删除子属性
export const deleteAttrValue = params => axios.post(`${base}/manage/deleteAttrValue`, params).then(res => res.data);
