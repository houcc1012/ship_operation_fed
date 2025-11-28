// src/api/index.ts
import axios from "axios";
import { ElMessage } from "element-plus";
import { reject } from "lodash-es";

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// 登录检查开关
const enableLoginCheck = true;

// 登录检查
if (enableLoginCheck) {
}

// 设置cookie，保证后续请求带上cookie
apiClient.interceptors.request.use((config) => {
  return config;
});

//通用请求接口，返回数据
export const request = async (method: string, url: string, data?: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiClient.request({
        method,
        url,
        data,
      });
      //未登录，处理ajax请求
      if(response.data.code ==="00000003"){
        window.location.href = "/login";
        return;
      }
      if (response.data.code == "00000000") {
        resolve(response.data.result);
      } else {
        ElMessage.error(response.data.msg);
        reject(response.data.msg);
      }
    } catch (error) {
      console.error(`Error during ${method} request to ${url}:`, error);
      reject(error);
    }
  });
};

export const get = async (url: string) => {
  // 移除console.log("get", url);
  return request("get", url);
};

export const post = async (url: string, data: any) => {
  // 移除console.log("post", url, data);
  return request("post", url, data);
};

export const postFile = async (url: string, data: any) => {
  // 移除console.log("post", url);
  let method = "post";
  //二进制文件读取
  let  headers: any = {
    "Content-Type": "multipart/form-data",
  };
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error(`Error during ${method} request to ${url}:`, error);
    throw error;
  }
};

// 上传文件（multipart/form-data），遵循统一返回结构处理
export const upload = async (url: string, formData: FormData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiClient.request({
        method: 'post',
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if(response.data?.code === "00000003"){
        window.location.href = "/login";
        return;
      }
      if (response.data?.code === "00000000") {
        resolve(response.data.result);
      } else {
        ElMessage.error(response.data?.msg || '文件上传失败');
        reject(response.data?.msg || '文件上传失败');
      }
    } catch (error) {
      console.error(`Error during upload to ${url}:`, error);
      reject(error);
    }
  });
};
