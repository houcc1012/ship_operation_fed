
import {  post,postFile} from "./index";

export const getDataDictList = async (params:any) => {
  return post("/dataDict/list", params);
};
