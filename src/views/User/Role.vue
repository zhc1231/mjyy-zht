<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="searchForm.key" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="角色状态">
            <el-option label="全部" value="" />
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
          <el-button disabled>删除</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="角色编号" width="100" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="key" label="权限字符" min-width="150" />
        <el-table-column prop="sort" label="显示顺序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-value="正常" inactive-value="停用" @change="(val) => handleStatusChange(scope.row, val)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" @click="handleDataPerm(scope.row)">数据权限</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.key" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree :data="menuTree" show-checkbox :props="{ label: 'name', children: 'children' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dataPermVisible" title="数据权限设置" width="500px">
      <el-form :model="dataPermForm" label-width="120px">
        <el-form-item label="数据范围">
          <el-radio-group v-model="dataPermForm.scope">
            <el-radio label="全部数据">全部数据</el-radio>
            <el-radio label="本部门数据">本部门数据</el-radio>
            <el-radio label="本部门及以下">本部门及以下</el-radio>
            <el-radio label="仅本人数据">仅本人数据</el-radio>
            <el-radio label="自定义数据">自定义数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataPermForm.scope === '自定义数据'" label="授权部门">
          <el-tree :data="deptTree" show-checkbox :props="{ label: 'name', children: 'children' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dataPermVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDataPermSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', key: '', status: '' })
const tableData = ref([
  { id: 1, name: '超级管理员', key: 'admin', sort: 1, status: '正常', createTime: '2025-01-01 10:00:00' },
  { id: 2, name: '普通角色', key: 'common', sort: 2, status: '正常', createTime: '2025-01-02 10:00:00' },
  { id: 3, name: '测试角色', key: 'test', sort: 3, status: '停用', createTime: '2025-01-03 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(63)
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const form = reactive({ name: '', key: '', sort: 0, status: '正常' })
const selectedRows = ref([])
const menuTree = ref([
  { name: '系统管理', children: [
    { name: '字典管理' },
    { name: '参数设置' },
    { name: '菜单管理' }
  ]},
  { name: '用户管理', children: [
    { name: '用户列表' },
    { name: '角色管理' }
  ]}
])

const dataPermVisible = ref(false)
const dataPermForm = reactive({ scope: '全部数据' })
const deptTree = ref([
  { name: '国通', children: [
    { name: '技术部' },
    { name: '财务部' }
  ]},
  { name: '良巧匠', children: [
    { name: '运营部' }
  ]}
])

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', key: '', status: '' }) }
const handleAdd = () => { dialogTitle.value = '新增角色'; Object.assign(form, { name: '', key: '', sort: 0, status: '正常' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '修改角色'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleDataPerm = (row) => { dataPermForm.scope = '全部数据'; dataPermVisible.value = true }
const handleExport = () => { ElMessage.success('导出成功') }
const handleStatusChange = (row, val) => { ElMessage.success('状态更新为: ' + val) }
const handleSelectionChange = (val) => { selectedRows.value = val }
const handleSubmit = () => { dialogVisible.value = false; ElMessage.success('保存成功') }
const handleSizeChange = (size) => { pageSize.value = size }
const handleCurrentChange = (page) => { currentPage.value = page }
const handleDataPermSubmit = () => { dataPermVisible.value = false; ElMessage.success('数据权限设置成功') }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
