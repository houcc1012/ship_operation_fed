
import {  post,postFile} from "./index";

export const login = async (account:String,password:String) => {
  let data = { account,password};
  return post("/user/login", data);
};

export const getUserInfo = async () => {
  return post("/user/getUserinfo", {});
};

export const getAppUserList = async (params:any) => {
  return post("/user/appUserList", params);
};

export const getAdminUserList = async (params:any) => {
  return post("/user/adminUserList", params);
};

export const enableUser = async (params:any) => {
  return post("/user/enableUser", params);
};
