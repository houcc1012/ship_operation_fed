
import {  post, postFile, upload } from "./index";

export const getEntrustOrderList = async (params: any) => {
  return post("/entrustOrder/list", params);
};

export const updateEntrustOrder = async (params: any) => {
  return post("/entrustOrder/update", params);
};

export const getEntrustOrderDetail = async (params: any) => {
  return post("/entrustOrder/getDetail", params);
};

export const getSupplierList = async (params: any) => {
  return post("/supplier/list", params);
};

export const addSupplier = async (params: any) => {
  return post("/supplier/addSupplier", params);
};

export const deleteSupplier = async (params: any) => {
  return post("/supplier/deleteSupplier", params);
};


export const getSupplierWorkerList = async (params: any) => {
  return post("/supplier/workerList", params);
};

export const getSupplierShipList = async (params: any) => {
  return post("/supplier/shipList", params);
};

export const getSupplierContactList = async (params: any) => {
  return post("/supplier/contactList", params);
};

export const getShipownerList = async () => {
  return post("/shipowner/getShipownerList", {});
};

export const getShipownerShipList = async () => {
  return post("/shipowner/getShipInfoList", {});
};



export const assignSupplier = async (params: any) => {
  return post("/entrustOrder/assignSupplier", params);
};


export const getExportTaskList = async (params: any) => {
  return post("/export/taskList", params);
};

export const batchExportOrders = async (params: any) => {
  return post("/export/batchExportOrders", params);
};



