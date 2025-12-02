<template>
    <div class="job-detail-page">
        <!-- 页面头部 -->
        <div class="page-header">
            <h1>作业详情</h1>
            <el-tag :type="getStatusTagType(entrustDetail?.status)">{{ getStatusName(entrustDetail?.status) }}</el-tag>
            <span class="job-code">作业编号：{{ entrustDetail?.orderNo }}</span>
            <div class="header-actions">
                <el-button type="default" @click="handleBack"><el-icon>
                        <Back />
                    </el-icon>返回列表</el-button>
                <el-button type="primary" @click="handleEdit">{{ isEditing ? '退出编辑' : '编辑信息' }}</el-button>
            </div>
        </div>

        <!-- 船方信息区域 -->
        <el-card class="section-card">
            <h2 class="section-title">船方信息</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">船公司名称</span>
                    <span class="value">
                        <el-input v-model="editEntrustDetail.shipownerInfo.companyName" :readonly="true"
                            :disabled="!isEditing" placeholder="请选择船公司" @click="isEditing" @focus="isEditing">
                            <template #suffix>
                                <el-icon v-if="isEditing" style="cursor: pointer" @click.stop="openShipownerDialog">
                                    <Document />
                                </el-icon>
                            </template>
                        </el-input>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">船舶联系人</span>
                    <span class="value">
                        <el-input :model-value="displayShipownerContact" disabled placeholder="联系人（含手机号）" />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">船舶信息</span>
                    <span class="value">
                        <el-input :model-value="displayShipownerShip" :readonly="true" :disabled="!isEditing"
                            placeholder="请选择船舶" @click="isEditing" @focus="isEditing">
                            <template #suffix>
                                <el-icon v-if="isEditing" style="cursor: pointer" @click.stop="openShipDialog">
                                    <Document />
                                </el-icon>
                            </template>
                        </el-input>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">计划洗船位置</span>
                    <span class="value">
                        <el-input v-model="editEntrustDetail.planWashParkLocation" :disabled="!isEditing"
                            placeholder="计划洗船位置" />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">计划洗船时间</span>
                    <span class="value">
                        <el-date-picker v-model="planWashTimeRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm"
                            value-format="YYYY-MM-DD HH:mm" :disabled="!isEditing" style="width: 100%;" />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">船舶载货情况</span>
                    <span class="value">
                        <el-input v-model="editEntrustDetail.shipCargo" :disabled="!isEditing" type="text"
                            placeholder="船舶载货情况" />
                    </span>
                </div>
            </div>

            <div class="label-group" style="flex-direction: column;align-items: flex-start;">
                <view class="label">洗船需求</view>
                <!-- 非编辑模式：展示已选需求为标签 -->
                <el-row>
                    <template v-if="!isEditing">
                        <el-tag v-for="item in washRequirementsModel" :key="item"
                            style="margin-right: 8px; margin-bottom: 6px;">
                            {{ item }}
                        </el-tag>
                        <span v-if="washRequirementsModel.length === 0"
                            style="color: var(--el-text-color-secondary);">暂无选择</span>
                    </template>
                    <!-- 编辑模式：展示复选框，数据来源 washShipRequirementDict -->
                    <template v-else>
                        <el-checkbox-group v-model="washRequirementsModel">
                            <el-checkbox v-for="item in washRequirementOptions" :key="item as string"
                                :label="item as string" style="margin-right: 16px; margin-bottom: 8px;">
                                {{ item }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-row>

            </div>

            <div class="info-item">
                <span class="label">上次洗舱时间</span>
                <span class="value">
                    <el-date-picker v-model="editEntrustDetail.lastWashDate" type="datetime" placeholder="选择时间"
                        format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled="!isEditing" />
                </span>
            </div>
        </el-card>

        <!-- 作业信息区域 待作业-->
        <el-card v-if="editEntrustDetail.status >= 3" class="section-card">
            <h2 class="section-title">作业信息</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">作业公司名称</span>
                    <span class="value" style="display: inline-block; width: 100%;">
                        <el-input v-model="operationCompanyDisplay" :disabled="!isEditing" placeholder="请输入作业公司名称" />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">作业联系人</span>
                    <span class="value" style="display: inline-block; width: 100%;">
                        <el-input v-model="operationContactDisplay" :disabled="!isEditing" placeholder="请选择作业联系人"
                            @focus="isEditing">
                            <template #suffix>
                                <el-icon v-if="isEditing" style="cursor: pointer"
                                    @click.stop="openSupplierContactDialog">
                                    <document />
                                </el-icon>
                            </template>
                        </el-input>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">计划作业时间</span>
                    <span class="value" style="display: inline-block; width: 100%;">
                        <el-date-picker v-model="operationPlanWorkRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm"
                            value-format="YYYY-MM-DD HH:mm" :disabled="!isEditing" style="width: 100%;" />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">实际作业时间</span>
                    <span class="value">
                        <el-date-picker v-model="operationActualWorkRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm"
                            value-format="YYYY-MM-DD HH:mm" :disabled="!isEditing" style="width: 100%;" />
                    </span>
                </div>
            </div>

            <!-- 作业人员清单 -->
            <div class="sub-section">
                <h3 class="sub-title">作业人员清单</h3>
                <el-table :data="editEntrustDetail?.operationInfo?.supplierWorkers || []" border style="width: 100%">
                    <el-table-column prop="userName" label="姓名" />
                    <el-table-column prop="phone" label="手机号" />
                    <el-table-column v-if="isEditing" label="操作" width="300">
                        <template #default="scope">
                            <el-button type="danger" size="small"
                                @click="removeSupplierWorker(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="header-actions" style="margin-top:20px;justify-content: flex-start;">
                    <el-button type="primary" v-if="isEditing" @click="openStaffDialog">选择作业人员</el-button>
                </div>
            </div>

            <!-- 人员下水情况 -->
            <div class="sub-section">
                <h3 class="sub-title">人员下水情况</h3>
                <span class="value">
                    <el-select v-model="isPersonLaunchModel" :disabled="!isEditing" placeholder="选择是否下水"
                        style="width: 160px;">
                        <el-option :value="true" label="有" />
                        <el-option :value="false" label="无" />
                    </el-select>
                </span>
            </div>

            <!-- 作业船信息 -->
            <div class="sub-section">
                <h3 class="sub-title">作业船信息</h3>
                <span v-if="isEditing" class="value"
                    style="display: flex; align-items: center; gap: 8px;margin-bottom: 15px;">
                    <el-input v-model="operationSupplierShipDisplay" :disabled="!isEditing" placeholder="选择作业船"
                        style="flex: 1;" @focus="isEditing" readonly>
                        <template #suffix>
                            <el-icon v-if="isEditing" @click.stop="openSupplierOperationShipDialog">
                                <Document />
                            </el-icon>
                        </template>
                    </el-input>
                </span>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">作业船</span>
                        <span class="value">{{ operationSupplierShipDisplay }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">所属公司</span>
                        <span class="value">{{ editEntrustDetail?.operationInfo?.supplierShipInfo?.companyName || '无'
                            }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">船长姓名</span>
                        <span class="value">{{ editEntrustDetail?.operationInfo?.supplierShipInfo?.captainName || '无'
                            }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">联系方式</span>
                        <span class="value">{{ editEntrustDetail?.operationInfo?.supplierShipInfo?.captainPhone || '无'
                            }}</span>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 附件组合区域 -->
        <el-card class="section-card">
            <h2 class="section-title">附件组合</h2>
            <div class="file-grid">
                <el-card class="file-card" v-for="(file, idx) in combinedFileList" :key="file.resourceId || idx">
                    <div class="file-icon" :style="{ backgroundColor: getFileColor(file.fileType) }">
                        <el-icon>
                            <document />
                        </el-icon>
                    </div>
                    <div class="file-info">
                        <div class="file-name">{{ file.resourceName }}</div>
                        <el-row style="">
                            <div class="file-note" style="margin-right: 5px;">{{ file.fileType.toLocaleUpperCase() }}
                            </div>
                            <div class="file-size">{{ formatFileSize(file.size) }}</div>
                        </el-row>
                    </div>
                    <el-button type="text" :icon="Download" class="download-btn" @click="downloadFile(file)" />
                    <el-button v-if="isEditing" type="text" :icon="Delete" class="delete-btn"
                        @click="deleteCombinedFile(file)" />
                </el-card>
            </div>
            <el-button style="margin-top: 20px;" type="primary" v-if="isEditing" @click="openUploadDialog">+
                上传补充材料</el-button>
        </el-card>

        <!-- 运营人员补充文件区域 -->
        <el-card class="section-card">
            <h2 class="section-title">运营人员补充文件</h2>
            <div class="file-note">补充文件不向船方和作业方公开</div>
            <div class="file-grid">
                <el-card class="file-card" v-for="(file, idx) in editEntrustDetail.supplementFileResourceList"
                    :key="file.resourceId || idx">
                    <div class="file-icon" :style="{ backgroundColor: getFileColor(file.fileType) }">
                        <el-icon>
                            <document />
                        </el-icon>
                    </div>
                    <div class="file-info">
                        <div class="file-name">{{file.resourceName }}</div>
                        <el-row>
                            <div class="file-note" style="margin-right: 5px;">{{ (file.fileType || '').toLocaleUpperCase()
                                }}
                            </div>
                            <div class="file-size">{{ formatFileSize(file.size) }}</div>
                        </el-row>
                    </div>
                    <el-button type="text" :icon="Download" class="download-btn" @click="downloadFile(file)" />
                    <el-button v-if="isEditing" type="text" :icon="Delete" class="delete-btn"
                        @click="deleteSupplementFile(file)" />
                </el-card>
            </div>
            <el-button style="margin-top: 20px;" type="primary" v-if="isEditing" @click="openStaffUploadDialog">+
                上传运营补充材料</el-button>
        </el-card>
        <!-- 编辑底部操作 -->
        <div class="edit-footer" v-if="isEditing">
            <el-button @click="handleCancelEdit">取消</el-button>
            <el-button type="primary" @click="handleSaveEdit">保存修改</el-button>
        </div>
    </div>

    <!-- 选择作业人员弹窗 -->
    <el-dialog v-model="staffDialogVisible" title="选择作业人员" width="600px">
        <el-table :data="supplierWorkerList" @selection-change="handleStaffSelectionChange" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="userName" label="姓名" />
            <el-table-column prop="phone" label="手机号" />
        </el-table>
        <template #footer>
            <el-button @click="staffDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addSelectedStaff">确定添加</el-button>
        </template>
    </el-dialog>

    <!-- 选择作业船舶（作业方）弹窗 -->
    <el-dialog v-model="supplierOperationShipDialogVisible" title="选择作业船舶（作业方）" width="720px">
        <div class="shipowner-search-bar">
            <el-input v-model="supplierOperationShipSearch" clearable placeholder="按船名搜索（中文/英文）" />
        </div>
        <el-table :data="filteredSupplierOperationShips" style="width: 100%" border highlight-current-row
            @row-click="onSupplierOperationShipRowClick">
            <el-table-column label="选择" width="80">
                <template #default="scope">
                    <el-radio :label="scope.row.id" v-model="selectedSupplierOperationShipId">{{ '' }}</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="cnName" label="中文名" min-width="160" />
            <el-table-column prop="enName" label="英文名" min-width="200" />
            <el-table-column prop="captainName" label="船长" min-width="140" />
            <el-table-column prop="captainPhone" label="联系方式" min-width="160" />
        </el-table>
        <template #footer>
            <el-button @click="supplierOperationShipDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmSupplierOperationShipSelection">确认选择</el-button>
        </template>
    </el-dialog>

    <!-- 上传补充材料弹窗 -->
    <el-dialog v-model="uploadDialogVisible" title="上传补充材料" width="520px">
        <el-form label-width="100px">
            <el-form-item label="资源类型">
                <el-select v-model="selectedResourceName" placeholder="请选择资源类型">
                    <el-option v-for="name in FILE_RESOURCE_TITLES" :key="name" :label="name" :value="name" />
                </el-select>
            </el-form-item>
            <el-form-item label="选择文件">
                <input type="file" accept="image/*,.pdf" @change="onUploadFileChange" />
                <!-- <div v-if="selectedFileName" class="file-hint">{{ selectedFileName }}</div> -->
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="uploadDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmUpload">确认上传</el-button>
        </template>
    </el-dialog>

    <!-- 运营人员补充文件上传弹窗（资源类型手动输入） -->
    <el-dialog v-model="staffUploadDialogVisible" title="上传运营补充材料" width="520px">
        <el-form label-width="100px">
            <el-form-item label="资源类型">
                <el-input v-model="staffResourceName" placeholder="请输入资源类型（例如：费用结算单）" />
            </el-form-item>
            <el-form-item label="选择文件">
                <input type="file" accept="image/*,.pdf" @change="onStaffUploadFileChange" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="staffUploadDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmStaffUpload">确认上传</el-button>
        </template>
    </el-dialog>

    <!-- 选择船舶弹窗 -->
    <el-dialog v-model="shipDialogVisible" title="选择船舶" width="800px">
        <div class="shipowner-search-bar">
            <el-input v-model="shipSearch" clearable placeholder="按船名搜索（中文/英文）" />
        </div>
        <el-table :data="filteredShips" style="width: 100%" border highlight-current-row @row-click="onShipRowClick">
            <el-table-column label="选择" width="80">
                <template #default="scope">
                    <el-radio :label="scope.row.id" v-model="selectedShipId">{{ '' }}</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="cnName" label="中文名" min-width="160" />
            <el-table-column prop="enName" label="英文名" min-width="200" />
            <el-table-column prop="captainName" label="船长" min-width="140" />
            <el-table-column prop="captainPhone" label="联系方式" min-width="160" />
        </el-table>
        <template #footer>
            <el-button @click="shipDialogVisible = false">取消</el-button>
            <el-button type="primary" :disabled="!selectedShipId" @click="confirmShipSelection">确定</el-button>
        </template>
    </el-dialog>

    <!-- 选择船公司弹窗 -->
    <el-dialog v-model="shipownerDialogVisible" title="选择船公司" width="800px">
        <div class="shipowner-search-bar">
            <el-input v-model="shipownerSearch" clearable placeholder="按公司名称搜索" />
        </div>
        <el-table :data="filteredShipowners" style="width: 100%" border highlight-current-row
            @row-click="onShipownerRowClick">
            <el-table-column label="选择" width="80">
                <template #default="scope">
                    <el-radio :label="scope.row.id" v-model="selectedShipownerId">{{ '' }}</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="companyName" label="船公司" min-width="200" />
            <el-table-column prop="contactPerson" label="联系人" min-width="140" />
            <el-table-column prop="contactPhone" label="电话" min-width="160" />
        </el-table>
        <template #footer>
            <el-button @click="shipownerDialogVisible = false">取消</el-button>
            <el-button type="primary" :disabled="!selectedShipownerId" @click="confirmShipownerSelection">确定</el-button>
        </template>
    </el-dialog>

    <!-- 选择作业联系人弹窗 -->
    <el-dialog v-model="supplierContactDialogVisible" title="选择作业联系人" width="600px">
        <div class="shipowner-search-bar">
            <el-input v-model="supplierContactSearch" clearable placeholder="按姓名或电话搜索" />
        </div>
        <el-table :data="filteredSupplierContacts" style="width: 100%" border highlight-current-row
            @row-click="onSupplierContactRowClick">
            <el-table-column label="选择" width="80">
                <template #default="scope">
                    <el-radio :label="scope.row.id" v-model="selectedSupplierContactId"></el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="联系人" min-width="160" />
            <el-table-column prop="phone" label="电话" min-width="160" />
        </el-table>
        <template #footer>
            <el-button @click="supplierContactDialogVisible = false">取消</el-button>
            <el-button type="primary" :disabled="!selectedSupplierContactId"
                @click="confirmSupplierContactSelection">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { Back, Document, Download, Delete } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { getEntrustOrderDetail, getShipownerList, getShipownerShipList, getSupplierContactList, getSupplierList, getSupplierShipList, getSupplierWorkerList, updateEntrustOrder } from '@/api/entrustOrder';
import type { EntrustOrder, ShipInfo, ShipownerInfo, SupplierContact, SupplierShipInfo, SupplierWorkerInfo, FileResourceInfo } from '@/types/order';
import { getDataDictList } from '@/api/dataDictApi';
import { FILE_RESOURCE_TITLES } from '@/types/common';
import { uploadFile } from '@/api/fileApi';
import { ElMessage } from 'element-plus';

const route = useRoute();
const entrustOrderId = route.params.id;

const entrustDetail = ref<EntrustOrder>();
const editEntrustDetail = ref<EntrustOrder>({
    id: 0,
    status: 0,
    orderNo: '',
    createTime: '',
    updateTime: '',
    planWashParkLocation: '',
    planWashShipPosition: '',
    washShipRequirement: '',
    planWashStartTime: '',
    planWashEndTime: '',
    shipCargo: '',
    lastWashDate: '',
    closeDesc: '',
    shipownerInfo: {
        id: 0,
        companyName: '',
        contactPerson: '',
        contactPhone: '',
    },
    shipInfo: {
        id: 0,
        cnName: '',
        enName: '',
        shipLength: '',
        shipWidth: '',
        lightDraft: '',
        captainName: '',
        captainPhone: '',
    },
    fileResourceList: [],
    supplementFileResourceList: [],
    operationInfo: {
        supplierInfo: {
            id: 0,
            name: '',
            contactUser: '',
            contactPhone: '',
        },
        supplierShipInfo: {
            id: 0,
            cnName: '',
            enName: '',
            captainName: '',
            captainPhone: '',
            companyName: '',
        },
        supplierWorkers: [],
        fileResourceList: [],
        planWorkStartTime: '',
        planWorkEndTime: '',
        actualWorkStartTime: '',
        actualWorkEndTime: '',
        isPersonLaunch: false,
        operationCompany: '',
        operationContactUser: '',
        operationContactPhone: ''
    }
} as EntrustOrder);

// 作业人员worker列表
const supplierWorkerList = ref<SupplierWorkerInfo[]>([]);
// 作业船只
const supplierShipList = ref<SupplierShipInfo[]>([]);
//作业方联系人
const supplierContactList = ref<SupplierContact[]>([]);

// 船方列表
const shipownerList = ref<ShipownerInfo[]>([]);

// 船方船舶列表
const shipownerShipList = ref<ShipInfo[]>([]);

// 计划洗船时间范围代理（开始/结束），绑定到 editEntrustDetail.planWashStartTime/planWashEndTime
const planWashTimeRange = computed<any>({
    get() {
        const start = editEntrustDetail.value?.planWashStartTime || '';
        const end = editEntrustDetail.value?.planWashEndTime || '';
        if (!start && !end) return [];
        return [start || '', end || ''];
    },
    set(val: [string, string] | any) {
        if (!editEntrustDetail.value) return;
        const start = Array.isArray(val) ? (val[0] || '') : '';
        const end = Array.isArray(val) ? (val[1] || '') : '';
        editEntrustDetail.value.planWashStartTime = start || '';
        editEntrustDetail.value.planWashEndTime = end || '';
    }
});

// 洗船需求字典
const washShipRequirementDict = ref<String[]>([]);
// 扁平化字典项，防止接口返回嵌套数组导致选项渲染异常
const washRequirementOptions = computed(() => {
    const raw: any = washShipRequirementDict.value || [];
    if (Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0])) {
        return raw.flat();
    }
    return raw;
});

// 复选框双向绑定到字符串字段：editEntrustDetail.washShipRequirement（逗号分隔）
const washRequirementsModel = computed<string[]>({
    get() {
        const s = editEntrustDetail.value?.washShipRequirement || '';
        return s ? s.split(',').map((i) => i.trim()).filter(Boolean) : [];
    },
    set(val) {
        if (!editEntrustDetail.value) return;
        editEntrustDetail.value.washShipRequirement = (val || []).join(',');
    }
});

onMounted(() => {
    refreshOrderDetail();
    refreshShipownerList();
    refreshShipownerShipList();
    refreshDataDictList();
});

const refreshOrderDetail = async () => {
    getEntrustOrderDetail({ id: entrustOrderId }).then(res => {
        entrustDetail.value = res;
        // 使用深拷贝生成编辑副本，避免与原始数据共享引用导致取消编辑无法还原
        resetOrderData();
        //待作业
        if (entrustDetail.value?.status >= 3) {
            refreshSupplierContactList(entrustDetail.value?.supplierId);
            refreshSupplierShipList(entrustDetail.value?.supplierId);
            refreshSupplierWorkerList(entrustDetail.value?.supplierId);
        }
    });
};
const refreshSupplierWorkerList = async (supplierId: number) => {
    getSupplierWorkerList({ supplierId }).then(res => {
        supplierWorkerList.value = res;
    });
};

const refreshSupplierShipList = async (supplierId: number) => {
    getSupplierShipList({ supplierId }).then(res => {
        supplierShipList.value = res;
    });
};

const refreshSupplierContactList = async (supplierId: number) => {
    getSupplierContactList({ supplierId }).then(res => {
        supplierContactList.value = res;
    });
};

const refreshShipownerList = async () => {
    getShipownerList().then(res => {
        shipownerList.value = res;
    });
};


const refreshShipownerShipList = async () => {
    getShipownerShipList().then(res => {
        shipownerShipList.value = res;
    });
};

const refreshDataDictList = async () => {
    getDataDictList().then(res => {
        washShipRequirementDict.value = res.filter(item => item.dictName === '洗船需求').map(item => item.dictItems);
    });
};


// 编辑模式
const isEditing = ref(false);

const handleEdit = () => {
    if (!isEditing.value) {
        // 进入编辑：同步副本
        isEditing.value = true;
    } else {
        // 退出编辑：等同取消
        handleCancelEdit();
    }
};

// 保存/取消编辑
const handleCancelEdit = () => {
    selectedStaff.value = [];
    isEditing.value = false;
    resetOrderData();
};

const handleSaveEdit = () => {
    selectedStaff.value = [];
    isEditing.value = false;
    updateEntrustOrder(editEntrustDetail.value).then(res => {
        ElMessage.success('更新成功');
        refreshOrderDetail();
    });
};

const staffDialogVisible = ref(false);
const selectedStaff = ref<SupplierWorkerInfo[]>([]);

const openStaffDialog = () => {
    staffDialogVisible.value = true;
};

const handleStaffSelectionChange = (rows: any[]) => {
    selectedStaff.value = rows;
};

const addSelectedStaff = () => {
    // 添加到作业信息的工作人员列表，并去重
    ensureOperationInfo();
    const list = editEntrustDetail.value!.operationInfo!.supplierWorkers || [];
    const existingIds = new Set(list.map((w) => w.id));
    const existingPhones = new Set(list.map((w) => w.phone));
    selectedStaff.value.forEach((s) => {
        const idDup = s.id !== undefined && existingIds.has(s.id);
        const phoneDup = !!s.phone && existingPhones.has(s.phone);
        if (!idDup && !phoneDup) {
            list.push({ id: s.id, userName: s.userName, phone: s.phone });
        }
    });
    editEntrustDetail.value!.operationInfo!.supplierWorkers = list;
    staffDialogVisible.value = false;
};

const removeSupplierWorker = (row: SupplierWorkerInfo) => {
    ensureOperationInfo();
    const list = editEntrustDetail.value!.operationInfo!.supplierWorkers || [];
    editEntrustDetail.value!.operationInfo!.supplierWorkers = list.filter((w) => {
        if (row.id !== undefined && w.id !== undefined) return w.id !== row.id;
        return w.phone !== row.phone;
    });
};

// 选择船公司弹窗逻辑
const shipownerDialogVisible = ref(false);
const shipownerSearch = ref('');
const selectedShipownerId = ref<number | null>(null);

const filteredShipowners = computed(() => {
    const q = shipownerSearch.value.trim().toLowerCase();
    if (!q) return shipownerList.value;
    return shipownerList.value.filter((s) =>
        (s.companyName || '').toLowerCase().includes(q)
    );
});

// 展示用联系人（姓名 + 电话），优先使用编辑副本
const displayShipownerContact = computed(() => {
    return editEntrustDetail.value?.shipownerInfo?.contactPerson + ' (' + editEntrustDetail.value?.shipownerInfo?.contactPhone + ')';
});

const displayShipownerShip = computed(() => {
    return editEntrustDetail.value?.shipInfo?.cnName + ' ' + editEntrustDetail.value?.shipInfo?.enName;
});

// 船舶选择弹窗逻辑
const shipDialogVisible = ref(false);
const shipSearch = ref('');
const selectedShipId = ref<number | null>(null);

const filteredShips = computed(() => {
    const q = shipSearch.value.trim().toLowerCase();
    if (!q) return shipownerShipList.value;
    return shipownerShipList.value.filter((s) =>
        ((s.cnName || '').toLowerCase().includes(q)) ||
        ((s.enName || '').toLowerCase().includes(q))
    );
});

const openShipDialog = () => {
    selectedShipId.value = editEntrustDetail.value?.shipInfo?.id ?? null;
    shipDialogVisible.value = true;
};

const onShipRowClick = (row: ShipInfo) => {
    selectedShipId.value = row.id;
};

const confirmShipSelection = () => {
    if (!selectedShipId.value) return;
    const picked = shipownerShipList.value.find(s => s.id === selectedShipId.value);
    if (!picked) return;
    if (!editEntrustDetail.value.shipInfo) {
        editEntrustDetail.value.shipInfo = { id: 0, cnName: '', enName: '', shipLength: '', shipWidth: '', lightDraft: '', captainName: '', captainPhone: '' } as ShipInfo;
    }
    editEntrustDetail.value.shipInfo.id = picked.id;
    editEntrustDetail.value.shipInfo.cnName = picked.cnName;
    editEntrustDetail.value.shipInfo.enName = picked.enName;
    editEntrustDetail.value.shipInfo.captainName = picked.captainName;
    editEntrustDetail.value.shipInfo.captainPhone = picked.captainPhone;
    shipDialogVisible.value = false;
};

// 作业联系人显示（姓名 + 电话），支持手动输入与选择对话框
const operationContactDisplay = computed<string>({
    get() {
        const name = editEntrustDetail.value?.operationInfo?.operationContactUser || '';
        const phone = editEntrustDetail.value?.operationInfo?.operationContactPhone || '';
        if (!name && !phone) return '';
        return phone ? `${name} (${phone})` : name;
    },
    set(val: string) {
        if (!editEntrustDetail.value) return;
        ensureOperationInfo();
        const m = (val || '').match(/^\s*(.*?)\s*(?:\(([^)]*)\))?\s*$/);
        const name = (m?.[1] || '').trim();
        const phone = (m?.[2] || '').trim();
        editEntrustDetail.value.operationInfo.operationContactUser = name;
        editEntrustDetail.value.operationInfo.operationContactPhone = phone;
    }
});

// 作业公司名称显示代理，保持与联系人一致的 v-model 形式
const operationCompanyDisplay = computed<string>({
    get() {
        return editEntrustDetail.value?.operationInfo?.operationCompany || '';
    },
    set(val: string) {
        if (!editEntrustDetail.value) return;
        ensureOperationInfo();
        editEntrustDetail.value.operationInfo.operationCompany = val || '';
    }
});

// 计划作业时间范围代理（开始/结束）
const operationPlanWorkRange = computed<any>({
    get() {
        const start = editEntrustDetail.value?.operationInfo?.planWorkStartTime || '';
        const end = editEntrustDetail.value?.operationInfo?.planWorkEndTime || '';
        if (!start && !end) return [];
        return [start || '', end || ''];
    },
    set(val: [string, string] | any) {
        if (!editEntrustDetail.value) return;
        ensureOperationInfo();
        const start = Array.isArray(val) ? (val[0] || '') : '';
        const end = Array.isArray(val) ? (val[1] || '') : '';
        editEntrustDetail.value.operationInfo.planWorkStartTime = start || '';
        editEntrustDetail.value.operationInfo.planWorkEndTime = end || '';
    }
});

// 实际作业时间范围代理（开始/结束）
const operationActualWorkRange = computed<any>({
    get() {
        const start = editEntrustDetail.value?.operationInfo?.actualWorkStartTime || '';
        const end = editEntrustDetail.value?.operationInfo?.actualWorkEndTime || '';
        if (!start && !end) return [];
        return [start || '', end || ''];
    },
    set(val: [string, string] | any) {
        if (!editEntrustDetail.value) return;
        ensureOperationInfo();
        const start = Array.isArray(val) ? (val[0] || '') : '';
        const end = Array.isArray(val) ? (val[1] || '') : '';
        editEntrustDetail.value.operationInfo.actualWorkStartTime = start || '';
        editEntrustDetail.value.operationInfo.actualWorkEndTime = end || '';
    }
});

// 人员下水情况下拉选择的 v-model 代理（true=有，false=无）
const isPersonLaunchModel = computed<boolean>({
    get() {
        return !!editEntrustDetail.value?.operationInfo?.isPersonLaunch;
    },
    set(val: boolean) {
        ensureOperationInfo();
        editEntrustDetail.value!.operationInfo!.isPersonLaunch = !!val;
    }
});

// 作业方作业船显示（中文名 + 英文名），支持从弹窗选择
const operationSupplierShipDisplay = computed<string>({
    get() {
        const ship = editEntrustDetail.value?.operationInfo?.supplierShipInfo;
        if (!ship) return '';
        const cn = ship.cnName || '';
        const en = ship.enName || '';
        return `${cn} ${en}`.trim();
    },
    set(val: string) {
        // 允许用户手动输入时，仅更新中文名
        ensureOperationInfo();
        if (!editEntrustDetail.value!.operationInfo!.supplierShipInfo) {
            editEntrustDetail.value!.operationInfo!.supplierShipInfo = { id: 0, cnName: '', enName: '', captainName: '', captainPhone: '', companyName: '' } as SupplierShipInfo;
        }
        editEntrustDetail.value!.operationInfo!.supplierShipInfo.cnName = (val || '').trim();
    }
});

// 复用方法：确保 operationInfo 存在并初始化默认结构
function ensureOperationInfo() {
    if (!editEntrustDetail.value) return;
    if (!editEntrustDetail.value.operationInfo) {
        editEntrustDetail.value.operationInfo = {
            supplierInfo: { id: 0, name: '', contactUser: '', contactPhone: '' },
            supplierShipInfo: { id: 0, cnName: '', enName: '', captainName: '', captainPhone: '', companyName: '' },
            supplierWorkers: [],
            fileResourceList: [],
            planWorkStartTime: '',
            planWorkEndTime: '',
            actualWorkStartTime: '',
            actualWorkEndTime: '',
            isPersonLaunch: false,
            operationCompany: '',
            operationContactUser: '',
            operationContactPhone: ''
        } as any;
    }
}

// 作业方作业船选择弹窗逻辑
const supplierOperationShipDialogVisible = ref(false);
const supplierOperationShipSearch = ref('');
const selectedSupplierOperationShipId = ref<number | null>(null);

const filteredSupplierOperationShips = computed(() => {
    const q = supplierOperationShipSearch.value.trim().toLowerCase();
    if (!q) return supplierShipList.value;
    return supplierShipList.value.filter((s) =>
        ((s.cnName || '').toLowerCase().includes(q)) ||
        ((s.enName || '').toLowerCase().includes(q))
    );
});

const openSupplierOperationShipDialog = () => {
    selectedSupplierOperationShipId.value = editEntrustDetail.value?.operationInfo?.supplierShipInfo?.id ?? null;
    supplierOperationShipDialogVisible.value = true;
};

const onSupplierOperationShipRowClick = (row: SupplierShipInfo) => {
    selectedSupplierOperationShipId.value = row.id;
};

const confirmSupplierOperationShipSelection = () => {
    if (!selectedSupplierOperationShipId.value) return;
    const picked = supplierShipList.value.find(s => s.id === selectedSupplierOperationShipId.value);
    if (!picked) return;
    ensureOperationInfo();
    if (!editEntrustDetail.value!.operationInfo!.supplierShipInfo) {
        editEntrustDetail.value!.operationInfo!.supplierShipInfo = { id: 0, cnName: '', enName: '', captainName: '', captainPhone: '', companyName: '' } as SupplierShipInfo;
    }
    editEntrustDetail.value!.operationInfo!.supplierShipInfo.id = picked.id;
    editEntrustDetail.value!.operationInfo!.supplierShipInfo.cnName = picked.cnName || '';
    editEntrustDetail.value!.operationInfo!.supplierShipInfo.enName = picked.enName || '';
    editEntrustDetail.value!.operationInfo!.supplierShipInfo.captainName = picked.captainName || '';
    editEntrustDetail.value!.operationInfo!.supplierShipInfo.captainPhone = picked.captainPhone || '';
    editEntrustDetail.value!.operationInfo!.supplierShipInfo.companyName = picked.companyName || '';
    supplierOperationShipDialogVisible.value = false;
};

// 作业联系人选择弹窗逻辑
const supplierContactDialogVisible = ref(false);
const supplierContactSearch = ref('');
const selectedSupplierContactId = ref<number | null>(null);

const filteredSupplierContacts = computed(() => {
    const q = supplierContactSearch.value.trim().toLowerCase();
    if (!q) return supplierContactList.value;
    return supplierContactList.value.filter((c) =>
        ((c.userName || '').toLowerCase().includes(q)) ||
        ((c.phone || '').toLowerCase().includes(q))
    );
});

const openSupplierContactDialog = () => {
    selectedSupplierContactId.value = null;
    supplierContactDialogVisible.value = true;
};

const onSupplierContactRowClick = (row: SupplierContact) => {
    selectedSupplierContactId.value = row.id;
};

const confirmSupplierContactSelection = () => {
    if (!selectedSupplierContactId.value) return;
    supplierContactDialogVisible.value = false;
    const picked = supplierContactList.value.find((c) => c.id === selectedSupplierContactId.value);
    if (!picked || !editEntrustDetail.value?.operationInfo) return;
    editEntrustDetail.value.operationInfo.operationContactUser = picked.userName || '';
    editEntrustDetail.value.operationInfo.operationContactPhone = picked.phone || '';
};

const openShipownerDialog = () => {
    // 打开前预选当前值
    selectedShipownerId.value = editEntrustDetail?.value?.shipownerInfo?.id ?? null;
    shipownerDialogVisible.value = true;
};

const onShipownerRowClick = (row: ShipownerInfo) => {
    selectedShipownerId.value = row.id;
};

const confirmShipownerSelection = () => {
    if (!selectedShipownerId.value) return;
    const picked = shipownerList.value.find(s => s.id === selectedShipownerId.value);
    if (!picked) return;
    if (!editEntrustDetail.value.shipownerInfo) {
        editEntrustDetail.value.shipownerInfo = { id: 0, companyName: '', contactPerson: '', contactPhone: '' } as ShipownerInfo;
    }
    editEntrustDetail.value.shipownerInfo.id = picked.id;
    editEntrustDetail.value.shipownerInfo.companyName = picked.companyName;
    editEntrustDetail.value.shipownerInfo.contactPerson = picked.contactPerson;
    editEntrustDetail.value.shipownerInfo.contactPhone = picked.contactPhone;
    shipownerDialogVisible.value = false;
};

// 委托方与作业方附件组合（文件资源）
const combinedFileList = computed<FileResourceInfo[]>(() => {
    const a = editEntrustDetail.value?.fileResourceList || [];
    const b = editEntrustDetail.value?.operationInfo?.fileResourceList || [];
    return [...a, ...b];
});

const formatFileSize = (size: number | undefined) => {
    if (typeof size !== 'number' || isNaN(size)) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileColor = (fileType: string | undefined) => {
    const t = (fileType || '').toLowerCase();
    if (t.includes('pdf')) return '#409EFF';
    if (t.includes('doc') || t.includes('word')) return '#722ED1';
    if (t.includes('xls') || t.includes('sheet') || t.includes('excel')) return '#67C23A';
    if (t.includes('png') || t.includes('jpg') || t.includes('jpeg') || t.includes('img')) return '#E6A23C';
    return '#909399';
};

const downloadFile = (file: FileResourceInfo) => {
    const url = file.url;
    if (!url) return;
    window.open(url, '_blank');
};

// 删除附件（委托方与作业方合并列表项）
const deleteCombinedFile = (file: FileResourceInfo) => {
    const byMatch = (arr: FileResourceInfo[] | undefined) => {
        if (!arr) return false;
        const idx = arr.findIndex(f => f.resourceId === file.resourceId || (!!file.url && f.url === file.url));
        if (idx >= 0) {
            arr.splice(idx, 1);
            return true;
        }
        return false;
    };
    // 先尝试委托方列表
    if (byMatch(editEntrustDetail.value?.fileResourceList)) {
        ElMessage.success('已删除');
        return;
    }
    // 再尝试作业方列表
    ensureOperationInfo();
    if (byMatch(editEntrustDetail.value?.operationInfo?.fileResourceList)) {
        ElMessage.success('已删除');
        return;
    }
    ElMessage.warning('未找到文件或已删除');
};

// 删除运营人员补充文件
const deleteSupplementFile = (file: FileResourceInfo) => {
    if (!editEntrustDetail.value?.supplementFileResourceList) return;
    const idx = editEntrustDetail.value!.supplementFileResourceList!.findIndex(f => f.resourceId === file.resourceId || (!!file.url && f.url === file.url));
    if (idx >= 0) {
        editEntrustDetail.value!.supplementFileResourceList!.splice(idx, 1);
        ElMessage.success('已删除');
    }
};

// 上传补充材料弹窗逻辑
const uploadDialogVisible = ref(false);
const selectedResourceName = ref<string>('');
const selectedFile = ref<File | null>(null);
const selectedFileName = computed(() => selectedFile.value?.name || '');

const openUploadDialog = () => {
    selectedResourceName.value = '';
    selectedFile.value = null;
    uploadDialogVisible.value = true;
};

const onUploadFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    selectedFile.value = file;
};

const confirmUpload = async () => {
    if (!selectedResourceName.value || !selectedFile.value) {
        ElMessage.warning('请选择资源类型和文件');
        return;
    }
    try {
        const extraParams: Record<string, any> = { resourceName: selectedResourceName.value };
        if (entrustOrderId) extraParams.orderId = String(entrustOrderId);
        const result = await uploadFile(selectedFile.value, extraParams) as FileResourceInfo;
        const isEntrust = ['委托函', '已签字的委托函', '船长的信任证书'].includes(selectedResourceName.value);
        if (isEntrust) {
            if (!editEntrustDetail.value!.fileResourceList) editEntrustDetail.value!.fileResourceList = [];
            editEntrustDetail.value!.fileResourceList.push(result);
        } else {
            ensureOperationInfo();
            if (!editEntrustDetail.value!.operationInfo!.fileResourceList) editEntrustDetail.value!.operationInfo!.fileResourceList = [];
            editEntrustDetail.value!.operationInfo!.fileResourceList!.push(result);
        }
        ElMessage.success('上传成功');
        uploadDialogVisible.value = false;
    } catch (error) {
        // 错误提示在 upload 内已处理
    }
};

// 运营人员补充文件上传弹窗逻辑（资源类型为手动输入）
const staffUploadDialogVisible = ref(false);
const staffResourceName = ref<string>('');
const staffSelectedFile = ref<File | null>(null);
const staffSelectedFileName = computed(() => staffSelectedFile.value?.name || '');

const openStaffUploadDialog = () => {
    staffResourceName.value = '';
    staffSelectedFile.value = null;
    staffUploadDialogVisible.value = true;
};

const onStaffUploadFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    staffSelectedFile.value = file;
};

const confirmStaffUpload = async () => {
    if (!staffResourceName.value || !staffSelectedFile.value) {
        ElMessage.warning('请填写资源类型并选择文件');
        return;
    }
    try {
        const extraParams: Record<string, any> = { resourceName: staffResourceName.value };
        if (entrustOrderId) extraParams.orderId = String(entrustOrderId);
        const result = await uploadFile(staffSelectedFile.value, extraParams) as FileResourceInfo;
        if (!editEntrustDetail.value!.supplementFileResourceList) editEntrustDetail.value!.supplementFileResourceList = [];
        editEntrustDetail.value!.supplementFileResourceList.push(result);
        ElMessage.success('上传成功');
        staffUploadDialogVisible.value = false;
    } catch (error) {
        // 错误提示在 upload 内已处理
    }
};

const router = useRouter();
// 返回列表方法
const handleBack = () => {
    router.push('/job-management');
};

// 根据服务状态获取标签类型
const getStatusTagType = (status: number | undefined) => {
    switch (status) {
        case 1:
            return 'warning';
        case 2:
            return 'success';
        case 3:
            return '';
        case 4:
            return 'success';
        case 5:
            return 'info';
        case 6:
            return 'danger';
        default:
            return '';
    }
};

const getStatusName = (status: number | undefined) => {
    if (status === 1) {
        return '申报中';
    } else if (status === 2) {
        return '审核中';
    } else if (status === 3) {
        return '待作业';
    } else if (status === 4) {
        return '作业中';
    } else if (status === 5) {
        return '完工';
    } else if (status === 6) {
        return '已关闭';
    } else if (status === 7) {
        return '异常';
    } else {
        return '';
    }
};

const resetOrderData = () => {
    editEntrustDetail.value = JSON.parse(JSON.stringify(entrustDetail.value));
};


</script>

<style scoped>
.job-detail-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.page-header h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.job-code {
    color: #606266;
}

.header-actions {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    gap: 10px;
}

.section-card {
    margin-bottom: 20px;
    border-radius: 4px;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeef5;
}

.file-card .delete-btn {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

.file-card:hover .delete-btn {
    opacity: 1;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 20px;
    margin-bottom: 15px;
}

.info-grid-operation-ship {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px 20px;
    margin-bottom: 15px;
}

.info-item {
    display: flex;
    flex-direction: column;
}

.info-item .label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 4px;
}

.info-item .value {
    font-size: 14px;
    color: #303133;
}

.label-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.label-group .label {
    font-size: 14px;
    color: #606266;
}

.sub-section {
    margin-top: 20px;
}

.sub-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 10px;
}

.file-card {
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

/* Element Plus 的 Card 会包裹一个 .el-card__body，需对其应用布局 */
.file-card :deep(.el-card__body) {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
}

.file-card:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.file-icon {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-right: 12px;
}

.file-info {
    flex: 1;
}

.file-name {
    font-size: 14px;
    color: #303133;
}

.file-size {
    font-size: 12px;
    color: #909399;
    /* margin-top: 4px; */
}

.download-btn {
    color: #606266;
}

.file-note {
    font-size: 12px;
    color: #909399;
    /* margin-bottom: 10px; */
}

.edit-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.shipowner-search-bar {
    margin-bottom: 10px;
}
</style>