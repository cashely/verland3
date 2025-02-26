import axios from "axios";
import { getTokenFromLocalStorage } from '@/utils';
import { notification, message } from 'antd';

//axios实例
const request = axios.create();
request.defaults.timeout = 8000;
request.defaults.baseURL = import.meta.env.VITE_API_BASE_URI;

request.interceptors.request.use((config) => {
    const controller = new AbortController();
    config.signal = controller.signal;
    const token = getTokenFromLocalStorage();
    if (token) {
        config.url = `${config.url}?token=Bearer ${token}`
        // config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    notification.error({
        placement: "bottomRight",
        message: error?.config?.signal?.reason || "请求失败",
        description: `${error.reason}\n${error.code}`
    })
})

request.interceptors.response.use((response) => {
    console.log(response.data, 'responseData')
   
    if (response.data.code === 401) {
        message.error("未获取到授权信息,请重新登录!");
        // 清除token
        localStorage.removeItem("token");
        // 跳转到登录页
        window.location.href = "/#/login";
        return;
    } else if (response.data.code !== 200) {
        notification.error({
            placement: "bottomRight",
            message: "请求失败",
            description: `${response.data.message}`
        })
        return {};
    }
    return response.data;
}, error => {
    if (error.status === 401) {
        message.error("未获取到授权信息,请重新登录!");
        // 跳转到登录页
        window.location.href = "/#/login";
        return;
    }
    notification.error({
        placement: "bottomRight",
        message: error?.config?.signal?.reason || "请求失败",
        description: `${error.message}\n${error.code}`
    })
    return Promise.reject(error);
})

export type Response<T = any> = {
    status: boolean;
    message: string;
    result: T;
};


export default request;