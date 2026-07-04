<template>
  <div class="page-container">
    <div class="page-header">
      <h2>业务员列表</h2>
      <el-button type="primary" @click="handleAdd">新增业务员</el-button>
    </div>
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="业务员">
          <el-input v-model="searchForm.keyword" placeholder="请输入业务员姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-card">
      <el-table :data="tableData" stripe>
        <el-table-column prop="inviteCode" label="邀请码" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号码" width="180" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="enterprise" label="归属企业" width="150" />
        <el-table-column prop="category" label="类别" width="100" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
        class="pagination"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </el-card>
    <el-dialog v-model="addVisible" title="新增业务员" width="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="addForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="addForm.idCard" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="addForm.category" placeholder="请选择类别">
            <el-option label="业务员" value="业务员" />
            <el-option label="经理" value="经理" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ keyword: '', phone: '' })
const tableData = ref([
  { inviteCode: 'YQ001', name: '李四', idCard: '33010119900101****', phone: '13900139000', enterprise: '杭州XX科技有限公司', category: '业务员' },
  { inviteCode: 'YQ002', name: '王五', idCard: '33010119910202****', phone: '13700137000', enterprise: '杭州XX科技有限公司', category: '业务员' },
  { inviteCode: 'YQ003', name: '赵六', idCard: '33010119920303****', phone: '13600136000', enterprise: '杭州XX科技有限公司', category: '经理' }
])
const total = ref(3)
const pageSize = ref(10)
const currentPage = ref(1)
const addVisible = ref(false)
const addForm = reactive({ name: '', idCard: '', phone: '', category: '' })

const handleAdd = () => {
  addVisible.value = true
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.phone = ''
}

const handleView = (row) => {
  ElMessage.info('查看: ' + row.name)
}

const handleEdit = (row) => {
  ElMessage.info('编辑: ' + row.name)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSubmit = () => {
  addVisible.value = false
  addForm.name = ''
  addForm.idCard = ''
  addForm.phone = ''
  addForm.category = ''
  ElMessage.success('新增成功')
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  border-radius: 12px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>