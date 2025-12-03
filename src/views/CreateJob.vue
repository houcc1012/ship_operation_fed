<template>
    <div class="job-detail-page">
        <!-- 页面头部 -->
        <div class="page-header">
            <h1>创建作业单</h1>
            <div class="header-actions">
                <el-button type="default" @click="handleBack"><el-icon>
                        <Back />
                    </el-icon>返回列表</el-button>
            </div>
        </div>

        <!-- 船方信息区域 -->
        <el-card class="section-card">
            <h2 class="section-title">船方信息</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">船公司名称</span>
                    <span class="value">
                        <el-input v-model="addEntrustDetail.shipownerInfo.companyName" :readonly="true"
                            placeholder="请选择船公司" @click="openShipownerDialog">
                            <template #suffix>
                                <el-icon style="cursor: pointer" @click.stop="openShipownerDialog">
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
                        <el-input :model-value="displayShipownerShip" :readonly="true" placeholder="请选择船舶"
                            @click="openShipDialog">
                            <template #suffix>
                                <el-icon style="cursor: pointer" @click.stop="openShipDialog">
                                    <Document />
                                </el-icon>
                            </template>
                        </el-input>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">计划洗船位置</span>
                    <span class="value">
                        <el-select v-model="addEntrustDetail.planWashParkLocation"  placeholder="请选择计划洗船位置" style="width: 100%;">
                            <el-option v-for="item in washShipParkLocationOptions" :key="item as string" :label="item as string" :value="item as string" />
                        </el-select>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">清洗位置</span>
                    <span class="value">
                        <el-input v-model="addEntrustDetail.planWashShipPosition"
                     />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">计划洗船时间</span>
                    <span class="value">
                        <el-date-picker v-model="planWashTimeRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm"
                            value-format="YYYY-MM-DD HH:mm" style="width: 100%;" />
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">船舶载货情况</span>
                    <span class="value">
                        <el-input v-model="addEntrustDetail.shipCargo" type="text" />
                    </span>
                </div>
            </div>

            <div class="label-group" style="flex-direction: column;align-items: flex-start;">
                <view class="label">洗船需求</view>
                <!-- 非编辑模式：展示已选需求为标签 -->
                <el-row>
                    <template v-if="false">
                        <el-tag v-for="item in washRequirementsModel" :key="item"
                            style="margin-right: 8px; margin-bottom: 6px;">
                            {{ item }}
                        </el-tag>
                        <span v-if="washRequirementsModel.length === 0"
                            style="color: var(--el-text-color-secondary);">暂无选择</span>
                    </template>
                    <!-- 创建模式：展示复选框，数据来源 washShipRequirementDict -->
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
                    <el-date-picker v-model="addEntrustDetail.lastWashDate" type="datetime" placeholder="选择时间"
                        format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" />
                </span>
            </div>
        </el-card>



        <!-- 运营人员补充文件区域 -->
        <el-card class="section-card">
            <h2 class="section-title">运营人员补充文件</h2>
            <div class="file-note">补充文件不向船方和作业方公开</div>
            <div class="file-grid">
                <el-card class="file-card" v-for="(file, idx) in addEntrustDetail.supplementFileResourceList"
                    :key="file.resourceId || idx">
                    <div class="file-icon" :style="{ backgroundColor: getFileColor(file.fileType) }">
                        <el-icon>
                            <document />
                        </el-icon>
                    </div>
                    <div class="file-info">
                        <div class="file-name">{{ file.fileName || file.resourceName }}</div>
                        <el-row>
                            <div class="file-note" style="margin-right: 5px;">{{ (file.fileType ||
                                '').toLocaleUpperCase()
                            }}
                            </div>
                            <div class="file-size">{{ formatFileSize(file.size) }}</div>
                        </el-row>
                    </div>
                    <el-button type="text" :icon="Download" class="download-btn" @click="downloadFile(file)" />
                    <el-button type="text" :icon="Delete" class="delete-btn" @click="deleteSupplementFile(file)" />
                </el-card>
            </div>
            <el-button style="margin-top: 20px;" type="primary" @click="openStaffUploadDialog">+
                上传运营补充材料</el-button>
        </el-card>

        <!-- 底部操作按钮 -->
        <div class="edit-footer">
            <el-button type="primary" :loading="submitLoading" @click="handleCreateOrder">提交创建</el-button>
        </div>
    </div>


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

</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { Back, Document, Download, Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { addEntrustOrder, getShipownerList, getShipownerShipList } from '@/api/entrustOrder';
import type { EntrustOrder, ShipInfo, ShipownerInfo, FileResourceInfo } from '@/types/order';
import { getDataDictList } from '@/api/dataDictApi';
import { FILE_RESOURCE_TITLES } from '@/types/common';
import { uploadFile } from '@/api/fileApi';
import { ElMessage } from 'element-plus';

const addEntrustDetail = ref<EntrustOrder>({
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
    supplementFileResourceList: []
} as EntrustOrder);

// 船方列表
const shipownerList = ref<ShipownerInfo[]>([]);

// 船方船舶列表
const shipownerShipList = ref<ShipInfo[]>([]);

// 计划洗船时间范围代理（开始/结束），绑定到 addEntrustDetail.planWashStartTime/planWashEndTime
const planWashTimeRange = computed<any>({
    get() {
        const start = addEntrustDetail.value?.planWashStartTime || '';
        const end = addEntrustDetail.value?.planWashEndTime || '';
        if (!start && !end) return [];
        return [start || '', end || ''];
    },
    set(val: [string, string] | any) {
        if (!addEntrustDetail.value) return;
        const start = Array.isArray(val) ? (val[0] || '') : '';
        const end = Array.isArray(val) ? (val[1] || '') : '';
        addEntrustDetail.value.planWashStartTime = start || '';
        addEntrustDetail.value.planWashEndTime = end || '';
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

// 洗船位置类型
const washShipParkLocationDict= ref<String[]>([]);
// 扁平化位置字典，防止嵌套数组导致选项异常
const washShipParkLocationOptions = computed(() => {
    const raw: any = washShipParkLocationDict.value || [];
    if (Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0])) {
        return raw.flat();
    }
    return raw;
});

// 复选框双向绑定到字符串字段：addEntrustDetail.washShipRequirement（逗号分隔）
const washRequirementsModel = computed<string[]>({
    get() {
        const s = addEntrustDetail.value?.washShipRequirement || '';
        return s ? s.split(',').map((i) => i.trim()).filter(Boolean) : [];
    },
    set(val) {
        if (!addEntrustDetail.value) return;
        addEntrustDetail.value.washShipRequirement = (val || []).join(',');
    }
});

onMounted(() => {
    refreshShipownerList();
    refreshShipownerShipList();
    refreshDataDictList();
});

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
        washShipParkLocationDict.value = res.filter(item => item.dictName === '洗船位置类型').map(item => item.dictItems);
    });
};


// 创建提交
const router = useRouter();
const submitLoading = ref(false);
const handleCreateOrder = async () => {
    if (submitLoading.value) return;
    submitLoading.value = true;
    const payload: any = JSON.parse(JSON.stringify(addEntrustDetail.value));
    // 明确不传 operationInfo 字段
    delete payload.operationInfo;
    try {
        addEntrustOrder(payload).then(res => {
            ElMessage.success('创建成功');
            router.push('/job-management');
        });
    } finally {
        submitLoading.value = false;
    }
};

// （创建页不涉及作业人员选择与作业方信息）

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
    if (!addEntrustDetail.value?.shipownerInfo.contactPerson) return '';
    return addEntrustDetail.value?.shipownerInfo?.contactPerson + ' (' + addEntrustDetail.value?.shipownerInfo?.contactPhone + ')';
});

const displayShipownerShip = computed(() => {
    if (!addEntrustDetail.value?.shipInfo?.cnName && !addEntrustDetail.value?.shipInfo?.enName) return '';
    return addEntrustDetail.value?.shipInfo?.cnName + ' ' + addEntrustDetail.value?.shipInfo?.enName;
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
    selectedShipId.value = addEntrustDetail.value?.shipInfo?.id ?? null;
    shipDialogVisible.value = true;
};

const onShipRowClick = (row: ShipInfo) => {
    selectedShipId.value = row.id;
};

const confirmShipSelection = () => {
    if (!selectedShipId.value) return;
    const picked = shipownerShipList.value.find(s => s.id === selectedShipId.value);
    if (!picked) return;
    if (!addEntrustDetail.value.shipInfo) {
        addEntrustDetail.value.shipInfo = { id: 0, cnName: '', enName: '', shipLength: '', shipWidth: '', lightDraft: '', captainName: '', captainPhone: '' } as ShipInfo;
    }
    addEntrustDetail.value.shipInfo.id = picked.id;
    addEntrustDetail.value.shipInfo.cnName = picked.cnName;
    addEntrustDetail.value.shipInfo.enName = picked.enName;
    addEntrustDetail.value.shipInfo.captainName = picked.captainName;
    addEntrustDetail.value.shipInfo.captainPhone = picked.captainPhone;
    shipDialogVisible.value = false;
};

// （创建页不涉及作业联系人/作业公司/作业船相关的代理或弹窗）

// 创建页不涉及作业联系人选择弹窗，相关逻辑移除

const openShipownerDialog = () => {
    // 打开前预选当前值
    selectedShipownerId.value = addEntrustDetail?.value?.shipownerInfo?.id ?? null;
    shipownerDialogVisible.value = true;
};

const onShipownerRowClick = (row: ShipownerInfo) => {
    selectedShipownerId.value = row.id;
};

const confirmShipownerSelection = () => {
    if (!selectedShipownerId.value) return;
    const picked = shipownerList.value.find(s => s.id === selectedShipownerId.value);
    if (!picked) return;
    if (!addEntrustDetail.value.shipownerInfo) {
        addEntrustDetail.value.shipownerInfo = { id: 0, companyName: '', contactPerson: '', contactPhone: '' } as ShipownerInfo;
    }
    addEntrustDetail.value.shipownerInfo.id = picked.id;
    addEntrustDetail.value.shipownerInfo.companyName = picked.companyName;
    addEntrustDetail.value.shipownerInfo.contactPerson = picked.contactPerson;
    addEntrustDetail.value.shipownerInfo.contactPhone = picked.contactPhone;
    shipownerDialogVisible.value = false;
};

// 附件组合（仅委托方文件资源）
const combinedFileList = computed<FileResourceInfo[]>(() => {
    const a = addEntrustDetail.value?.fileResourceList || [];
    return [...a];
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

// 删除附件（委托方列表项）
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
    if (byMatch(addEntrustDetail.value?.fileResourceList)) {
        ElMessage.success('已删除');
    } else {
        ElMessage.warning('未找到文件或已删除');
    }
};

// 删除运营人员补充文件
const deleteSupplementFile = (file: FileResourceInfo) => {
    if (!addEntrustDetail.value?.supplementFileResourceList) return;
    const idx = addEntrustDetail.value!.supplementFileResourceList!.findIndex(f => f.resourceId === file.resourceId || (!!file.url && f.url === file.url));
    if (idx >= 0) {
        addEntrustDetail.value!.supplementFileResourceList!.splice(idx, 1);
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
        const result = await uploadFile(selectedFile.value, extraParams) as FileResourceInfo;
        if (!addEntrustDetail.value!.fileResourceList) addEntrustDetail.value!.fileResourceList = [];
        addEntrustDetail.value!.fileResourceList.push(result);
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
        const result = await uploadFile(staffSelectedFile.value, extraParams) as FileResourceInfo;
        if (!addEntrustDetail.value!.supplementFileResourceList) addEntrustDetail.value!.supplementFileResourceList = [];
        addEntrustDetail.value!.supplementFileResourceList.push(result);
        ElMessage.success('上传成功');
        staffUploadDialogVisible.value = false;
    } catch (error) {
        // 错误提示在 upload 内已处理
    }
};

// 返回列表方法
const handleBack = () => {
    router.push('/job-management');
};

// 创建页不需要重置为详情数据


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