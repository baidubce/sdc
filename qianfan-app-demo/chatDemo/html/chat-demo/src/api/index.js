/**
 * API接口集合
 * @author v_qindinglu
 */

import axios from './axios';

const api = (type, url, params, head) => {
  switch (type) {
    case 'post':
      return axios.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...head } });
    case 'get':
      return axios.get(url, { params, headers: head });
    case 'delete':
      return axios.delete(url + '/' + params, { headers: head });
    case 'put':
      return axios.put(url, params, { headers: head });
    default:
  }
};
const api_method = {
  sendMsg: (params, head) => api('get', '/v1/ernie/chat', params, head), // 发送消息
  getModels: () => api('get', '/v1/ernie/models'), // 获取模型
  getVersion: () => api('get', '/v1/ernie/version'), // 获取版本号
};

export default api_method;
