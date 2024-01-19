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
  upDoc: (id, params, head) => api('post', `/v1/ernie/embedding?model=${id}`, params, head), //上传文档
  getEmbedding: (params, head) => api('get', `/v1/ernie/embedding`, params, head), //获取是否已经上传过文档
  getPrivatePrompt: (params, head) => api('get', `/v1/ernie/privatePrompt`, params, head),//获取Prompt模板信息
  setPrivatePrompt: (params, head) => api('post', `/v1/ernie/privatePrompt`, params, head),//设置Prompt模板信息

  getEmbeddingSuggest: (params, head) => api('get', `/v1/ernie/embeddingSuggest`, params, head),//添加推荐提示词


};

export default api_method;
