
import {  post,postFile} from "./index";

export const getDataDictList = async (params:any) => {
  return post("/dataDict/list", params);
};


export const updateDataDict= async (params:any) => {
  return post("/dataDict/update", params);
};
