<template>
    <div class="operation-management">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>作业方管理</h1>
        <div class="header-actions">
          <el-input v-model="searchValue" clearable placeholder="搜索作业方名称" style="width: 200px;" />
          <el-button type="primary" @click="refreshSupplierList">筛选</el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%;border-radius: 10px;">
        <el-table-column prop="name" label="作业方名称"></el-table-column>
        <el-table-column prop="supplierName" label="联系人 (联系方式)">
           <template #default="scope">
            <view>{{ scope.row.contactUser }} ({{ scope.row.contactPhone }})</view>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.enabled)">{{ scope.row.enabled ? '可用' : '禁用' }}</el-tag>
          </template>
        </el-table-column> -->

        <!-- 操作 -->
         <el-table-column label="操作" fixed="right" width="450">
          <template #default="scope">
            <el-button type="info" size="mini" @click="">查看作业船舶</el-button>
            <el-button type="info" size="mini" @click="">查看资质文件</el-button>
              <el-button type="danger" size="mini" @click="">删除</el-button>
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
</template>

<script setup lang="ts">
import { getSupplierList } from '@/api/entrustOrder';
import { enableUser, getAppUserList } from '@/api/userApi';
import type { SupplierInfo } from '@/types/order';
import { onMounted, ref, watch } from 'vue';

// 表格数据
const tableData = ref<SupplierInfo[]>([]);

const searchValue = ref('');

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 根据服务状态获取标签类型
const getStatusTagType = (enabled: boolean) => {
  if (enabled === true) {
    return 'success';
  }
  return 'warning';
};

onMounted(() => {
  refreshSupplierList();
});

// watch(
//   [() => searchValue.value], // 多个独立依赖项
//   () => {
//     refreshSupplierList();
//   }
// );

const refreshSupplierList = async () => {
  let params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    query: searchValue.value
  };
  getSupplierList(params).then((res: any) => {
    tableData.value = res.data;
    total.value = res.total;
  });
};

const handleEnableUser = async (userId: number, enabled: boolean) => {
  let params = {
    userId: userId,
    enabled: enabled,
    userType: 2
  };
  enableUser(params).then((res: any) => {
      refreshSupplierList();
  });
};

// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshSupplierList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshSupplierList();
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
  margin-right: 50px;
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
</style>
