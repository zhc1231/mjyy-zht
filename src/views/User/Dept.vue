<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="部门名称">
          <el-input v-model="searchForm.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="name" label="部门名称" min-width="200">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" @click="handleAddChild(scope.row)">新增</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="上级部门">
          <el-select v-model="form.parentId" placeholder="请选择上级部门">
            <el-option label="无" value="" />
            <el-option label="国通" value="1" />
            <el-option label="良巧匠" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="显示排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="部门状态">
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

const searchForm = reactive({ name: '', status: '' })
const tableData = ref([
  { id: 1, name: '国通', sort: 1, status: '正常', createTime: '2025-01-01 10:00:00', children: [
    { id: 11, name: '技术部', sort: 1, status: '正常', createTime: '2025-01-01 10:00:00' },
    { id: 12, name: '财务部', sort: 2, status: '正常', createTime: '2025-01-02 10:00:00' }
  ]},
  { id: 2, name: '良巧匠', sort: 2, status: '正常', createTime: '2025-01-03 10:00:00', children: [
    { id: 21, name: '运营部', sort: 1, status: '正常', createTime: '2025-01-03 10:00:00' }
  ]}
])
const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const form = reactive({ parentId: '', name: '', sort: 0, leader: '', phone: '', email: '', status: '正常' })

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', status: '' }) }
const handleAdd = () => { dialogTitle.value = '新增部门'; Object.assign(form, { parentId: '', name: '', sort: 0, leader: '', phone: '', email: '', status: '正常' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '修改部门'; Object.assign(form, row); dialogVisible.value = true }
const handleAddChild = (row) => { dialogTitle.value = '新增子部门'; Object.assign(form, { parentId: row.id, name: '', sort: 0, leader: '', phone: '', email: '', status: '正常' }); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleSubmit = () => { dialogVisible.value = false; ElMessage.success('保存成功') }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
