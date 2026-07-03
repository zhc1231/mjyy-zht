<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="5">
        <el-card>
          <template #header>
            <span>部门列表</span>
          </template>
          <el-tree :data="deptTree" :props="{ label: 'name', children: 'children' }" @node-click="handleDeptClick" />
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="search-card">
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="用户名称">
              <el-input v-model="searchForm.username" placeholder="请输入用户名称" />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleAdd">新增</el-button>
              <el-button @click="handleImport">导入</el-button>
              <el-button @click="handleExport">导出</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card>
          <el-table :data="tableData" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="用户编号" width="100" />
            <el-table-column prop="username" label="用户名称" min-width="120" />
            <el-table-column prop="nickname" label="用户昵称" min-width="120" />
            <el-table-column prop="deptName" label="部门" min-width="120" />
            <el-table-column prop="phone" label="手机号码" min-width="130" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-switch v-model="scope.row.status" active-value="正常" inactive-value="停用" @change="(val) => handleStatusChange(scope.row, val)" />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                <el-button size="small" @click="handleResetPwd(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名称">
          <el-input v-model="form.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="form.deptId" placeholder="请选择部门">
            <el-option label="技术部" value="1" />
            <el-option label="财务部" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const deptTree = ref([
  { name: '国通', children: [
    { name: '技术部', children: [] },
    { name: '财务部', children: [] }
  ]},
  { name: '良巧匠', children: [
    { name: '运营部', children: [] }
  ]}
])
const searchForm = reactive({ username: '', phone: '', status: '', dateRange: [] })
const tableData = ref([
  { id: 1, username: 'admin', nickname: '管理员', deptName: '技术部', phone: '13800138000', status: '正常', createTime: '2025-01-01 10:00:00' },
  { id: 2, username: 'zhangsan', nickname: '张三', deptName: '财务部', phone: '13800138001', status: '正常', createTime: '2025-01-02 10:00:00' },
  { id: 3, username: 'lisi', nickname: '李四', deptName: '技术部', phone: '13800138002', status: '停用', createTime: '2025-01-03 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(227)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const form = reactive({ username: '', nickname: '', phone: '', email: '', deptId: '', status: '正常' })
const selectedRows = ref([])

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { username: '', phone: '', status: '', dateRange: [] }) }
const handleAdd = () => { dialogTitle.value = '新增用户'; Object.assign(form, { username: '', nickname: '', phone: '', email: '', deptId: '', status: '正常' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '编辑用户'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleResetPwd = (row) => { ElMessageBox.confirm('确认重置密码?', '提示', { type: 'warning' }).then(() => ElMessage.success('重置成功')) }
const handleImport = () => { ElMessage.info('导入用户') }
const handleExport = () => { ElMessage.info('导出用户') }
const handleDeptClick = (data) => { ElMessage.info('选择部门: ' + data.name) }
const handleStatusChange = (row, val) => { ElMessage.success('状态更新为: ' + val) }
const handleSelectionChange = (val) => { selectedRows.value = val }
const handleSubmit = () => { dialogVisible.value = false; ElMessage.success('保存成功') }
const handleSizeChange = (size) => { pageSize.value = size }
const handleCurrentChange = (page) => { currentPage.value = page }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
