<template>
  <div class="operation-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>作业管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">+ 新建作业</el-button>
        <el-button v-if="!exportMode" @click="startExportMode">一键导出</el-button>
        <el-button v-else type="danger" @click="cancelExportMode">取消导出</el-button>
        <el-button v-if="exportMode" type="primary" :disabled="selectedExportIds.length === 0" @click="confirmBatchExport">确认导出 ({{ selectedExportIds.length }})</el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-select style="width: 150px;" v-model="serviceStatus" placeholder="服务状态">
        <el-option label="全部" value="" />
        <el-option label="待补充" value="1" />
        <el-option label="审核中" value="2" />
        <el-option label="待作业" value="3" />
        <el-option label="作业中" value="4" />
        <el-option label="已完成" value="5" />
        <el-option label="已关闭" value="6" />
        <el-option label="异常" value="7" />
      </el-select>
      <div class="date-wrapper">
        <el-date-picker class="date-picker" v-model="dateRange" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" placeholder="日期范围" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </div>

      <el-input v-model="searchValue" placeholder="搜索作业..." style="width: 200px;" />
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%;border-radius: 10px;" @selection-change="onSelectionChange">
      <el-table-column v-if="exportMode" type="selection" width="55" />
      <el-table-column prop="orderNo" label="作业编号" width="150"/>
      <el-table-column label="船方公司" width="120">
        <template #default="scope">
          <view style="color: #333333; font-weight: 500;">
            {{ scope.row.shipownerInfo?.companyName }}
          </view>
        </template>
      </el-table-column>
      <el-table-column label="船方联系人" width="100">
        <template #default="scope">
          {{ scope.row.shipownerInfo?.contactPerson }}
        </template>
      </el-table-column>
      <el-table-column label="船舶信息">
        <template #default="scope">
          {{ scope.row.shipInfo?.enName + ' ' + scope.row.shipInfo?.cnName }}
        </template>
      </el-table-column>
      <el-table-column label="作业方">
        <template #default="scope">
          {{ scope.row.supplier?.name }}
        </template>
      </el-table-column>
      <el-table-column label="作业方联系人" width="180">
        <template #default="scope">
          <view v-if="scope.row.supplier">
            {{ scope.row.supplier.contactUser + ' ' + scope.row.supplier.contactPhone }}
          </view>

        </template>
      </el-table-column>
      <el-table-column label="作业船信息" width="150">
        <template #default="scope">
          {{ scope.row.operationInfo?.shipName }}
        </template>
      </el-table-column>
      <el-table-column label="服务状态">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">{{ getStatusName(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150"/>

      <el-table-column label="操作" fixed="right" width="200">
        <template #default="scope">
          <el-button type="text" @click="handleViewDetail(scope.row)">查看详情</el-button>
          <el-button v-if="scope.row.status === 2" type="text" @click="openAssignDialog(scope.row)">委派</el-button>
          <el-button v-if="scope.row.status === 3" type="text" @click="openAssignDialog(scope.row)">重新委派</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-area">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" />
      <!-- <div class="record-info">共 {{ total }} 条记录</div> -->
    </div>
  </div>




  <!-- 选择作业方弹窗 -->
  <el-dialog v-model="assignDialogVisible" title="选择作业方" width="600px">
    <div class="assign-search-bar">
      <el-input v-model="supplierSearch" placeholder="搜索作业方名称" clearable />
    </div>
    <el-table :data="filteredSuppliers" row-key="id" height="340" highlight-current-row @row-click="onSupplierRowClick">
      <el-table-column label="选择" width="80">
        <template #default="{ row }">
          <el-radio v-model="selectedSupplierId" :label="row.id">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="作业方名称" />
      <el-table-column label="联系人">
        <template #default="{ row }">
          {{ row.contactUser }} {{ row.contactPhone }}
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancelAssign">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { assignSupplier, batchExportOrders, getEntrustOrderList, getSupplierList } from '@/api/entrustOrder';
import type { SupplierInfo } from '@/types/order';
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// 表格数据
const tableData = ref([]);

const router = useRouter();

// 筛选条件
const serviceStatus = ref('');
const dateRange = ref<Date[]>([]);
const searchValue = ref('');

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const supplierList = ref<SupplierInfo[]>();
const supplierSearch = ref('');
const filteredSuppliers = computed(() => {
  const list = supplierList.value ?? [];
  const q = supplierSearch.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter(s => (s.name || '').toLowerCase().includes(q));
});

// 委派选择弹窗相关
const assignDialogVisible = ref(false);
const assigningOrderRow = ref<any | null>(null);
const selectedSupplierId = ref<number | null>(null);

const openAssignDialog = (row: any) => {
  assigningOrderRow.value = row;
  assignDialogVisible.value = true;
  selectedSupplierId.value = row?.supplier?.id ?? null;
};

const onSupplierRowClick = (row: SupplierInfo) => {
  selectedSupplierId.value = row.id;
};


// 根据服务状态获取标签类型
const getStatusTagType = (status: number) => {
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
      return 'danger';
  }
};

const getStatusName = (status: number) => {
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
  } else {
    return '异常';
  }
};

onMounted(() => {
  refreshOrderList();
  refreshSupplerList();
});

watch(
  [() => searchValue.value, () => serviceStatus.value, () => dateRange.value], // 多个独立依赖项
  () => {
    refreshOrderList();
  }
);

// 导出选择模式
const exportMode = ref(false);
const selectedExportIds = ref<number[]>([]);

const startExportMode = () => {
  exportMode.value = true;
  selectedExportIds.value = [];
};
const cancelExportMode = () => {
  exportMode.value = false;
  selectedExportIds.value = [];
};
const onSelectionChange = (rows: any[]) => {
  selectedExportIds.value = rows.map(r => r.id);
};

const confirmBatchExport = async () => {
  if (selectedExportIds.value.length === 0) {
    ElMessage.warning('请先选择需要导出的作业单');
    return;
  }
  try {
    batchExportOrders({ entrustOrderIds: selectedExportIds.value }).then(res => {
        ElMessage.success('已提交导出任务');
        exportMode.value = false;
        selectedExportIds.value = [];
        router.push('/system-management/export-task-list');
    });
  } catch (e) {
    ElMessage.error('导出失败，请稍后重试');
  }
};

const refreshOrderList = async () => {
  let params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    query: searchValue.value,
    startDate: dateRange.value?.[0] || '',
    endDate: dateRange.value?.[1] || '',
    status: serviceStatus.value
  };
  getEntrustOrderList(params).then((res: any) => {
    tableData.value = res.data;
    total.value = res.total;
  });
};

const refreshSupplerList = async () => {
  let params = {
    pageNum: 1,
    pageSize: 1000
  };
  getSupplierList(params).then((res: any) => {
    supplierList.value = res.data;
  });
};

// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshOrderList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshOrderList();
};

// 按钮点击方法
const handleCreate = () => {
  // 新建作业逻辑
  console.log('新建作业');
  router.push({ name: 'CreateJob' });
};
const handleViewDetail = (row: any) => {
  // 查看详情逻辑
  console.log('查看详情', row);
  router.push({ name: 'JobDetail', params: { id: row.id } });
};

// 委派选择弹窗交互
const handleCancelAssign = () => {
  assignDialogVisible.value = false;
  assigningOrderRow.value = null;
  selectedSupplierId.value = null;
};

const handleConfirmAssign = () => {
  const supplier = supplierList.value?.find(s => s.id === selectedSupplierId.value);
  if (!supplier || !assigningOrderRow.value) {
    assignDialogVisible.value = false;
    return;
  }
  const row = assigningOrderRow.value;
  assignSupplier({ entrustOrderId: row.id, supplierId: supplier.id }).then(res => {
    // 关闭弹窗并重置状态
    assignDialogVisible.value = false;
    assigningOrderRow.value = null;
    selectedSupplierId.value = null;
    refreshOrderList();
  });
};
</script>

<style scoped>
.operation-management {
  margin: 0 auto;
  /* padding: 20px; */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}


.date-wrapper {
  width: 350px;
  flex: 0 0 200px;
}

.pagination-area {
  display: flex;
  justify-content: right;
  align-items: center;
  margin-top: 20px;
}

.record-info {
  color: #606266;
}

.assign-search-bar {
  margin-bottom: 10px;
}
</style>

