<template>
    <div class="operation-management">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>导出任务管理</h1>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%;border-radius: 10px;">
         <el-table-column prop="taskNo" label="任务编号"></el-table-column>

        <el-table-column  label="任务状态">
          <template #default="scope">
             <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status === 0 ? '未执行' : (scope.row.status === 1 ? '导出中' : (scope.row.status === 2 ? '成功' : '失败')) }}</el-tag>
          </template>
        </el-table-column>

        <!-- 作业编号  是个string数组-->
         <el-table-column label="作业单编号">
          <template #default="scope">
            <el-tag style="margin-right: 5px;" v-for="(item, index) in scope.row.entrustOrderNoList" :key="index">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errorInfo" label="异常信息"></el-table-column>
        
        <el-table-column prop="createTime" label="创建时间"></el-table-column>

        <!-- 操作 -->
         <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
             <!-- 如果任务状态为成功，可以下载，否则下载按钮置灰色 -->
              <el-button v-if="scope.row.status === 2" type="primary" @click="() => handleDownload(scope.row.fileResource?.url)">下载</el-button>
              <el-button v-else type="primary" disabled>下载</el-button>
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
import { getExportTaskList } from '@/api/entrustOrder';
import { onMounted, onUnmounted, ref, watch } from 'vue';

// 表格数据
const tableData = ref([]);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 根据任务状态获取标签类型
const getStatusTagType = (status: number) => {
  if (status === 0) {
    return 'info';
  } else if (status === 1) {
    return 'primary';
  } else if (status === 2) {
    return 'success';
  } else if (status === 3) {
    return 'danger';
  }
  return 'warning';
};

const handleDownload = (url: string) => {
  window.open(url);
};

let refreshTimer: number | null = null;

onMounted(() => {
  // 进入页面立即刷新一次
  refreshExportTaskList();
  // 每2秒刷新一次任务列表
  refreshTimer = window.setInterval(() => {
    refreshExportTaskList();
  }, 2000);
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
});

const refreshExportTaskList = async () => {
  let params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value
  };
  getExportTaskList(params).then((res: any) => {
    tableData.value = res.data;
    total.value = res.total;
  });
};
// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshExportTaskList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshExportTaskList();
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
