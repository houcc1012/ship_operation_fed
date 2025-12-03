<template>
    <div class="operation-management">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>数据字典管理</h1>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%;border-radius: 10px;">
        <el-table-column label="字典名称" width="300">
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
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        title="编辑数据字典"
        width="520px"
        :close-on-click-modal="false"
      >
        <el-form :model="formData" label-width="100px">
          <el-form-item label="字典名称">
            <el-input v-model="formData.dictName" disabled placeholder="请输入字典名称" />
          </el-form-item>
          <el-form-item label="字典值">
            <div v-for="(item, index) in formData.dictItems" :key="index" class="dict-item">
              <el-input
                v-model="formData.dictItems[index]"
                placeholder="请输入字典值"
                style="width: 260px; margin-right: 10px;"
              />
              <!-- 仅当字典名称为 PM 时显示默认项选择 -->
              <el-radio
                v-if="formData.dictName === 'PM'"
                v-model="defaultItemIndex"
                :label="index"
                style="margin-right: 10px;"
              >默认</el-radio>
              <el-button type="danger" size="small" @click="removeDictItem(index)">删除</el-button>
            </div>
            <el-button type="primary" size="small" @click="addDictItem" style="margin-top: 10px;">添加字段值</el-button>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getDataDictList, updateDataDict } from '@/api/dataDictApi';
import { onMounted, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 表格数据
const tableData = ref([]);

// 弹窗相关
const dialogVisible = ref(false);
const formData = reactive({
  id: 0,
  dictName: '',
  defaultItemValue: '',
  dictItems: [] as string[]
});

// 当字典名称为 PM 时，用索引跟踪默认项，确保编辑值时默认项能同步
const defaultItemIndex = ref<number>(-1);

onMounted(() => {
  refreshDataDictList();
});

const joinDictItems = (dictItems: string[]) => {
  return dictItems.join(', ')
}

const refreshDataDictList = async () => {
  getDataDictList({}).then((res: any) => {
    tableData.value = res;
  });
};

// 处理编辑
const handleEdit = (row: any) => {
  // 深拷贝数据到表单
  formData.id = row.id;
  formData.dictName = row.dictName;
  formData.defaultItemValue = row.defaultItemValue;
  formData.dictItems = [...row.dictItems];
  // 仅 PM 字典需要默认项选择，将默认值映射到索引
  if (formData.dictName === 'PM') {
    const idx = formData.dictItems.findIndex(v => v === formData.defaultItemValue);
    defaultItemIndex.value = idx !== -1 ? idx : -1;
  } else {
    defaultItemIndex.value = -1;
  }
  dialogVisible.value = true;
};

// 添加字典值
const addDictItem = () => {
  formData.dictItems.push('');
};

// 移除字典值
const removeDictItem = (index: number) => {
  formData.dictItems.splice(index, 1);
  // 若删除的是默认项或删除项在默认项之前，更新默认项索引与默认值
  if (formData.dictName === 'PM') {
    if (defaultItemIndex.value === index) {
      defaultItemIndex.value = -1;
      formData.defaultItemValue = '';
    } else if (defaultItemIndex.value > index) {
      defaultItemIndex.value = defaultItemIndex.value - 1;
    }
  }
};

// 处理保存
const handleSave = async () => {
  // 验证表单
  if (!formData.dictName.trim()) {
    ElMessage.warning('请输入字典名称');
    return;
  }

  // 过滤空值
  const filteredDictItems = formData.dictItems.filter(item => item.trim());
  if (filteredDictItems.length === 0) {
    ElMessage.warning('请至少输入一个字典值');
    return;
  }

  try {
    // 构建请求参数
    // 若为 PM 字典且选择了默认项，以当前索引对应值为默认值
    if (formData.dictName === 'PM') {
      // 计算非空项在原数组中的索引映射，确保过滤后索引正确
      const nonEmptyIndices = formData.dictItems
        .map((v, i) => ({ v: v.trim(), i }))
        .filter(t => t.v)
        .map(t => t.i);

      // 校验必须选择默认项
      if (defaultItemIndex.value < 0) {
        ElMessage.warning('请为 PM 字典选择一个默认值');
        return;
      }

      // 找到默认项在过滤后的位置
      const filteredIndex = nonEmptyIndices.indexOf(defaultItemIndex.value);
      if (filteredIndex < 0 || filteredIndex >= filteredDictItems.length) {
        ElMessage.warning('默认字典值不能为空或已被删除');
        return;
      }

      formData.defaultItemValue = filteredDictItems[filteredIndex] || '';
    }
    const params = {
      id: formData.id,
      dictName: formData.dictName.trim(),
      dictItems: filteredDictItems,
      defaultItemValue: formData.defaultItemValue.trim()
    };

    // 调用更新接口
    await updateDataDict(params);
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    // 刷新数据列表
    refreshDataDictList();
  } catch (error) {
    ElMessage.error('保存失败，请重试');
    console.error('保存数据字典失败:', error);
  }
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

.dict-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
