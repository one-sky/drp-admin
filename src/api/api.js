
import axios from 'axios';

const base = 'http://localhost:8282/drp';

axios.defaults.headers.get['Content-Type'] = 'application/json';

// 用户登陆
export const login = params => axios.post(`${base}/user/login`, params).then(res => res.data);

// 获取用户信息
export const getUserList = params => axios.post(`${base}/manage/getUserList`, params).then(res => res.data);

// 更改用户积分
export const updatePoint = params => axios.post(`${base}/manage/updatePoint`, params).then(res => res.data);