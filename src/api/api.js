
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

// 删除品牌
export const saveBrand = params => axios.post(`${base}/manage/saveBrand`, params).then(res => res.data);

// 删除品牌
export const deleteBrand = params => axios.post(`${base}/manage/deleteBrand`, params).then(res => res.data);

// 获取类目
export const getCategoryList = params => axios.post(`${base}/category/getCategoryList`, params).then(res => res.data);

export const getBrandAttachment = params => axios.post(`${base}/brand/getBrandAttachment`, params).then(res => res.data);

export const getAgentBrandList = params => axios.post(`${base}/manage/getAgentBrandList`, params).then(res => res.data);

// 获取可选渠道列表
export const getChannelOptionList = params => axios.post(`${base}/manage/getChannelOptionList`, params).then(res => res.data);
