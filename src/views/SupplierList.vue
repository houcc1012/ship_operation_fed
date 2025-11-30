<template>
  <div class="operation-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>作业方管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="openCreateSupplierDialog">+ 新建作业方</el-button>
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
          <el-button type="primary" size="mini" @click="handleAddUser(scope.row)">新增用户</el-button>
          <el-button type="info" size="mini" @click="">查看作业船舶</el-button>
          <el-button type="info" size="mini" @click="">查看资质文件</el-button>
          <el-button type="danger" size="mini" @click="onClickDelete(scope.row)">删除</el-button>
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
    <!-- 新建作业方弹窗 -->
    <el-dialog v-model="createDialogVisible" title="新建作业方" width="500px">
      <el-form label-width="100px">
        <el-form-item label="作业方名称">
          <el-input v-model="newSupplier.name" placeholder="请输入作业方名称" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="newSupplier.contactUser" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="newSupplier.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelCreate">取消</el-button>
          <el-button type="primary" :loading="createLoading" @click="confirmCreateSupplier">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 新增作业方用户弹窗 -->
    <el-dialog
      v-model="addUserDialogVisible"
      title="新增作业方用户"
      width="500px"
      :close-on-click-modal="false"
    >
       <!-- 添加隐藏的输入字段来欺骗浏览器自动填充 -->
       <input type="text" style="display: none;" />
    <input type="password" style="display: none;" />

      <el-form :model="userForm" label-width="100px">
        <el-form-item label="手机号*">
          <el-input v-model="userForm.phone" autocomplete="off"  placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userForm.userName" autocomplete="off"  placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item  label="密码*">
          <el-input 
            v-model="userForm.password" 
            placeholder="请输入密码" 
            type="password"
            autocomplete="new-password" 
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelAddUser">取消</el-button>
          <el-button type="primary" :loading="addUserLoading" @click="confirmAddUser">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { addSupplier, deleteSupplier, getSupplierList } from '@/api/entrustOrder';
import { enableUser, addSupplierUser } from '@/api/userApi';
import type { SupplierInfo } from '@/types/order';
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { md5 } from 'js-md5';
import router from '@/router';

// 表格数据
const tableData = ref<SupplierInfo[]>([]);

const searchValue = ref('');

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

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


// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshSupplierList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshSupplierList();
};

// 创建作业方弹窗与逻辑
const createDialogVisible = ref(false);
const createLoading = ref(false);
const newSupplier = ref<{ name: string; contactUser: string; contactPhone: string }>({
  name: '',
  contactUser: '',
  contactPhone: ''
});

const openCreateSupplierDialog = () => {
  createDialogVisible.value = true;
};

const resetCreateForm = () => {
  newSupplier.value = { name: '', contactUser: '', contactPhone: '' };
};

const cancelCreate = () => {
  resetCreateForm();
  createDialogVisible.value = false;
};

const confirmCreateSupplier = async () => {
  const { name, contactUser, contactPhone } = newSupplier.value;
  if (!name?.trim()) {
    ElMessage.error('请填写作业方名称');
    return;
  }
  if (!contactUser?.trim()) {
    ElMessage.error('请填写联系人');
    return;
  }
  if (!contactPhone?.trim()) {
    ElMessage.error('请填写联系电话');
    return;
  }
  try {
    createLoading.value = true;
    const params = { name: name.trim(), contactUser: contactUser.trim(), contactPhone: contactPhone.trim() };
    addSupplier(params).then(() => {
      ElMessage.success('创建成功');
      createDialogVisible.value = false;
      resetCreateForm();
      refreshSupplierList();
    });

  } finally {
    createLoading.value = false;
  }
};

// 删除作业方
const onClickDelete = (row: SupplierInfo) => {
  ElMessageBox.confirm(`确认删除作业方“${row.name}”？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
    .then(async () => {
      deleteSupplier({ id: row.id }).then(() => {
        ElMessage.success('删除成功');
        refreshSupplierList();
      });

    })
};

// 新增用户相关
const addUserDialogVisible = ref(false);
const addUserLoading = ref(false);
const currentSupplierId = ref<number>(0);
const userForm = reactive({
  phone: '',
  userName: '',
  password: ''
});


// 处理新增用户
const handleAddUser = (row: SupplierInfo) => {
  currentSupplierId.value = row.id;
  resetUserForm();
  addUserDialogVisible.value = true;
};

// 重置用户表单
const resetUserForm = () => {
  userForm.phone = '';
  userForm.userName = '';
  userForm.password = '';
};

// 取消新增用户
const cancelAddUser = () => {
  resetUserForm();
  addUserDialogVisible.value = false;
};

// 确认新增用户
const confirmAddUser = async () => {
  // 表单验证
  if (!userForm.phone?.trim()) {
    ElMessage.warning('请输入手机号');
    return;
  }
  // 简单的手机号格式验证
  if (!/^1[3-9]\d{9}$/.test(userForm.phone.trim())) {
    ElMessage.warning('请输入有效的手机号');
    return;
  }
  if (!userForm.password?.trim()) {
    ElMessage.warning('请输入密码');
    return;
  }
  if (userForm.password.trim().length < 6) {
    ElMessage.warning('密码长度至少为6位');
    return;
  }

  try {
    addUserLoading.value = true;
    // 构建请求参数，对密码进行MD5加密
    const params = {
      phone: userForm.phone.trim(),
      userName: userForm.userName.trim(),
      password: md5(userForm.password.trim()),
      supplierId: currentSupplierId.value
    };

    // 调用新增用户接口
    addSupplierUser(params).then(() => {
      ElMessage.success('新增用户成功');
      addUserDialogVisible.value = false;
      cancelAddUser();
      router.push('/user-management/supplierUserList')
    });
  } finally {
    addUserLoading.value = false;
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
