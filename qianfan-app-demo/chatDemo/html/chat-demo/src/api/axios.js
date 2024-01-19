import axios from 'axios';

let baseUrl = '';

const instance = axios.create({
  // 这里是配置项
  timeout: 70000,
  withCredentials: false,
  baseURL: baseUrl,
});

instance.defaults.withCredentials = false;

// 拦截请求
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

// 拦截响应
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
