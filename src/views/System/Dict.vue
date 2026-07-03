<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="字典名称">
          <el-input v-model="searchForm.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input v-model="searchForm.type" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
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
          <el-button type="danger" disabled>删除</el-button>
          <el-button type="warning" @click="handleRefresh">刷新缓存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="字典编号" width="100" />
        <el-table-column prop="name" label="字典名称" min-width="150" />
        <el-table-column prop="type" label="字典类型" min-width="150">
          <template #default="scope">
            <el-link type="primary" @click="handleTypeClick(scope.row)">{{ scope.row.type }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
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
        <el-form-item label="字典名称">
          <el-input v-model="form.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input v-model="form.type" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
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

const searchForm = reactive({ name: '', type: '', status: '', dateRange: [] })
const tableData = ref([
  { id: 1, name: '用户性别', type: 'sys_user_sex', status: '正常', remark: '用户性别列表', createTime: '2025-01-01 10:00:00' },
  { id: 2, name: '菜单状态', type: 'sys_show_hide', status: '正常', remark: '菜单状态列表', createTime: '2025-01-02 10:00:00' },
  { id: 3, name: '系统开关', type: 'sys_normal_disable', status: '正常', remark: '系统开关列表', createTime: '2025-01-03 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(107)
const dialogVisible = ref(false)
const dialogTitle = ref('新增字典')
const form = reactive({ name: '', type: '', status: '正常', remark: '' })
const selectedRows = ref([])

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', type: '', status: '', dateRange: [] }) }
const handleAdd = () => { dialogTitle.value = '新增字典'; Object.assign(form, { name: '', type: '', status: '正常', remark: '' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '修改字典'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除该字典吗？', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleTypeClick = (row) => { ElMessage.info('查看字典数据: ' + row.type) }
const handleRefresh = () => { ElMessage.success('缓存刷新成功') }
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