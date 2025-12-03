<template>
    <div class="operation-management">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>运营后台用户</h1>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddUser">+ 新增用户</el-button>
          <el-input v-model="searchValue" clearable placeholder="搜索账号或昵称" style="width: 200px;" />
          <el-button type="primary" @click="refreshUserList">筛选</el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%;border-radius: 10px;">
        <el-table-column prop="phone" label="账号"></el-table-column>
        <el-table-column prop="userName" label="昵称"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.enabled)">{{ scope.row.enabled ? '可用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
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

             <!-- 添加隐藏的输入字段来欺骗浏览器自动填充 -->
      <input type="text" style="display: none;" />
     <input type="password" style="display: none;" />
      <!-- 新增用户弹窗 -->
      <el-dialog
        v-model="addUserDialogVisible"
        title="新增运营用户"
        width="500px"
        :before-close="handleCloseDialog"
      >
        <el-form
          ref="userFormRef"
          :model="userForm"
          :rules="userFormRules"
          label-width="100px"
          autocomplete="off"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="userForm.phone"
              placeholder="请输入手机号"
              maxlength="11"
              show-word-limit
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="昵称" prop="userName">
            <el-input
              v-model="userForm.userName"
              placeholder="请输入昵称"
              maxlength="20"
              show-word-limit
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="userForm.password"
              type="password"
              placeholder="请输入密码"
              maxlength="20"
              show-word-limit
              autocomplete="new-password"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleCloseDialog">取消</el-button>
            <el-button type="primary" @click="handleSaveUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { enableUser, getAdminUserList, getAppUserList, addAdminUser } from '@/api/userApi';
import { ElMessage } from 'element-plus';
import { md5 } from 'js-md5';
import { onMounted, ref, watch } from 'vue';

// 表格数据
const tableData = ref([]);

const searchValue = ref('');

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 新增用户相关
const addUserDialogVisible = ref(false);
const userFormRef = ref();
const userForm = ref({
  phone: '',
  userName: '',
  password: ''
});

// 表单验证规则
const userFormRules = ref({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 20, message: '昵称长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
});

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
    userTypeList: [2]
  };
  getAdminUserList(params).then((res: any) => {
    tableData.value = res.data;
    total.value = res.total;
  });
};

const handleEnableUser = async (userId: number, enabled: boolean) => {
  let params = {
    userId: userId,
    enabled: enabled,
    userType: 1
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

// 新增用户相关方法
const resetUserForm = () => {
  userForm.value = {
    phone: '',
    userName: '',
    password: ''
  };
  if (userFormRef.value) {
    userFormRef.value.clearValidate();
  }
};

const handleAddUser = () => {
  resetUserForm();
  // 延迟显示弹窗，避免浏览器自动填充
  setTimeout(() => {
    addUserDialogVisible.value = true;
  }, 0);
};

const handleCloseDialog = () => {
  resetUserForm();
  addUserDialogVisible.value = false;
};

const handleSaveUser = async () => {
  if (!userFormRef.value) return;
  
  try {
    await userFormRef.value.validate();
    
    // 加密密码
    const encryptedPassword = md5(userForm.value.password);
    
    // 准备参数
    const params = {
      phone: userForm.value.phone,
      userName: userForm.value.userName,
      password: encryptedPassword
    };
    
    // 调用接口
    addAdminUser(params).then((res: any) => {
      addUserDialogVisible.value = false;
      refreshUserList();
      ElMessage.success('新增用户成功');
    });
  } catch (error) {
    console.error('表单验证失败:', error);
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
</style>
