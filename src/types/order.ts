export interface EntrustOrder {
    id: number;
    status:number;
    orderNo: string;
    createTime: string;
    updateTime: string;
    planWashParkLocation: string;
    planWashShipPosition: string;
    washShipRequirement:string;//洗船需求（多个逗号分割）
    planWashStartTime:string;
    planWashEndTime:string;
    shipCargo:string;// 船舶载货情况
    lastWashDate:string;// 上次洗船日期
    closeDesc: string;// 关闭或异常说明述
    shipownerInfo: ShipownerInfo;// 船方基础信息
    shipInfo: ShipInfo;// 船舶信息
    supplierId?: number;// 作业方ID
    operationInfo?: OperationInfo;// 作业信息
    fileResourceList?: FileResourceInfo[];// 委托方文件资源列表
    supplementFileResourceList?: FileResourceInfo[];//  运营补充文件资源列表

}

export interface ShipownerInfo { 
    id: number;
    companyName:string; // 船公司名称
    contactPerson: string; // 联系人
    contactPhone: string; // 联系电话
}

export interface ShipInfo { 
    id: number;
    cnName: string; // 船舶中文名称
    enName: string; // 船舶英文名称
    shipLength: string; // 船长
    shipWidth: string; // 船宽
    lightDraft: string; // 空载吃水
    captainName: string; // 船长
    captainPhone: string; // 联系方式
}

export interface OperationInfo{
    supplierInfo: SupplierInfo;// 作业方信息
    supplierShipInfo: SupplierShipInfo;// 作业方船舶信息
    supplierWorkers: SupplierWorkerInfo[];// 作业方工作人员信息
    fileResourceList?: FileResourceInfo[];
    planWorkStartTime: string; // 计划作业开始时间
    planWorkEndTime: string; // 计划作业结束时间
    actualWorkStartTime: string; // 实际作业开始时间
    actualWorkEndTime: string;
    isPersonLaunch: boolean; // 是否有人员下水
    operationCompany: string; // 作业公司名称
    operationContactUser: string; // 作业方联系人
    operationContactPhone: string; // 作业方联系人电话

}


export interface SupplierInfo{
    id: number;
    name: string; // 作业方名称
    contactUser: string; // 联系人
    contactPhone: string; // 联系电话
}

export interface SupplierShipInfo{
    id: number;
    cnName: string; // 船舶中文名称
    enName: string; // 船舶英文名称
    captainName: string; // 船长
    captainPhone: string; // 联系方式
    companyName: string; // 作业船只所属公司
}

export interface SupplierWorkerInfo{
    id: number;
    userName: string; // 联系人
    phone: string; // 联系电话
}

export interface FileResourceInfo{
    resourceId: number;
    resourceName: string; // 资源名
    fileName: string; // 文件名称
    fileType: string; // 文件类型
    url: string; // 文件url
    size: number; // 文件大小
}


export interface SupplierContact{
    id: number;
    userName: string; // 联系人phone
    phone: string;

}

export interface ExportTask{
    taskNo: string;
    status: number;//0-未执行 1-执行中 2成功 3-失败
    createTime:string;
    errorInfo: string;
    entrustOrderNoList: string[];// 导出的订单编号
    fileResource?: FileResourceInfo;
}
