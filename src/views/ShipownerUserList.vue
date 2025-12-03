<template>
    <div class="operation-management">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>船方/代理用户</h1>
        <div class="header-actions">
          <el-input v-model="searchValue" clearable placeholder="搜索手机号" style="width: 200px;" />
          <el-button type="primary" @click="refreshUserList">筛选</el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%;border-radius: 10px;">
        <el-table-column  label="用户手机号码">
          <template #default="scope">
            <view> {{ scope.row.phone }}</view>
          </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="组织名称"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.enabled)">{{ scope.row.enabled ? '可用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="entrustOrderCount" label="作业单数量"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最近登录时间"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>

        <!-- 操作 -->
         <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
            <el-button v-if="scope.row.enabled"  size="mini" @click="handleEnableUser(scope.row.id, false)">禁用</el-button>
            <el-button v-else type="success" size="mini" @click="handleEnableUser(scope.row.id, true)">启用</el-button>
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
import { enableUser, getAppUserList } from '@/api/userApi';
import { onMounted, ref, watch } from 'vue';

// 表格数据
const tableData = ref([]);

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
  refreshUserList();
});

// watch(
//   [() => searchValue.value], // 多个独立依赖项
//   () => {
//     refreshUserList();
//   }
// );

const refreshUserList = async () => {
  let params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    query: searchValue.value,
    userTypeList: [0, 1]
  };
  getAppUserList(params).then((res: any) => {
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
      refreshUserList();
  });
};

// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshUserList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshUserList();
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
