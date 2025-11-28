<template>
    <div class="operation-management">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>数据字典管理</h1>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%;border-radius: 10px;">
        <el-table-column  label="字典名称" width="300">
          <template #default="scope">
            <view style="color: #333333;font-weight: 500;"> {{ scope.row.dictName }}</view>
          </template>
        </el-table-column>
        <el-table-column label="字典值">
          <template #default="scope">
            <view>{{ joinDictItems(scope.row.dictItems) }}</view>
          </template>
        </el-table-column>
        <!-- 操作 -->
         <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button type="primary" size="mini" >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script setup lang="ts">
import { getDataDictList } from '@/api/dataDictApi';
import { onMounted, ref, watch } from 'vue';

// 表格数据
const tableData = ref([]);


onMounted(() => {
  refreshDataDictList();
});


const joinDictItems = (dictItems: any[string]) => {
  return dictItems.join(', ')
}


const refreshDataDictList = async () => {
  getDataDictList({}).then((res: any) => {
    tableData.value = res;
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
</style>
