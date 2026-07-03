<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="参数名称">
          <el-input v-model="searchForm.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名">
          <el-input v-model="searchForm.key" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="系统内置">
          <el-select v-model="searchForm.builtin" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
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
        <el-table-column prop="id" label="参数主键" width="100" />
        <el-table-column prop="name" label="参数名称" min-width="150" />
        <el-table-column prop="key" label="参数键名" min-width="150" />
        <el-table-column prop="value" label="参数键值" min-width="200" />
        <el-table-column prop="builtin" label="系统内置" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.builtin === '是' ? 'success' : 'info'">{{ scope.row.builtin }}</el-tag>
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
        <el-form-item label="参数名称">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名">
          <el-input v-model="form.key" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值">
          <el-input v-model="form.value" type="textarea" />
        </el-form-item>
        <el-form-item label="系统内置">
          <el-radio-group v-model="form.builtin">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
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

const searchForm = reactive({ name: '', key: '', builtin: '', dateRange: [] })
const tableData = ref([
  { id: 1, name: '系统名称', key: 'sys_name', value: '民匠有约管理系统', builtin: '是', remark: '系统显示名称', createTime: '2025-01-01 10:00:00' },
  { id: 2, name: '系统版本', key: 'sys_version', value: 'v1.0.0', builtin: '是', remark: '系统当前版本', createTime: '2025-01-01 10:00:00' },
  { id: 3, name: '首页标题', key: 'home_title', value: '数据看板', builtin: '否', remark: '首页显示标题', createTime: '2025-01-02 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(6)
const dialogVisible = ref(false)
const dialogTitle = ref('新增参数')
const form = reactive({ name: '', key: '', value: '', builtin: '否', remark: '' })
const selectedRows = ref([])

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', key: '', builtin: '', dateRange: [] }) }
const handleAdd = () => { dialogTitle.value = '新增参数'; Object.assign(form, { name: '', key: '', value: '', builtin: '否', remark: '' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '修改参数'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
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