<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="岗位编码">
          <el-input v-model="searchForm.code" placeholder="请输入岗位编码" />
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input v-model="searchForm.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="岗位状态">
            <el-option label="全部" value="" />
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
          <el-button disabled>修改</el-button>
          <el-button disabled>删除</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="岗位编号" width="100" />
        <el-table-column prop="code" label="岗位编码" min-width="150" />
        <el-table-column prop="name" label="岗位名称" min-width="150" />
        <el-table-column prop="sort" label="岗位排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="岗位编码">
          <el-input v-model="form.code" placeholder="请输入岗位编码" />
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input v-model="form.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位排序">
          <el-input-number v-model="form.sort" :min="0" />
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

const searchForm = reactive({ code: '', name: '', status: '' })
const tableData = ref([
  { id: 1, code: 'CEO', name: '首席执行官', sort: 1, status: '正常', createTime: '2025-01-01 10:00:00' },
  { id: 2, code: 'CTO', name: '技术总监', sort: 2, status: '正常', createTime: '2025-01-02 10:00:00' },
  { id: 3, code: 'CFO', name: '财务总监', sort: 3, status: '正常', createTime: '2025-01-03 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)
const dialogVisible = ref(false)
const dialogTitle = ref('新增岗位')
const form = reactive({ code: '', name: '', sort: 0, status: '正常' })
const selectedRows = ref([])

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { code: '', name: '', status: '' }) }
const handleAdd = () => { dialogTitle.value = '新增岗位'; Object.assign(form, { code: '', name: '', sort: 0, status: '正常' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '修改岗位'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleExport = () => { ElMessage.info('导出数据') }
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
