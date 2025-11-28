import {  upload } from "./index";
// 上传委托单相关文件，支持附加参数
// fileOrForm: 可以是 File/Blob 或已构造好的 FormData
// extraParams: 其他需要一并提交的字段（如 orderId、resourceType 等）
export const uploadFile = async (
  fileOrForm: File | Blob | FormData,
  extraParams?: Record<string, any>
) => {
  const formData = fileOrForm instanceof FormData ? fileOrForm : new FormData();
  if (!(fileOrForm instanceof FormData)) {
    formData.append('file', fileOrForm);
  }
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
  }
  // 统一使用 upload，遵循接口返回结构（code/result/msg）
  return upload('/file/upload', formData);
};